module.exports = (app) => {

    const FieldStation = require('../models/fieldstation.model');
    let router = require('express').Router();
    const db = require('../database/database');

    //Get all field stations
    router.get('/', async (req, res) => {
        await FieldStation.findAll().then((innerRes) => {
            res.statusCode = 200;
            res.statusMessage = 'OK';
            res.send(innerRes);
        }).catch((error) => {
            console.log("Error in fetching field stations: ", error);
        })
    });

    // Posts a field station to the database
    router.post('/', (req, res) => {
        const reqId = req.body.fieldStationId;
        const reqDatePlanted = req.body.datePlanted;
        const reqGeneticId = req.body.fieldStationGeneticId;
        const reqLocationId = req.body.locationId;

        db.sync().then(() => {
            FieldStation.create({
                fieldStationId: reqId,
                datePlanted: reqDatePlanted,
                active: true,
                fieldStationGeneticId: reqGeneticId,
                locationId: reqLocationId
            }).then((innerRes) => {
                res.sendStatus(200);
            }).catch((error) => {
                console.log("Error Inserting Record: ", error);
                res.sendStatus(400);
            })
        })
    });

    // Gets a field station by id
    router.get('/:id', async (req, res) => {
        const reqId = req.params.id;
        const fieldStation = await FieldStation.findOne({ where: { fieldStationId: reqId } });
        if (fieldStation) {
            res.statusCode = 200;
            res.statusMessage = 'OK';
            res.send(fieldStation);
        } else {
            res.sendStatus(404);
        }
    });

    // Updates a field station by id
    router.put('/:id', async (req, res) => {
        const reqId = req.params.id;
        const fieldStation = await FieldStation.findOne({ where: { fieldStationId: reqId } });

        if (fieldStation) {
            fieldStation.update({ active: fieldStation.active ? false: true});
            res.sendStatus(200);

        } else {
            res.sendStatus(404);
        }
    });

    router.put('/update/:id', async (req, res) => {
        const reqId = req.params.id;
        const fieldStation = await FieldStation.findOne({ where: { fieldStationId: reqId } });

        if (fieldStation) {
            const reqDatePlanted = req.body.datePlanted;
            const reqGeneticId = req.body.fieldStationGeneticId;
            const reqLocationId = req.body.locationId;
            const reqActive = req.body.active;
            const reqFieldStationId = req.body.fieldStationId;

            if (reqId == null || reqDatePlanted == null || reqGeneticId == null || reqLocationId == null || reqActive == null || reqFieldStationId == null) {
                res.sendStatus(400);
                return;
            }
            fieldStation.update({
                datePlanted: reqDatePlanted,
                active: reqActive,
                fieldStationGeneticId: reqGeneticId,
                locationId: reqLocationId,
                fieldStationId: reqFieldStationId
            });
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    });

    // Deletes a field station by id
    router.delete('/:id', async (req, res) => {
        const reqId = req.params.id;
        try {
            const fieldStation = await FieldStation.findOne({ where: { fieldStationId: reqId } });
            if (fieldStation) {
                await fieldStation.destroy();
                res.sendStatus(200);
            } else {
                res.sendStatus(404);
            }
        } catch (error) {
            console.log("Error deleting field station: ", error);
            res.sendStatus(500);
        }
    });

    app.use('/fieldstations', router);
}