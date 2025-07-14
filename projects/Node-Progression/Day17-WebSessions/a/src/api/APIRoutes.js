const express = require('express');
const apiRouter = express.Router();


const CountyDAO = require('./db/CountyDAO');
const ParkDAO = require('./db/ParkDAO');

apiRouter.use(express.json());

/************\
* API ROUTES *
\************/


//Get all counties
apiRouter.get('/counties', (req,  res) => {
  CountyDAO.getCounties().then(counties => {
    res.json(counties);
  })
  .catch(err => {
    res.status(500).json({error: 'Internal server error'});
  });
});

//Get all parks
apiRouter.get('/parks', (req,  res) => {
  ParkDAO.getParks().then(parks => {
    res.json(parks);
  })
  .catch(err => {
    res.status(500).json({error: 'Internal server error'});
  });
});

//Get specific park
apiRouter.get('/parks/:parkId', (req,  res) => {
  const parkId = req.params.parkId;
  ParkDAO.getParkById(parkId).then(park => {
    res.json(park);
  })
  .catch(err => {
    res.status(404).json({error: 'Park not found'});
  });
});

//Get all parks in specific county
apiRouter.get('/counties/:countyId/parks', (req,  res) => {
  const countyId = parseInt(req.params.countyId);
  ParkDAO.getParksByCountyId(countyId).then(parks => {
    res.json(parks);
  })
  .catch(err => {
    res.status(500).json({error: err});
  });
});

//Get specific county
apiRouter.get('/counties/:countyId', (req,  res) => {
  const countyId = req.params.countyId;
  CountyDAO.getCountyById(countyId).then(county => {
    res.json(county);
  })
  .catch(err => {
    res.status(404).json({error: 'County not found'});
  });
});


//Create a park
apiRouter.post('/parks', (req,  res) => {
  let newPark = req.body;
  ParkDAO.createPark(newPark).then(park => {
    res.json(park);
  })
  .catch(err => {
    res.status(500).json({error: 'Internal server error'});
  });
});

//Create a county
apiRouter.post('/counties', (req,  res) => {
  let newCounty = req.body;
  CountyDAO.createCounty(newCounty).then(county => {
    res.json(county);
  })
  .catch(err => {
    res.status(500).json({error: 'Internal server error'});
  });
});


//Update a county
apiRouter.put('/counties/:county', (req,  res) => {
  res.status(501).json({error: 'Not implemented'});
});
//Update a park
apiRouter.put('/parks/:parkId', (req,  res) => {
  res.status(501).json({error: 'Not implemented'});
});

//Delete a county
apiRouter.delete('/counties/:county', (req,  res) => {
  res.status(501).json({error: 'Not implemented'});
});
//Delete a park
apiRouter.delete('/parks/:parkId', (req,  res) => {
  res.status(501).json({error: 'Not implemented'});
});



module.exports = apiRouter;
