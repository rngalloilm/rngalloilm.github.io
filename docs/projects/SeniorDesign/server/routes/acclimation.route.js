module.exports = (app) => {

    const Acclimation = require('../models/acclimation.model');
    let router = require('express').Router();
    const db = require('../database/database');

    //Get all acclimations
    router.get('/', async (req, res) => {
        await Acclimation.findAll().then((innerRes) => {
            res.statusCode = 200;
            res.statusMessage = 'OK';
            res.send(innerRes);
        }).catch((error) => {
            console.log("Error in fetching acclimations: ", error);
        })
    });

    // Posts an acclimation to the database
    router.post('/', (req, res) => {
        const reqId = req.body.acclimationId;
        const reqDateAcclimation = req.body.dateAcclimation;
        const reqLocationId = req.body.locationId;
        const reqGeneticId = req.body.acclimationGeneticId;
        const reqTransferDate = req.body.transferDate;

        db.sync().then(() => {
            Acclimation.create({
                acclimationId: reqId,
                dateAcclimation: reqDateAcclimation,
                active: true,
                locationId: reqLocationId,
                acclimationGeneticId: reqGeneticId,
                transferDate: reqTransferDate
            }).then((innerRes) => {
                res.sendStatus(200);
            }).catch((error) => {
                console.log("Error Inserting Record: ", error);
                res.sendStatus(400);
            })
        })
    });

    // Gets an acclimation by id
    router.get('/:id', async (req, res) => {
        const reqId = req.params.id;
        const acclimation = await Acclimation.findOne({ where: { acclimationId: reqId } });
        if (acclimation) {
            res.statusCode = 200;
            res.statusMessage = 'OK';
            res.send(acclimation);
        } else {
            res.sendStatus(404);
        }
    });

    // Updates an acclimation by id
    router.put('/:id', async (req, res) => {
        const reqId = req.params.id;
        const acclimation = await Acclimation.findOne({ where: { acclimationId: reqId } });
        
        if (acclimation) {
            acclimation.update( {active: acclimation.active ? false: true});
            res.sendStatus(200);

        } else {
            res.sendStatus(404);
        }
    });

    router.put('/update/:id', async (req, res) => {
        const reqId = req.params.id;
        const acclimation = await Acclimation.findOne({ where: { acclimationId: reqId } });
        if (acclimation) {
            const reqDateAcclimation = req.body.dateAcclimation;
            const reqLocationId = req.body.locationId;
            const reqGeneticId = req.body.acclimationGeneticId;
            const reqActive = req.body.active;
            const reqAcclimationId = req.body.acclimationId;
            const reqTransferDate = req.body.transferDate;


            if (reqId == null || reqDateAcclimation == null || reqLocationId == null || reqGeneticId == null || reqActive == null || reqAcclimationId == null) {
                res.sendStatus(400);
                return;
            }
            acclimation.update({
                acclimationId: reqAcclimationId,
                dateAcclimation: reqDateAcclimation,
                locationId: reqLocationId,
                acclimationGeneticId: reqGeneticId,
                transferDate: reqTransferDate,
                active: reqActive
            });
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    });

    // Deletes an acclimation by id
    router.delete('/:id', async (req, res) => {
        const reqId = req.params.id;
        try {
            const acclimation = await Acclimation.findOne({ where: { acclimationId: reqId } });
            if (acclimation) {
                await acclimation.destroy();
                res.sendStatus(200);
            } else {
                res.sendStatus(404);
            }
        } catch (error) {
            console.log("Error deleting acclimation: ", error);
            res.sendStatus(500);
        }
        
        

        
    });

    app.use('/acclimations', router);
};