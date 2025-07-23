module.exports = (app) => {

    const Maintenance = require('../models/maintenance.model');
    let router = require('express').Router();
    const db = require('../database/database');
    
    //Get all maintenances
    router.get('/', async (req, res) => {
        await Maintenance.findAll().then((innerRes) => {
            res.statusCode = 200;
            res.statusMessage = 'OK';
            res.send(innerRes);
        }).catch((error) => {
            console.log("Error in fetching maintenances: ", error);
        })
    });

    // Posts a maintenance to the database
    router.post('/', (req, res) => {
        const reqId = req.body.maintenanceId;
        const reqNumberOfPlates = req.body.numberOfPlates;
        const reqMediaBatchCurr = req.body.mediaBatchCurr;
        const reqDateCurr = req.body.dateCurr;
        const reqMediaBatchPrev = req.body.mediaBatchPrev;
        const reqDatePrev = req.body.datePrev;
        const reqGeneticId = req.body.maintenanceGeneticId;
        const reqLocationId = req.body.locationId;
        const reqTransferDate = req.body.transferDate;


        db.sync().then(() => {
            Maintenance.create({
                maintenanceId: reqId,
                numberOfPlates: reqNumberOfPlates,
                mediaBatchCurr: reqMediaBatchCurr,
                dateCurr: reqDateCurr,
                mediaBatchPrev: reqMediaBatchPrev,
                datePrev: reqDatePrev,
                transferDate: reqTransferDate,
                active: true,
                maintenanceGeneticId: reqGeneticId,
                locationId: reqLocationId
            }).then((innerRes) => {
                res.sendStatus(200);
            }).catch((error) => {
                console.log("Error Inserting Record: ", error);
                res.sendStatus(400);
            })
        })
    });

    // Gets a maintenance by id
    router.get('/:id', async (req, res) => {
        const reqId = req.params.id;
        const maintenance = await Maintenance.findOne({ where: { maintenanceId: reqId } });
        if (maintenance) {
            res.statusCode = 200;
            res.statusMessage = 'OK';
            res.send(maintenance);

        } else {
            res.sendStatus(404);
        }
    });

    // Updates a maintenance by id
    router.put('/:id', async (req, res) => {
        const reqId = req.params.id;
        const maintenance = await Maintenance.findOne({ where: { maintenanceId: reqId } });

        if (maintenance) {
            maintenance.update({active: maintenance.active ? false : true});
            res.sendStatus(200);

        } else {
            res.sendStatus(404);
        }
    });

    router.put('/update/:id', async (req, res) => {
        const reqId = req.params.id;
        const maintenance = await Maintenance.findOne({ where: { maintenanceId: reqId } });

        if (maintenance) {
            const reqId = req.body.maintenanceId;
            const reqNumberOfPlates = req.body.numberOfPlates;
            const reqMediaBatchCurr = req.body.mediaBatchCurr;
            const reqDateCurr = req.body.dateCurr;
            const reqMediaBatchPrev = req.body.mediaBatchPrev;
            const reqDatePrev = req.body.datePrev;
            const reqGeneticId = req.body.maintenanceGeneticId;
            const reqLocationId = req.body.locationId;
            const reqActive = req.body.active;
            const reqTransferDate = req.body.transferDate;


            if (reqId == null || reqNumberOfPlates == null || reqMediaBatchCurr == null 
                || reqDateCurr == null || reqMediaBatchPrev == null || reqDatePrev == null 
                || reqGeneticId == null || reqLocationId == null || reqActive == null ||
                reqTransferDate) {
                res.sendStatus(400);
                return;
            }

            maintenance.update({
                maintenanceId: reqId,
                numberOfPlates: reqNumberOfPlates,
                mediaBatchCurr: reqMediaBatchCurr,
                dateCurr: reqDateCurr,
                transferDate: reqTransferDate,
                mediaBatchPrev: reqMediaBatchPrev,
                datePrev: reqDatePrev,
                active: reqActive,
                maintenanceGeneticId: reqGeneticId,
                locationId: reqLocationId
            });
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    });

    // Deletes a maintenance by id
    router.delete('/:id', async (req, res) => {
        const reqId = req.params.id;
        try {
            const maintenance = await Maintenance.findOne({ where: { maintenanceId: reqId } });

            if (maintenance) {
                await maintenance.destroy();
                res.sendStatus(200);
    
            } else {
                res.sendStatus(404);
            }
        } catch (error) {
            console.log("Error deleting maintenance: ", error);
            res.sendStatus(500);
        }
    });

    app.use('/maintenances', router)
}