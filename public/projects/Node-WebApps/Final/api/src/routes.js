const express = require('express');
const router = express.Router();

const apiRouter = require('./api/APIRoutes');

router.use(apiRouter);

module.exports = router;