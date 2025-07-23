module.exports = (app) => {

    const Greenhouse = require('../models/greenhouse.model');
    let router = require('express').Router();
    const db = require('../database/database');

    //Get all greenhouses
    router.get('/', async (req, res) => {
        await Greenhouse.findAll().then((innerRes) => {
            res.statusCode = 200;
            res.statusMessage = 'OK';
            res.send(innerRes);
        }).catch((error) => {
            console.log("Error in fetching greenhouses: ", error);
        })
    });

    // Posts a greenhouse to the database
    router.post('/', (req, res) => {
        const reqId = req.body.greenhouseId;
        const reqDateGreenhouse = req.body.dateGreenhouse;
        const reqLocationId = req.body.locationId;
        const reqGeneticId = req.body.greenhouseGeneticId;
        const reqTransferDate = req.body.transferDate;

        db.sync().then(() => {
            Greenhouse.create({
                greenhouseId: reqId,
                active: true,
                dateGreenhouse: reqDateGreenhouse,
                locationId: reqLocationId,
                greenhouseGeneticId: reqGeneticId,
                transferDate: reqTransferDate
            }).then((innerRes) => {
                res.sendStatus(200);
            }).catch((error) => {
                console.log("Error Inserting Record: ", error);
                res.sendStatus(400);
            })
        })
    });

    // Gets a greenhouse by id
    router.get('/:id', async (req, res) => {
        const reqId = req.params.id;
        const greenhouse = await Greenhouse.findOne({ where: { greenhouseId: reqId } });
        if (greenhouse) {
            res.statusCode = 200;
            res.statusMessage = 'OK';
            res.send(greenhouse);

        } else {
            res.sendStatus(404);
        }
    });

    // Updates a greenhouse by id
    router.put('/:id', async (req, res) => {
        const reqId = req.params.id;
        const greenhouse = await Greenhouse.findOne({ where: { greenhouseId: reqId } });

        if (greenhouse) {
            greenhouse.update({ active: greenhouse.active ? false: true})
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    });

    router.put('/update/:id', async (req, res) => {
        const reqId = req.params.id;
        const greenhouse = await Greenhouse.findOne({ where: { greenhouseId: reqId } });

        if (greenhouse) {
            const reqDateGreenhouse = req.body.dateGreenhouse;
            const reqLocationId = req.body.locationId;
            const reqGeneticId = req.body.greenhouseGeneticId;
            const reqActive = req.body.active;
            const reqGreenhouseId = req.body.greenhouseId;
            const reqTransferDate = req.body.transferDate;


            if (reqDateGreenhouse == null || reqLocationId == null || reqGeneticId == null || reqActive == null || reqGreenhouseId == null
                || reqTransferDate == null) {
                res.sendStatus(400);
                return;
            }

            greenhouse.update({
                dateGreenhouse: reqDateGreenhouse,
                locationId: reqLocationId,
                greenhouseGeneticId: reqGeneticId,
                active: reqActive,
                greenhouseId: reqGreenhouseId,
                transferDate: reqTransferDate
                
            })
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    });


    // Deletes a greenhouse by id
    router.delete('/:id', async (req, res) => {
        const reqId = req.params.id;
        try {
            const greenhouse = await Greenhouse.findOne({ where: { greenhouseId: reqId } });

            if (greenhouse) {
                await greenhouse.destroy();
                res.sendStatus(200);
            } else {
                res.sendStatus(404);
            }
        } catch (error) {
            console.log("Error deleting greenhouse: ", error);
            res.sendStatus(500);
        }
    });

    app.use('/greenhouses', router);
};