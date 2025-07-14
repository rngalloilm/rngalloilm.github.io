const express = require('express');
const path = require('path');
const router = express.Router();

// API Routes
const APIRoutes = require('./api/APIRoutes.js');
const html_dir = path.join(__dirname, '../templates/');
router.use('/api', APIRoutes);


// Frontend Routes
router.get('/', (req, res) => {
    res.sendFile(`${html_dir}index.html`);
});

router.get('/login', (req, res) => {
    res.sendFile(`${html_dir}login.html`);
});

module.exports = router;