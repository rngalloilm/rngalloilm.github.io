module.exports = (app) => {

    const express = require('express');
    const router = express.Router();
    const db = require('../database/database');
    const { Op } = require("sequelize");

    // Import all relevant models
    const Tree = require('../models/tree.model');
    const Cone = require('../models/cone.model');
    const Seed = require('../models/seed.model');
    const Ramet = require('../models/ramet.model');
    const Location = require('../models/locations.model');
    const GeneticId = require('../models/genetic-id.model');
    const Population = require('../models/population.model');
    const Species = require('../models/species.model');

    const models = {
        trees: Tree,
        cones: Cone,
        seeds: Seed,
        ramets: Ramet,
        locations: Location,
        geneticIds: GeneticId,
        populations: Population,
        species: Species
    };

    // checkout Endpoint
    router.post('/checkout', async (req, res) => {
        const userId = req.header('x-shib_uid');
        if (!userId) {
            return res.status(401).send('Unauthorized');
        }

        const { entriesToCheckout } = req.body;
        let checkedOutData = {};
        let conflicts = [];
        const transaction = await db.transaction();

        try {
            for (const modelName in entriesToCheckout) {
                if (models[modelName] && entriesToCheckout[modelName].length > 0) {
                    const Model = models[modelName];
                    const ids = entriesToCheckout[modelName];
                    checkedOutData[modelName] = [];
                    const pkFieldName = Model.primaryKeyField;

                    const existingEntries = await Model.findAll({
                        where: {
                            [pkFieldName]: { [Op.in]: ids }
                        },
                        transaction,
                        lock: transaction.LOCK.UPDATE
                    });

                    const foundIds = existingEntries.map(e => e[pkFieldName]?.toString());
                    ids.forEach(id => {
                    if (!foundIds.includes(id?.toString())) {
                        conflicts.push({ type: modelName, id: id, message: 'Entry not found in database' });
                    }
                    });

                    for (const entry of existingEntries) {
                        if (entry.isCheckedOut && entry.checkedOutBy !== userId) {
                            conflicts.push({ type: modelName, id: entry[pkFieldName], message: `Locked by ${entry.checkedOutBy}` });
                        }
                        else if (!entry.isCheckedOut || entry.checkedOutBy === userId) {
                            await entry.update({ isCheckedOut: true, checkedOutBy: userId }, { transaction });
                            checkedOutData[modelName].push(entry.toJSON());
                            
                        }
                        else {
                            conflicts.push({ type: modelName, id: entry[pkFieldName] || 'unknown', message: 'Unexpected checkout state' });
                        }
                    }

                    
                }
            }

            if (conflicts.length > 0) {
                await transaction.rollback();
                console.warn("Checkout conflicts:", conflicts);
                return res.status(409).json({ message: "Checkout conflicts detected.", conflicts });
            }

            await transaction.commit();
            res.status(200).json({ message: "Checkout successful", checkedOutData });

        } catch (error) {
            await transaction.rollback();
            console.error("Checkout Error:", error);
            res.status(500).send('Server error');
        }
    });


    // sync Endpoint
    router.post('/sync', async (req, res) => {
        const userId = req.header('x-shib_uid');
        if (!userId) {
            return res.status(401).send('Unauthorized');
        }

        const { added = {}, modified = {}, deleted = {} } = req.body;
        const transaction = await db.transaction();
        let syncResults = { addedMappings: [], errors: [] };

        try {
            for (const modelName in deleted) {
                if (models[modelName] && deleted[modelName].length > 0) {
                    const Model = models[modelName];
                    const pkFieldName = Model.primaryKeyField;
                    const idsToDelete = deleted[modelName];

                    const [affectedRows] = await Model.update(
                        { active: false },
                        {
                            where: {
                                [pkFieldName]: { [Op.in]: idsToDelete },
                                checkedOutBy: userId
                            },
                            transaction
                        }
                    );
                    if (affectedRows < idsToDelete.length) {
                        console.warn(`Sync Deletion Warning for ${modelName}: Requested ${idsToDelete.length}, soft-deleted ${affectedRows}.`);
                    }
                }
            }

            for (const modelName in modified) {
                if (models[modelName] && modified[modelName].length > 0) {
                    const Model = models[modelName];
                    const pkFieldName = Model.primaryKeyField;

                    for (const entryData of modified[modelName]) {
                        delete entryData._syncStatus;
                        delete entryData.tempId;

                        const pkValue = entryData[pkFieldName];

                        const [affectedRows] = await Model.update(entryData, {
                            where: {
                                [pkFieldName]: pkValue,
                                checkedOutBy: userId
                            },
                            transaction
                        });

                        if (affectedRows === 0) {
                        syncResults.errors.push({type: modelName, id: pkValue, error: 'Update failed - ownership/ID issue'});
                        }
                    }
                }
            }

            syncResults.addedMappings = [];
            for (const modelName in added) {
                syncResults.addedMappings[modelName] = [];
                if (models[modelName] && added[modelName].length > 0) {
                    const Model = models[modelName];
                    const pkFieldName = Model.primaryKeyField;

                    for (const entryData of added[modelName]) {
                        const tempId = entryData.tempId;
                        delete entryData._syncStatus;
                        delete entryData.tempId;
                        if (tempId && Model.autoIncrementAttribute === pkFieldName) {
                            delete entryData[pkFieldName];
                        }

                        entryData.isCheckedOut = false;
                        entryData.checkedOutBy = null;
                        entryData.active = true;

                        const newEntry = await Model.create(entryData, { transaction });

                        if (tempId) {
                            syncResults.addedMappings.push({ tempId: tempId, newId: newEntry[pkFieldName], modelName: modelName });
                        } else {
                            syncResults.addedMappings.push({ newId: newEntry[pkFieldName], modelName: modelName });
                        }
                    }
                }
            }

            if (syncResults.errors.length > 0) {
                await transaction.rollback();
                console.error('Sync errors occurred:', syncResults.errors);
                return res.status(400).json({ message: 'Sync failed with errors.', errors: syncResults.errors });
            }

            await transaction.commit();
            res.status(200).json({ message: 'Sync successful', addedMappings: syncResults.addedMappings });

        } catch (error) {
            await transaction.rollback();
            console.error("Sync Error:", error);
            res.status(500).send('Server error');
        }
    });


    // // unlock Endpoint
    // router.post('/unlock', async (req, res) => {
    //     const userId = req.header('x-shib_uid');
    //     if (!userId) {
    //         return res.status(401).send('Unauthorized');
    //     }

    //     const { entriesToUnlock } = req.body;
    //     const transaction = await db.transaction();

    //     try {
    //         for (const modelName in entriesToUnlock) {
    //             if (models[modelName] && entriesToUnlock[modelName].length > 0) {
    //                 const Model = models[modelName];
    //                 const pkFieldName = Model.primaryKeyField;
    //                 const ids = entriesToUnlock[modelName];

    //                 const [affectedRows] = await Model.update(
    //                     { isCheckedOut: false, checkedOutBy: null },
    //                     {
    //                         where: {
    //                             [pkFieldName]: { [Op.in]: ids },
    //                             checkedOutBy: userId
    //                         },
    //                         transaction
    //                     }
    //                 );

    //                 if (affectedRows < ids.length) {
    //                     console.warn(`Unlock Warning for ${modelName}: Requested ${ids.length}, unlocked ${affectedRows}.`);
    //                 }
    //             }
    //         }

    //         await transaction.commit();
    //         res.sendStatus(200);

    //     } catch (error) {
    //         await transaction.rollback();
    //         console.error("Unlock Error:", error);
    //         res.status(500).send('Server error');
    //     }
    // });

    // unlock Endpoint - Added Implementation
    router.post('/unlock', async (req, res) => {
        const userId = req.header('x-shib_uid');
        if (!userId) {
            return res.status(401).send('Unauthorized');
        }

        const { entriesToUnlock } = req.body; // e.g., { trees: [1, 5], cones: [10] }
        
        if (!entriesToUnlock || typeof entriesToUnlock !== 'object') {
             return res.status(400).send('Invalid request body: entriesToUnlock is missing or not an object.');
        }

        const transaction = await db.transaction();
        let totalRequested = 0;
        let totalAffected = 0;

        try {
            for (const modelName in entriesToUnlock) {
                // Check if the model exists in our predefined map
                if (models[modelName] && Array.isArray(entriesToUnlock[modelName]) && entriesToUnlock[modelName].length > 0) {
                    const Model = models[modelName];
                    const pkFieldName = Model.primaryKeyField; // Get the actual primary key field name
                    const ids = entriesToUnlock[modelName];
                    totalRequested += ids.length;

                    // Perform the update operation within the transaction
                    // Only unlock items that are currently checked out BY THIS USER
                    const [affectedRows] = await Model.update(
                        { isCheckedOut: false, checkedOutBy: null }, // Fields to update
                        {
                            where: {
                                [pkFieldName]: { [Op.in]: ids }, // Target the specific IDs
                                checkedOutBy: userId           // Ensure only the user who checked out can unlock
                            },
                            transaction // Associate with the transaction
                        }
                    );

                    totalAffected += affectedRows;

                    // Optional: Log if not all requested items were unlocked by this user
                    if (affectedRows < ids.length) {
                        console.warn(`Unlock Warning for ${modelName}: Requested ${ids.length} owned by ${userId}, unlocked ${affectedRows}. Others might be locked by someone else or already unlocked.`);
                    }
                } else if (!models[modelName]) {
                    console.warn(`Unlock skipped: Unknown model type "${modelName}"`);
                } else if (!Array.isArray(entriesToUnlock[modelName])) {
                     console.warn(`Unlock skipped for ${modelName}: Invalid data format (expected array).`);
                 }
                 // If length is 0, just skip this model type
            }

            // If everything went well (no database errors), commit the transaction
            await transaction.commit();
            console.log(`Unlock requested for ${totalRequested} items by ${userId}, successfully unlocked ${totalAffected} owned items.`);
            res.status(200).json({ message: `Unlock successful. ${totalAffected} items updated.` }); // Send 200 OK

        } catch (error) {
            // If any error occurred during the database operations, rollback the transaction
            await transaction.rollback();
            console.error("Unlock Error:", error);
            res.status(500).send('Server error during unlock operation.'); // Send 500 Internal Server Error
        }
    });

    app.use('/offline', router);

};
    