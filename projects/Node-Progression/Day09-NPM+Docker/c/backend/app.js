// Import our Express dependency
const express = require('express');
// Create a new server instance
const app = express();
// Port number we want to use on this server
const PORT = 3000;

// Designate the public folder as the location to look for static resources
app.use(express.static('public'));

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));