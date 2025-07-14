const express = require('express');
const cookieParser = require('cookie-parser');

const apiRouter = express.Router();

apiRouter.use(cookieParser());
apiRouter.use(express.json());

const { generateToken, removeToken, TokenMiddleware } = require('../middleware/TokenMiddleware');

const CountyDAO = require('./db/CountyDAO');
const ParkDAO = require('./db/ParkDAO');
const UserDAO = require('./db/UserDAO');

/************\
* API ROUTES *
\************/

// Apply TokenMiddleware to all routes except login and logout
apiRouter.use((req, res, next) => {
  if (req.path === '/users/login' || req.path === '/users/logout') {
    next(); // Skip TokenMiddleware for login and logout
  } else {
    TokenMiddleware(req, res, next); // Apply TokenMiddleware to all other routes
  }
});

// Get all counties
apiRouter.get('/counties', (req, res) => {
  CountyDAO.getCounties()
    .then((counties) => {
      res.json(counties);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Internal server error' });
    });
});

// Get all parks
apiRouter.get('/parks', (req, res) => {
  ParkDAO.getParks()
    .then((parks) => {
      res.json(parks);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Internal server error' });
    });
});

// Get specific park
apiRouter.get('/parks/:parkId', (req, res) => {
  const parkId = req.params.parkId;
  ParkDAO.getParkById(parkId)
    .then((park) => {
      res.json(park);
    })
    .catch((err) => {
      res.status(404).json({ error: 'Park not found' });
    });
});

// Get all parks in specific county
apiRouter.get('/counties/:countyId/parks', (req, res) => {
  const countyId = parseInt(req.params.countyId);
  ParkDAO.getParksByCountyId(countyId)
    .then((parks) => {
      res.json(parks);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// Get specific county
apiRouter.get('/counties/:countyId', (req, res) => {
  const countyId = req.params.countyId;
  CountyDAO.getCountyById(countyId)
    .then((county) => {
      res.json(county);
    })
    .catch((err) => {
      res.status(404).json({ error: 'County not found' });
    });
});

// Create a park
apiRouter.post('/parks', (req, res) => {
  let newPark = req.body;
  ParkDAO.createPark(newPark)
    .then((park) => {
      res.json(park);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Internal server error' });
    });
});

// Create a county
apiRouter.post('/counties', (req, res) => {
  let newCounty = req.body;
  CountyDAO.createCounty(newCounty)
    .then((county) => {
      res.json(county);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Internal server error' });
    });
});

// Update a county
apiRouter.put('/counties/:county', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

// Update a park
apiRouter.put('/parks/:parkId', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

// Delete a county
apiRouter.delete('/counties/:county', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

// Delete a park
apiRouter.delete('/parks/:parkId', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

/* USER ROUTES */

// Login route
apiRouter.post('/users/login', (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ error: 'Credentials not provided' });
  }

  // Authenticate the user
  UserDAO.getUserByCredentials(username, password)
    .then((user) => {
      // Generate a token and set it as a cookie
      generateToken(req, res, user);

      // Respond with the user object
      res.json({ user: user });
    })
    .catch((error) => {
      // Handle errors (e.g., invalid credentials)
      res.status(error.code || 500).json({ error: error.message });
    });
});

// Logout route
apiRouter.post('/users/logout', (req, res) => {
  // Remove the token (clear the cookie)
  removeToken(req, res);

  // Respond with success
  res.json({ success: true });
});

// Get current user details
apiRouter.get('/users/current', (req, res) => {
  // Return the user object from the request (added by TokenMiddleware)
  res.json(req.user);
});

module.exports = apiRouter;