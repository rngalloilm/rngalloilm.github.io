module.exports = (app) => {
    const Germination = require('../models/germination.model');
    let router = require('express').Router();
    const db = require('../database/database');

    //Get all germinations
    router.get('/', async (req, res) => {
        await Germination.findAll().then((innerRes) => {
            res.statusCode = 200;
            res.statusMessage = 'OK';
            res.send(innerRes);
        }).catch((error) => {
            console.log("Error in fetching germinations: ", error);
        })
    });

    // Posts a germination to the database
    router.post('/', (req, res) => {
        const reqId = req.body.germinationId;
        const reqNumberEmbryos = req.body.numberEmbryos;
        const reqMediaBatch = req.body.mediaBatch;
        const reqDateGermination = req.body.dateGermination;
        const reqGeneticId = req.body.germinationGeneticId;
        const reqLocationId = req.body.locationId;
        const reqTransferDate = req.body.transferDate;

        db.sync().then(() => {
            Germination.create({
                germinationId: reqId,
                numberEmbryos: reqNumberEmbryos,
                mediaBatch: reqMediaBatch,
                dateGermination: reqDateGermination,
                transferDate: reqTransferDate,
                active: true,
                germinationGeneticId: reqGeneticId,
                locationId: reqLocationId
            }).then((innerRes) => {
                res.sendStatus(200);
            }).catch((error) => {
                console.log("Error Inserting Record: ", error);
                res.sendStatus(400);
            })
        })
    });

    // Gets a germination by id
    router.get('/:id', async (req, res) => {
        const reqId = req.params.id;
        const germination = await Germination.findOne({ where: { germinationId: reqId } });
        if (germination) {
            res.statusCode = 200;
            res.statusMessage = 'OK';
            res.send(germination);

        } else {
            res.sendStatus(404);
        }
    });

    // Updates a germination by id
    router.put('/:id', async (req, res) => {
        const reqId = req.params.id;
        const germination = await Germination.findOne({ where: { germinationId: reqId } });

        if (germination) {
            germination.update({ active: germination.active ? false: true});
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    });

    router.put('/update/:id', async (req, res) => {
        const reqId = req.params.id;
        const germination = await Germination.findOne({ where: { germinationId: reqId } });

        if (germination) {
            
            const reqNumberEmbryos = req.body.numberEmbryos;
            const reqMediaBatch = req.body.mediaBatch;
            const reqDateGermination = req.body.dateGermination;
            const reqGeneticId = req.body.germinationGeneticId;
            const reqLocationId = req.body.locationId;
            const reqActive = req.body.active;
            const reqTransferDate = req.body.transferDate;

            if (reqNumberEmbryos == null || reqMediaBatch == null ||
                reqDateGermination == null || reqGeneticId == null || reqLocationId == null || reqActive == null 
                || reqTransferDate == null) {
                res.sendStatus(400);
                return;
            }
            germination.update({
                numberEmbryos: reqNumberEmbryos,
                mediaBatch: reqMediaBatch,
                dateGermination: reqDateGermination,
                transferDate: reqTransferDate,
                germinationGeneticId: reqGeneticId,
                locationId: reqLocationId,
                active: reqActive
            });
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    });


    // Deletes a germination by id
    router.delete('/:id', async (req, res) => {
        const reqId = req.params.id;
        try {
            const germination = await Germination.findOne({ where: { germinationId: reqId } });

            if (germination) {
                await germination.destroy();
                res.sendStatus(200);
            } else {
                res.sendStatus(404);
            }
        } catch (error) {
            console.log("Error deleting germination: ", error);
            res.sendStatus(500);
        }
    });

    app.use('/germinations', router);
};