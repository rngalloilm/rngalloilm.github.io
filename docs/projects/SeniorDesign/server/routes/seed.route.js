module.exports = (app) => {

    const Seed = require('../models/seed.model');
    let router = require('express').Router();
    const db = require('../database/database');

    //Get all seeds
    router.get('/', async (req, res) => {
        await Seed.findAll().then((innerRes) => {
            res.statusCode = 200;
            res.statusMessage = 'OK';
            res.send(innerRes);
        }).catch((error) => {
            console.log("Error in fetching seeds: ", error);
        })
    });

    // Posts a seed to the database
    router.post('/', (req, res) => {
        const reqId = req.body.id;
        const reqOrigin = req.body.origin;
        const reqQuantity = req.body.quantity;
        const reqDateMade = req.body.dateMade;
        const reqMotherTreeId = req.body.motherTreeId;
        const reqFatherTreeId = req.body.fatherTreeId;
        const reqSeedGeneticId = req.body.seedGeneticId;
        const reqConeId = req.body.coneId;
        const reqLocationId = req.body.locationId;
        const reqTransferDate = req.body.transferDate;

        console.log(reqDateMade + '\n' + reqTransferDate);

        db.sync().then(() => {
            Seed.create({
                id: reqId,
                origin: reqOrigin,
                quantity: reqQuantity,
                dateMade: reqDateMade,
                active: true,
                transferDate: reqTransferDate,
                motherTreeId: reqMotherTreeId,
                fatherTreeId: reqFatherTreeId,
                seedGeneticId: reqSeedGeneticId,
                coneId: reqConeId,
                locationId: reqLocationId,
                isCheckedOut: false,
                checkedOutBy: null
            }).then((innerRes) => {
                res.sendStatus(200);
            }).catch((error) => {
                console.log("Error Inserting Record: ", error);
                res.sendStatus(400);
            })
        })
    });

    // Gets a seed by id
    router.get('/:id', async (req, res) => {
        const reqId = req.params.id;
        const seed = await Seed.findOne({ where: { id: reqId } });
        if (seed) {
            res.statusCode = 200;
            res.statusMessage = 'OK';
            res.send(seed);
        } else {
            res.sendStatus(404);
        }

    });

    // Updates a seed by id
    router.put('/:id', async (req, res) => {
        const reqId = req.params.id;
        const seed = await Seed.findOne({ where: { id: reqId } });
        if (seed) {
            seed.update({ active: seed.active ? false : true });
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    });

    router.put('/edit/:id', async (req, res) => {

        const reqId = req.params.id;
        const reqOrigin = req.body.origin;
        const reqQuantity = req.body.quantity;
        const reqDateMade = req.body.dateMade;
        const reqMotherTreeId = req.body.motherTreeId;
        const reqFatherTreeId = req.body.fatherTreeId;
        const reqSeedGeneticId = req.body.seedGeneticId;
        const reqConeId = req.body.coneId;
        const reqLocationId = req.body.locationId;
        const reqTransferDate = req.body.transferDate;

        const seed = await Seed.findOne({ where: { id: reqId } });
        if (seed) {

            seed.update({
                origin: reqOrigin,
                quantity: reqQuantity,
                dateMade: reqDateMade,
                motherTreeId: reqMotherTreeId,
                fatherTreeId: reqFatherTreeId,
                transferDate: reqTransferDate,
                seedGeneticId: reqSeedGeneticId,
                coneId: reqConeId,
                locationId: reqLocationId
            });
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    });


    // Deletes a seed by id, for testing
    router.delete('/:id', async (req, res) => {
        const reqId = req.params.id;
        try {
            const seed = await Seed.findOne({ where: { id: reqId } });
            if (seed) {
                await seed.destroy();
                res.sendStatus(200);
            } else {
                res.sendStatus(404);
            }
        } catch (error) {
            console.log("Error deleting seed: ", error);
            res.sendStatus(500);
        }
    });
    
    app.use('/seeds', router);
};