const express = require('express');
const router = express.Router();

const frontendRouter = require('./frontend/FrontendRoutes');
router.use(frontendRouter);

const APIRoutes = require('./api/APIRoutes');
router.use('/api', APIRoutes);

module.exports = router;