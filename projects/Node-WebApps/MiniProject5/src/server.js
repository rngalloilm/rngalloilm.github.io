const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'static')));
app.use(express.static(path.join(__dirname, '..', 'templates')));


// Routes
const routes = require('./routes');
app.use(routes);

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));