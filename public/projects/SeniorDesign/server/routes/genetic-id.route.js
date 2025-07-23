module.exports = (app) => {
  const GeneticId = require('../models/genetic-id.model');
  let router = require('express').Router();
  const db = require('../database/database');

  //Gets all Genetic Ids
  router.get('/', async (req, res) => {
    GeneticId.findAll().then((innerRes) => {
      res.statusCode = 200;
      res.statusMessage = 'OK';
      res.send(innerRes);
    }).catch((error) => {
      console.log("Error in fetching genetic ids: ", error);
    })
  });

  // Gets a genetic id by ID
  router.get('/:id', async (req, res) => {
    const reqGeneticId = req.params.id;
    await GeneticId.findOne({ where: { id: reqGeneticId } }).then((innerRes) => {
      if (innerRes) {
        res.statusCode = 200;
        res.statusMessage = 'OK';
        res.send(innerRes);
      } else {
        res.sendStatus(404);
      }
    }).catch((error) => {
      console.log("Error in fetching genetic id: ", error);
      res.send(400);
    });
  });


  // Find by gen, family, progeny, pop, and ramet id (very specific)
  router.get('/find/:geneticId&:familyId&:progenyId&:populationId&:rametId', async (req, res) => {
    const reqGeneticId = req.params.geneticId;
    const reqFamilyId = req.params.familyId;
    const reqProgenyId = req.params.progenyId;
    const reqPopulationId = req.params.populationId;
    const reqRametId = req.params.rametId === 'null' ? null : req.params.rametId;
    await GeneticId.findOne({ where: { geneticId: reqGeneticId, progenyId: reqProgenyId, familyId: reqFamilyId, populationId: reqPopulationId, rametId: reqRametId } }).then((innerRes) => {
      if (innerRes) {
        res.statusCode = 200;
        res.statusMessage = 'OK';
        res.send(innerRes);
      } else {
        res.sendStatus(404);
      }
    }).catch((error) => {
      console.log("Error in fetching genetic id: ", error);
      res.send(400);
    });
  });

  // Gets a list of genetic Ids by population ID and family ID and genetic id and ramet id
  router.get('/find/:populationId&:familyId&:rametId&:geneticId', async (req, res) => {
    const reqPopulationId = req.params.populationId;
    const reqFamilyId = req.params.familyId;
    const reqGeneticId = req.params.geneticId;
    const reqRametId = req.params.rametId === 'null' ? null : req.params.rametId;
    await GeneticId.findAll({ where: { geneticId: reqGeneticId, populationId: reqPopulationId, familyId: reqFamilyId, rametId: reqRametId }, attributes: ['progenyId'], group: ['progenyId'] }).then((innerRes) => {
      if (innerRes) {
        innerRes.map(innerRes => innerRes.progenyId);
        res.statusCode = 200;
        res.statusMessage = 'OK';
        res.send(innerRes);
      } else {
        res.sendStatus(404);
      }
    }).catch((error) => {
      console.log("Error in fetching genetic id: ", error);
      res.send(400);
    });
  });

  // Gets the genetic Id from pop family and ramet
  router.get('/find/:populationId&:familyId&:rametId', async (req, res) => {
    const reqPopulationId = req.params.populationId;
    const reqFamilyId = req.params.familyId;
    const reqRametId = req.params.rametId === 'null' ? null : req.params.rametId;
    await GeneticId.findAll({ where: {populationId: reqPopulationId, familyId: reqFamilyId, rametId: reqRametId}, attributes: ['geneticId'], group: ['geneticId']}).then((innerRes) => {
      if (innerRes) {
        innerRes.map(innerRes => innerRes.geneticId);
        res.statusCode = 200;
        res.statusMessage = 'OK';
        res.send(innerRes);
      } else {
        res.sendStatus(404);
      }
    }).catch((error) => {
      console.log("Error in fetching genetic id: " + error);
      res.send(400);
    })
  })

  // Gets a list of ramet IDS by population Id and family ID
  router.get('/find/:populationId&:familyId', async (req, res) => {
    const reqPopulationId = req.params.populationId;
    const reqFamilyId = req.params.familyId;
    await GeneticId.findAll({ where: { familyId: reqFamilyId, populationId: reqPopulationId }, attributes: ['rametId'], group: ['rametId'] }).then((innerRes) => {
      if (innerRes) {
        innerRes.map(innerRes => innerRes.rametId);
        res.statusCode = 200;
        res.statusMessage = 'OK';
        res.send(innerRes);
      } else {
        res.sendStatus(404);
      }
    }).catch((error) => {
      console.log("Error in fetching genetic id: ", error);
      res.send(400);
    });
  });

  // Gets a list of genetic IDS by population id, specifically for getting the family id
  router.get('/find/:populationId', async (req, res) => {
    const reqPopulationId = req.params.populationId;
    await GeneticId.findAll({ where: { populationId: reqPopulationId }, attributes: ['familyId'], group: ['familyId'] }).then((innerRes) => {
      if (innerRes) {
        innerRes.map(innerRes => innerRes.familyId);
        res.statusCode = 200;
        res.statusMessage = 'OK';
        res.send(innerRes);
      } else {
        res.sendStatus(404);
      }
    }).catch((error) => {
      console.log("Error in fetching genetic id: ", error);
      res.send(400);
    });
  });


  // Posts a genetic id to the database
  router.post('/', async (req, res) => {
    const reqGeneticId = req.body.geneticId;
    const reqFamilyId = req.body.familyId;
    const reqProgenyId = req.body.progenyId;
    const reqRametId = req.body.rametId;
    const reqSpecies = req.body.species;
    const reqYearPlanted = req.body.yearPlanted;
    const reqPopulation = req.body.populationId;

    await db.sync().then(async () => {
      await GeneticId.create({
        id: 0,
        geneticId: reqGeneticId,
        familyId: reqFamilyId,
        progenyId: reqProgenyId,
        rametId: reqRametId,
        species: reqSpecies,
        yearPlanted: reqYearPlanted,
        populationId: reqPopulation,
        active: true,
        isCheckedOut: false,
        checkedOutBy: null
      }).then((innerRes) => {
        res.sendStatus(200);
      }).catch((error) => {
        console.log("Error Inserting Record: ", error);
        res.sendStatus(400);
      });
    });
  });

  // Not to be used? -Sponsor
  // Delete a genetic id from the database
  // - No function defined that makes a DELETE request to /genetic-id or /genetic-id/:id in idService.js
  // - No specific case defined in TableComponent.jsx to handle props.material === "geneticId" for deletion or archiving. Cases exist for "tree", "cone", 
  // "seed", "location", "species", "population", and various lab stages, but not "geneticId".
  router.delete('/:id', async (req, res) => { // Added :id to URL
    const deleted = req.params.id;
    try {
      const gen = await GeneticId.findOne({ where: { id: deleted } });
      if (gen) {
        await gen.destroy();
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      console.log("Error deleting genetic id: ", error);
      res.sendStatus(500);
    }
  });

  // - The backend route PUT /genetic-id is used exclusively by the frontend's GeneticIdForm component 
  // when editing an existing Genetic ID record. The form passes the database primary key (dbId) in the request body, 
  // which the backend route uses to find and update the correct record.
  // - The GeneticIdForm is used when the route matches /material/genetic-id/edit/:geneticId (as defined 
  // in client/src/App.js indirectly via the /material/:material/:action/:id? route).
  // - Doesn't use standard form '/:id', but is functional as is.
  router.put('/edit', async (req, res) => {
    try {
      const reqGeneticId = req.body.geneticId;
      const reqFamilyId = req.body.familyId;
      const reqProgenyId = req.body.progenyId;
      const reqRametId = req.body.rametId;
      const reqSpecies = req.body.species;
      const reqYearPlanted = req.body.yearPlanted;
      const reqPopulation = req.body.populationId;
      const databaseId = req.body.dbId;

      if (
        reqGeneticId === undefined || reqFamilyId === undefined ||
        reqProgenyId === undefined || reqRametId === undefined ||
        reqSpecies === undefined || reqYearPlanted === undefined ||
        reqPopulation === undefined || databaseId === undefined
      ) {
        return res.status(400).json({ error: 'Bad Request, null field passed.' });
      }
  
      // Finding the existing entry in the database using the databaseId
      const existingEntry = await GeneticId.findByPk(databaseId);
  
      // Check if the entry exists
      if (!existingEntry) {
        return res.status(404).json({ error: `GeneticId with Id: ${dbId} doesn't exist.` });
      }
  
      // Update the entry with the new values
      existingEntry.geneticId = reqGeneticId;
      existingEntry.familyId = reqFamilyId;
      existingEntry.progenyId = reqProgenyId;
      existingEntry.rametId = reqRametId;
      existingEntry.species = reqSpecies;
      existingEntry.yearPlanted = reqYearPlanted;
      existingEntry.populationId = reqPopulation;
  
      // Save the updated entry
      await existingEntry.save();
  
      return res.status(200).json({ message: 'Entry updated successfully', data: existingEntry });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // updates a location as inactive/active
  router.put('/:id', async (req, res) => {
    
    const reqGeneticId = req.params.id;
    const id = await GeneticId.findOne({ where: { id: reqGeneticId } });

    if (id) {
      // Update the 'active' property
      await id.update({ active: !id.active });

      // Respond with a success status
      res.sendStatus(200);
    } else {
      // Location not found, respond with a 404 status
      res.sendStatus(404);
    }
 
  });

  app.use('/genetic-id', router);
}
