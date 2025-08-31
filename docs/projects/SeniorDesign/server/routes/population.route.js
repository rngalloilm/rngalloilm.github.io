module.exports = (app) => {
  const Population = require('../models/population.model');
  let router = require('express').Router();
  const db = require('../database/database');

  //Gets all Populations
  router.get('/', async (req, res) => {
    await Population.findAll().then((innerRes) => {
      res.statusCode = 200;
      res.statusMessage = 'OK';
      res.send(innerRes);
    }).catch((error) => {
      console.log("Error in fetching populations: ", error);
    })
  });

  // Posts a population to the database
  router.post('/', async (req, res) => {
    const reqPopulation = req.body.id;

    await db.sync().then( async () => {
      await Population.create({
        id: reqPopulation,
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

  // Not to be used? -Sponsor
  router.delete('/:id', async (req, res) => {
    const reqPopulation = req.params.id;
    try {
      const pop = await Population.findOne({ where: { id: reqPopulation } });
      if (pop) {
        await pop.destroy();
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      console.log("Error deleting population: ", error);
      res.sendStatus(500);
    }
  });

  // Old delete function. Redundant?
  // router.delete('/', async (req, res) => {
  //   const reqPopulation = req.body.id;
  //   const pop = await Population.findOne({ where: { id: reqPopulation } });
  //   if (pop) {
  //     pop.destroy();
  //     res.sendStatus(200);
  //   } else {
  //     res.sendStatus(404);
  //   }
  // });
  
  router.put('/:id', async (req, res) => {
    const reqPopulationId = req.params.id;

    if (!reqPopulationId) {
        return res.status(400).json({ message: "Population ID is required in the URL." });
    }

    try {
        // Find the specific population instance
        const pop = await Population.findOne({ where: { id: reqPopulationId } });

        if (pop) {
          
          pop.active = false; // Mark as inactive
          await pop.save();   // Persist the change to the database for this instance
          

          res.status(200).json({ message: `Population ID "${reqPopulationId}" archived successfully.`});
        } else {
          // Population not found
          res.status(404).json({ message: `Population ID "${reqPopulationId}" not found.`});
        }
    } catch (error) {
         // Catch any errors during find or save
         console.error("Error archiving population: ", error);
         res.status(500).json({ message: "Failed to archive population due to server error.", error: error.message });
    }
  });

  app.use("/populations", router);
}
