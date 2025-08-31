module.exports = (app) => {
  const Logs = require('../models/log.model');
  let router = require('express').Router();
  const db = require('../database/database');

  //Gets all Logs
  router.get('/', async (req, res) => {
    Logs.findAll().then((innerRes) => {
      res.statusCode = 200;
      res.statusMessage = 'OK';
      res.send(innerRes);
    }).catch((error) => {
      console.log("Error in fetching logs: ", error);
    })
  });

  // Gets a log by ID
  router.get('/:id', async (req, res) => {
    const reqLogId = req.params.id;
    await Logs.findOne({ where: { id: reqLogId } }).then((innerRes) => {
      if(innerRes) {
        res.statusCode = 200;
        res.statusMessage = 'OK';
        res.send(innerRes);
      } else {
        res.sendStatus(404);
      }
    }).catch((error) => {
      console.log("Error in fetching log: ", error);
      res.send(400);
    });
  });

  // Posts a log to the database
  router.post('/', async (req, res) => {
    const reqAction = req.body.action;
    const reqUnityId = req.header('x-shib_uid');

    await db.sync().then(async () => {
      await Logs.create({
        id: 0,
        action: reqAction,
        userId: reqUnityId,
        date: new Date()
      }).then((innerRes) => {
        res.sendStatus(200);
      }).catch((error) => {
        console.log("Error Inserting Record: ", error);
        res.sendStatus(400);
      })
    })
  });

  app.use('/logs', router);
}
