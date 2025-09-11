module.exports = (app) => {
    const Maturation = require('../models/maturation.model');
    let route = require('express').Router();
    const db = require('../database/database');

    //Get all maturation
    route.get('/', async (req, res) => {
        await Maturation.findAll().then((innerRes) => {
            res.statusCode = 200;
            res.statusMessage = 'OK';
            res.send(innerRes);
        }).catch((error) => {
            console.log("Error in fetching maturation: ", error);
        })
    });

    // Posts a maturation to the database
    route.post('/', (req, res) => {
        const reqId = req.body.maturationId;
        const reqNumberOfPlates = req.body.numberOfPlates;
        const reqMediaBatch = req.body.mediaBatch;
        const reqDateMatured = req.body.dateMatured;
        const reqGeneticId = req.body.maturationGeneticId;
        const reqLocationId = req.body.locationId;
        const reqTransferDate = req.body.transferDate;


        db.sync().then(() => {
            Maturation.create({
                maturationId: reqId,
                numberOfPlates: reqNumberOfPlates,
                mediaBatch: reqMediaBatch,
                dateMatured: reqDateMatured,
                transferDate: reqTransferDate,
                active: true,
                maturationGeneticId: reqGeneticId,
                locationId: reqLocationId
            }).then((innerRes) => {
                res.sendStatus(200);
            }).catch((error) => {
                console.log("Error Inserting Record: ", error);
                res.sendStatus(400);
            })
        })
    });

    // Gets a maturation by id
    route.get('/:id', async (req, res) => {
        const reqId = req.params.id;
        const maturation = await Maturation.findOne({ where: { maturationId: reqId } });
        if (maturation) {
            res.statusCode = 200;
            res.statusMessage = 'OK';
            res.send(maturation);

        } else {
            res.sendStatus(404);
        }
    });

    // Updates a maturation by id
    route.put('/:id', async (req, res) => {
        const reqId = req.params.id;
        const maturation = await Maturation.findOne({ where: { maturationId: reqId } });

        // check the id is valid
        if (reqId == null || reqId == undefined) {
            res.sendStatus(400);
        }

        if (maturation) {
            maturation.update({active: maturation.active ? false : true});
            res.sendStatus(200);

        } else {
            res.sendStatus(404);
        }
    });

    route.put('/update/:id', async (req, res) => {
        const reqId = req.params.id;
        const maturation = await Maturation.findOne({ where: { maturationId: reqId } });

        if (maturation) {
            const reqId = req.body.maturationId;
            const reqNumberOfPlates = req.body.numberOfPlates;
            const reqMediaBatch = req.body.mediaBatch;
            const reqDateMatured = req.body.dateMatured;
            const reqGeneticId = req.body.maturationGeneticId;
            const reqLocationId = req.body.locationId;
            const reqActive = req.body.active;
            const reqTransferDate = req.body.transferDate;


            if (reqId == null || reqId == undefined || reqNumberOfPlates == null 
                || reqNumberOfPlates == undefined || reqMediaBatch == null || 
                reqMediaBatch == undefined || reqDateMatured == null || reqDateMatured == undefined 
                || reqGeneticId == null || reqGeneticId == undefined || reqLocationId == null || 
                reqLocationId == undefined || reqActive == null || reqActive == undefined
                || reqTransferDate == null || reqTransferDate == undefined) {
                res.sendStatus(400);
                return;
            }
            maturation.update({
                maturationId: reqId,
                numberOfPlates: reqNumberOfPlates,
                mediaBatch: reqMediaBatch,
                transferDate: reqTransferDate,
                dateMatured: reqDateMatured,
                active: reqActive,
                maturationGeneticId: reqGeneticId,
                locationId: reqLocationId
            });
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    });
    // Deletes a maturation by id
    route.delete('/:id', async (req, res) => {
        const reqId = req.params.id;
        try {
            const maturation = await Maturation.findOne({ where: { maturationId: reqId } });

            if (maturation) {
                await maturation.destroy();
                res.sendStatus(200);
    
            } else {
                res.sendStatus(404);
            }
        } catch (error) {
            console.log("Error deleting maturation: ", error);
            res.sendStatus(500);
        }
    });

    app.use('/maturations', route);
}