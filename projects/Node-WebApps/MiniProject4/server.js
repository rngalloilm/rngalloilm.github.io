const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

// Middleware
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.json());
app.use(cookieParser());

// Routes
const apiRoutes = require('./src/routes/api');
const frontendRoutes = require('./src/routes/frontend');
app.use('/api', apiRoutes);
app.use('/', frontendRoutes);

// Port
const PORT = 3000;
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));