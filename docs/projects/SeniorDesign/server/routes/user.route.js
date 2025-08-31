module.exports = (app) => {
  const User = require('../models/user.model');
  let router = require('express').Router();
  const db = require('../database/database');

  //Gets all Users
  router.get('/all', async (req, res) => {
    await User.findAll().then((innerRes) => {
      res.statusCode = 200;
      res.statusMessage = 'OK';
      res.send(innerRes);
    }).catch((error) => {
      console.log("Error in fetching users: ", error);
    })
  });

  // get the current user
  router.get('/current', async (req, res) => {
    const reqUnityId = req.header('x-shib_uid');
    await User.findOne({ where: { unityId: reqUnityId } }).then((innerRes) => {
      res.statusCode = 200;
      res.statusMessage = 'OK';
      res.send(innerRes);
    }).catch((error) => {
      console.log("Error in fetching user: ", error);
      res.statusCode = 500;
      res.statusMessage = error;
      res.send(innerRes);
    })
  });

  // Posts a user to the database
  router.post('/', async (req, res) => {
    const reqUnityId = req.body.unityId;
    const reqFirstName = req.body.firstName;
    const reqLastName = req.body.lastName;
    const reqEmail = req.body.email;
    const reqRole = req.body.role;

    await db.sync().then(async () => {
      await User.create({
        unityId: reqUnityId,
        firstName: reqFirstName,
        lastName: reqLastName,
        email: reqEmail,
        role: reqRole
      }).then((innerRes) => {
        res.statusCode = 200;
        res.statusMessage = 'OK';
        res.send(innerRes);
      }).catch((error) => {
        console.log("Error Inserting Record: ", error);
        res.sendStatus(400);
      })
    })
  });

  // Gets a user by their unityId
  router.get('/:unityId', async (req, res) => {
    console.log(req.headers);
    const reqUnityId = req.params.unityId;
    await User.findOne({ where: { unityId: reqUnityId } }).then((innerRes) => {
      res.statusCode = 200;
      res.statusMessage = 'OK';
      res.send(innerRes);
    }).catch((error) => {
      console.log("Error in fetching user: ", error);
    })
  });

  // Update users information
  router.put('/:unityId', async (req, res) => {
    const reqUnityId = req.params.unityId;
    const reqEditUnityId = req.body.unityId;
    const reqFirstName = req.body.firstName;
    const reqLastName = req.body.lastName;
    const reqEmail = req.body.email;
    const reqRole = req.body.role;

    await db.sync().then(async () => {
      await User.update({
        unityId: reqEditUnityId,
        firstName: reqFirstName,
        lastName: reqLastName,
        email: reqEmail,
        role: reqRole
      }, { where: { unityId: reqUnityId } }).then((innerRes) => {
        res.sendStatus(200);
      }).catch((error) => {
        console.log("Error Updating Record: ", error);
        res.sendStatus(400);
      })
    })
  });

  // Delete a user
  router.delete('/:unityId', async (req, res) => {
    const reqUnityId = req.params.unityId;
    await db.sync().then(async () => {
      await User.destroy({ where: { unityId: reqUnityId } }).then((innerRes) => {
        res.sendStatus(200);
      }
      ).catch((error) => {
        console.log("Error Deleting Record: ", error);
        res.sendStatus(400);
      }
      )
    });
  });


  app.use('/users', router);
}