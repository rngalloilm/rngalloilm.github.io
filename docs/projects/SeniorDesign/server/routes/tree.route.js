module.exports = (app) => {
  const Tree = require('../models/tree.model');
  let router = require('express').Router();
  const db = require('../database/database');

  //Gets all Trees
  router.get('/', async (req, res) => {
    await Tree.findAll().then((innerRes) => {
      res.statusCode = 200;
      res.statusMessage = 'OK';
      res.send(innerRes);
    }).catch((error) => {
      console.log("Error in fetching trees: ", error);
    })
  }
  );

  // Gets a tree by ID
  router.get('/:id', async (req, res) => {
    const reqTreeId = req.params.id;
    await Tree.findOne({ where: { treeId: reqTreeId } }).then((innerRes) => {
      if(innerRes) {
        res.statusCode = 200;
        res.statusMessage = 'OK';
        res.send(innerRes);
      } else {
        res.sendStatus(404);
      }
    }).catch((error) => {
      console.log("Error in fetching tree: ", error);
      res.send(400);
    })
  });

  // Posts a tree to the database
  router.post('/', async (req, res) => {
    const reqTreeId = req.body.treeId;
    const reqGps = req.body.gps;
    const reqLocationId = req.body.locationId;
    const reqTreeGeneticId = req.body.treeGeneticId;

    await db.sync().then(async() => {
      await Tree.create({
        treeId: reqTreeId,
        gps: reqGps,
        active: true,
        locationId: reqLocationId,
        treeGeneticId: reqTreeGeneticId,
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

  // updates a tree as inactive/active
  router.put('/:id', async (req, res) => {
    const reqTreeId = req.params.id;
    const tree = await Tree.findOne({ where: { treeId: reqTreeId } });
    if (tree) {
      tree.update({ active: tree.active? false : true });
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  });

  router.put('/edit/:id', async (req, res) => {
    const reqTreeId = req.params.id;
    const reqTreeGeneticId = req.body.treeGeneticId;
    const reqGps = req.body.gps;
    const reqLocation = req.body.locationId;

    const tree = await Tree.findOne({ where: { treeId: reqTreeId }});
    if(tree) {
      tree.update({treeGeneticId: reqTreeGeneticId, gps: reqGps, locationId: reqLocation});
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  })

  // Delete a tree from the database, for testing purposes
  router.delete('/:id', async (req, res) => {
    const deleted = req.params.id;
    try {
      const tree = await Tree.findOne({ where: { treeId: deleted } });
      if (tree) {
        await tree.destroy();
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      console.log("Error deleting tree: ", error);
      res.sendStatus(500);
    }
  });

  app.use('/trees', router);
}
