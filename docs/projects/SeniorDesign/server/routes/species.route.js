module.exports = (app) => {
  const Species = require('../models/species.model');
  let router = require('express').Router();
  const db = require('../database/database');

  //Gets all Species
  router.get('/', async (req, res) => {
    await Species.findAll().then((innerRes) => {
      res.statusCode = 200;
      res.statusMessage = 'OK';
      res.send(innerRes);
    }).catch((error) => {
      console.log("Error in fetching species: ", error);
    })
  });

  //Gets a specific species by name
  router.get("/:species", async (req, res) => {
    const reqSpecies = req.params.species;
    await Species.findOne({ where: { species: reqSpecies } })
      .then((innerRes) => {
        res.statusCode = 200;
        res.statusMessage = "OK";
        res.send(innerRes);
      })
      .catch((error) => {
        console.log("Error in fetching species: ", error);
      });
  });

  // Posts a species to the database
  router.post('/', async (req, res) => {
    const reqSpecies = req.body.species;
    const reqShorthand = req.body.shorthand;

    await db.sync().then( async() => {
      await Species.create({
        species: reqSpecies,
        shorthand: reqShorthand,
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

  // updates a species as inactive/active
  router.put('/:species', async (req, res) => {
    const reqSpecies = req.params.species;
    const species = await Species.findOne({ where: { species: reqSpecies } });
    if (species) {
      species.update({ active: species.active? false : true });
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  });

  //edit a species
  router.put('/edit/:species', async (req, res) => {
    const reqSpecies = req.params.species;
    const reqShorthand = req.body.shorthand;

    const species = await Species.findOne({ where: {species: reqSpecies}});
    if (species) {
      species.update({species:reqSpecies, shorthand: reqShorthand, active: true});
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  });

  // Delete a species from the database
  router.delete('/:species', async (req, res) => {
    const deleted = req.params.species;
    try {
      const spec = await Species.findOne({ where: { species: deleted } });
      if (spec) {
        await spec.destroy();
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      console.log("Error deleting species: ", error);
      res.sendStatus(500);
    }
  });

  app.use('/species', router);
}
