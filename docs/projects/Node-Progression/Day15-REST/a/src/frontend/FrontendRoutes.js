const path = require('path');
const express = require('express');
const router = express.Router();

router.use(express.static(path.join(__dirname, '..', '..', 'static')));

const templateFolder = path.join(__dirname, '..', '..', 'templates');

router.get('/', (req, res) => {
  res.sendFile(path.join(templateFolder, 'index.html'));
});

router.get('/park', (req, res) => {
  res.sendFile(path.join(templateFolder, 'park.html'));
});

router.get('/error', (req, res) => {
  res.sendFile(path.join(templateFolder, 'error.html'));
});

module.exports = router;