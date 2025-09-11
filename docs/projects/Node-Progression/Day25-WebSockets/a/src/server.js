const express = require('express');

const app = express();
const PORT = 3000;

// WebSockets
const expressWs = require('express-ws')(app);

const routes = require('./routes');
app.use(routes);

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));