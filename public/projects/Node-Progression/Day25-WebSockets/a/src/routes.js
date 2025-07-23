const express = require('express');
const router = express.Router();

const frontendRouter = require('./frontend/FrontendRoutes');
const websocketRouter = require('./WebSocketRoutes');

// Regular HTTP routes
router.use(frontendRouter);

// WebSocket routes
router.use(websocketRouter);

module.exports = router;