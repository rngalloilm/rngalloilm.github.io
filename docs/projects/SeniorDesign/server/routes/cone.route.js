module.exports = (app) => {
  const Cone = require('../models/cone.model');
  let router = require('express').Router();
  const db = require('../database/database');

  //Gets all Cones
  router.get('/', async (req, res) => {
    Cone.findAll().then((innerRes) => {
      res.statusCode = 200;
      res.statusMessage = 'OK';
      res.send(innerRes);
    }).catch((error) => {
      console.log("Error in fetching cones: ", error);
    })
  });

  // Gets a cone by ID
  router.get('/:id', async (req, res) => {
    const reqConeId = req.params.id;
    await Cone.findOne({ where: { id: reqConeId } }).then((innerRes) => {
      if (innerRes) {
        res.statusCode = 200;
        res.statusMessage = 'OK';
        res.send(innerRes);
      } else {
        res.sendStatus(404);
      }
    }).catch((error) => {
      console.log("Error in fetching cone: ", error);
      res.send(400);
    })
  });

  // Posts a cone to the database
  router.post('/', async (req, res) => {
    const reqConeId = req.body.id;
    const reqDateHarvested = req.body.dateHarvested;
    const reqLocationId = req.body.locationId;
    const reqMotherTreeId = req.body.motherTreeId;
    const reqConeGeneticId = req.body.coneGeneticId;
    const reqFatherTreeId = req.body.fatherTreeId;
    const reqRametId = req.body.rametId;

    await db.sync().then(async () => {
      await Cone.create({
        id: reqConeId,
        dateHarvested: reqDateHarvested,
        locationId: reqLocationId,
        motherTreeId: reqMotherTreeId,
        coneGeneticId: reqConeGeneticId,
        fatherTreeId: reqFatherTreeId,
        rametId: reqRametId,
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

  // updates a cone as inactive/active
  router.put('/:id', async (req, res) => {
    const reqConeId = req.params.id;
    const cone = await Cone.findOne({ where: { id: reqConeId } });
    if (cone) {
      cone.update({ active: cone.active ? false : true });
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  });

  router.put('/edit/:id', async (req, res) => {
    const reqConeId = req.params.id;
    const reqDateHarvested = req.body.dateHarvested;
    const reqLocationId = req.body.locationId;
    const reqMotherTreeId = req.body.motherTreeId;
    const reqConeGeneticId = req.body.coneGeneticId;
    const reqFatherTreeId = req.body.fatherTreeId;
    const reqRametId = req.body.rametId;

    const cone = await Cone.findOne({ where: { id: reqConeId } });
    if (cone) {
      cone.update({
        dateHarvested: reqDateHarvested,
        locationId: reqLocationId,
        motherTreeId: reqMotherTreeId,
        coneGeneticId: reqConeGeneticId,
        fatherTreeId: reqFatherTreeId,
        rametId: reqRametId
      });
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  });


  // Deletes a cone from the database, for testing
  router.delete('/:id', async (req, res) => {
    const deleted = req.params.id;
    try {
      const cone = await Cone.findOne({ where: { id: deleted } });
      if (cone) {
        await cone.destroy();
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      console.log("Error deleting cone: ", error);
      res.sendStatus(500);
    }
  });

  app.use('/cones', router);
}