module.exports = (app) => {
  const Ramet = require('../models/ramet.model');
  let router = require('express').Router();
  const db = require('../database/database');

  //Gets all Ramets
  router.get('/', async (req, res) => {
    Ramet.findAll().then((innerRes) => {
      res.statusCode = 200;
      res.statusMessage = 'OK';
      res.send(innerRes);
    }).catch((error) => {
      console.log("Error in fetching ramets: ", error);
    })
  });

  // Get a single Ramet
  router.get('/:id', async (req, res) => {
    const reqRametId = req.params.id;
    Ramet.findOne({ where: { id: reqRametId } }).then((innerRes) => {
      if(innerRes) {
        res.statusCode = 200;
        res.statusMessage = 'OK';
        res.send(innerRes);
      } else {
        res.sendStatus(404);
      }
    }).catch((error) => {
      console.log("Error in fetching ramet: ", error);
      res.send(400);
    })
  });

  // Posts a ramet to the database
  router.post('/', (req, res) => {
    const reqRametId = req.body.id;
    const reqGPS = req.body.gps;
    const reqMotherTreeId = req.body.motherTreeId;
    const reqRametGeneticId = req.body.rametGeneticId;
    const reqLocationId = req.body.locationId;
    const reqTransferDate = req.body.transferDate;

    db.sync().then(() => {
      Ramet.create({
        id: reqRametId,
        motherTreeId: reqMotherTreeId,
        rametGeneticId: reqRametGeneticId,
        gps: reqGPS,
        locationId: reqLocationId,
        transferDate: reqTransferDate,
        active: true,
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

  // updates a ramet as inactive/active
  router.put('/:id', async (req, res) => {
    const reqRametId = req.params.id;
    const ramet = await Ramet.findOne({ where: { id: reqRametId } });
    if (ramet) {
      ramet.update({ active: ramet.active? false : true });
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  });

  router.put('/edit/:id', async (req, res) => {
    const reqRametId = req.params.id;
    const reqMotherTreeId = req.body.motherTreeId;
    const reqLocation = req.body.locationId;
    const reqGeneticId = req.body.rametGeneticId;
    const reqGps = req.body.gps;
    const reqActive = req.body.active;
    let reqTransferDate = req.body.transferDate;
    

    
    const ramet = await Ramet.findOne({ where: { id: reqRametId } })
    if (ramet) {
      ramet.update({
        motherTreeId: reqMotherTreeId,
        locationId: reqLocation,
        rametGeneticId: reqGeneticId,
        gps: reqGps,
        transferDate: reqTransferDate,
        active: reqActive
      });
      await ramet.save();
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  });

  // updates a ramet as inactive/active
  router.put('/:id', async (req, res) => {
    const reqRametId = req.params.id;

    const ramet = await Ramet.findOne({ where: { id: reqRametId } });
    if (ramet) {
      ramet.update({ active: ramet.active? false : true });
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  });

  // delete a ramet from the database
  router.delete('/:id', async (req, res) => {
    const deleted = req.params.id;
    try {
      const ramet = await ramet.findOne({ where: { id: deleted } });
      if (ramet) {
        await ramet.destroy();
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      console.log("Error deleting ramet: ", error);
      res.sendStatus(500);
    }
  });
  
  app.use('/ramets', router);
}
