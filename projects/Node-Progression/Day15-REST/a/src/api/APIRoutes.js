const express = require('express');

// Backend uses require, frontend uses import
const CountyDAO = require('./db/CountyDAO');
const ParkDAO = require('./db/ParkDAO');

const router = express.Router();

// Get all counties
router.get('/counties', (req, res) => {
    CountyDAO.getCounties()
        .then(counties => res.json(counties))
});

// Get a specific county. From all the counties, give me the one with this ID
router.get('/counties/:countyId', (req, res) => {
    CountyDAO.getCountyById(req.params.countyId)
        .then(county => res.json(county))
        .catch(() => res.status(404).json({ error: 'Failed to retrieve county' }))
});

// Get all parks within a county
router.get('/counties/:countyId/parks', (req, res) => {
    ParkDAO.getParksByCountyId(req.params.countyId)
        .then(results => res.json(results))
        .catch(() => res.status(404).json({ error: 'Failed to retrieve county parks' }))
});

// Get all parks
router.get('/parks', (req, res) => {
    ParkDAO.getParks()
        .then(results => res.json(results))
});

// Gets a park by ID
router.get('/parks/:parkId', (req, res) => {
    ParkDAO.getParkById(req.params.parkId)
        .then(park => res.json(park))
        .catch(() => res.status(404).json({ error: 'Failed to retrieve park' }))
});

module.exports = router;