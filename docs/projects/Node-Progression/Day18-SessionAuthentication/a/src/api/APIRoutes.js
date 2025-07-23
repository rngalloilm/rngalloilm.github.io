const express = require('express');
const cookieParser = require('cookie-parser');

const apiRouter = express.Router();

apiRouter.use(cookieParser());
apiRouter.use(express.json());

const { CookieAuthMiddleware, initializeSession, removeSession } = require('../middleware/CookieAuthMiddleware');


const CountyDAO = require('./db/CountyDAO');
const ParkDAO = require('./db/ParkDAO');
const UserDAO = require('./db/UserDAO');


/************\
* API ROUTES *
\************/


//Get all counties
apiRouter.get('/counties', CookieAuthMiddleware, (req,  res) => {
  CountyDAO.getCounties().then(counties => {
    res.json(counties);
  })
  .catch(err => {
    res.status(500).json({error: 'Internal server error'});
  });
});

//Get all parks
apiRouter.get('/parks', CookieAuthMiddleware, (req,  res) => {
  ParkDAO.getParks().then(parks => {
    res.json(parks);
  })
  .catch(err => {
    res.status(500).json({error: 'Internal server error'});
  });
});


//Get specific park
apiRouter.get('/parks/:parkId', CookieAuthMiddleware, (req,  res) => {
  const parkId = req.params.parkId;
  ParkDAO.getParkById(parkId).then(park => {
    res.json(park);
    if(req.session && req.session.visitedParks && !req.session.visitedParks.includes(park.id)) {
      req.session.visitedParks.push(park.id);
    }
  })
  .catch(err => {
    res.status(404).json({error: 'Park not found'});
  });
});

//Get all parks in specific county
apiRouter.get('/counties/:countyId/parks', CookieAuthMiddleware, (req,  res) => {
  const countyId = parseInt(req.params.countyId);
  ParkDAO.getParksByCountyId(countyId).then(parks => {
    res.json(parks);
  })
  .catch(err => {
    res.status(500).json({error: err});
  });
});

//Get specific county
apiRouter.get('/counties/:countyId', CookieAuthMiddleware, (req,  res) => {
  const countyId = req.params.countyId;
  CountyDAO.getCountyById(countyId).then(county => {
    res.json(county);
  })
  .catch(err => {
    res.status(404).json({error: 'County not found'});
  });
});


//Create a park
apiRouter.post('/parks', CookieAuthMiddleware, (req,  res) => {
  let newPark = req.body;
  ParkDAO.createPark(newPark).then(park => {
    res.json(park);
  })
  .catch(err => {
    res.status(500).json({error: 'Internal server error'});
  });
});

//Create a county
apiRouter.post('/counties', CookieAuthMiddleware, (req,  res) => {
  let newCounty = req.body;
  CountyDAO.createCounty(newCounty).then(county => {
    res.json(county);
  })
  .catch(err => {
    res.status(500).json({error: 'Internal server error'});
  });
});


//Update a county
apiRouter.put('/counties/:county', CookieAuthMiddleware, (req,  res) => {
  res.status(501).json({error: 'Not implemented'});
});
//Update a park
apiRouter.put('/parks/:parkId', CookieAuthMiddleware, (req,  res) => {
  res.status(501).json({error: 'Not implemented'});
});

//Delete a county
apiRouter.delete('/counties/:county', CookieAuthMiddleware, (req,  res) => {
  res.status(501).json({error: 'Not implemented'});
});
//Delete a park
apiRouter.delete('/parks/:parkId', CookieAuthMiddleware, (req,  res) => {
  res.status(501).json({error: 'Not implemented'});
});




/* USER ROUTES */

apiRouter.get('/users/current/parks', CookieAuthMiddleware, async (req,  res) => {
  const visitedParks = [];
  if(req.session) {
    for(const parkId of req.session.visitedParks) {
      const park = await ParkDAO.getParkById(parkId);
      visitedParks.push(park);
    }
  }
  res.json(visitedParks);
});


apiRouter.post('/users/login', (req,  res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ error: 'Credentials not provided' });
  }

  // Authenticate user
  if (username && password) {
    UserDAO.getUserByCredentials(username, password).then(user => {
      let result = {
        user: user
      }

      // Initialize session
      initializeSession(req, res, user)

      // Respond with the user object
      res.json(result);
    }).catch(error => {
      // Handle authentication failure
      res.status(error.code || 500).json({ error: error.message || 'Internal server error' });
    });
  }
});

apiRouter.post('/users/logout', (req,  res) => {
  // Remove session
  removeSession(req, res);

  // Respond with success
  res.json({ success: true });
});

apiRouter.get('/users/current', CookieAuthMiddleware, (req,  res) => {
  res.json(req.session.user);
});



module.exports = apiRouter;
