const express = require('express');
const router = express.Router();
const path = require('path');

const templateFolder = path.join(__dirname, '..', '..', 'templates');

router.get('/', (req, res) => {
  res.sendFile(path.join(templateFolder, 'index.html'));
});

router.get('/login', (req, res) => {
  res.sendFile(path.join(templateFolder, 'login.html'));
});

router.get('/profile/:userId', (req, res) => {
  res.sendFile(path.join(templateFolder, 'profile.html'));
});

module.exports = router;