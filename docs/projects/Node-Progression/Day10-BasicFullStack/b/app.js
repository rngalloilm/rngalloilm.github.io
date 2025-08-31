const path = require('path');

// Import our Express dependency
const express = require('express');
// Create a new server instance
const app = express();
// Port number we want to use on this server
const PORT = 3000;

// Add your code here
const templatesPath = path.join(__dirname, 'templates');
const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};

app.use(logger);

app.use(express.static('static'));

app.get('/', (req, res) => {
    res.sendFile(path.join(templatesPath, 'index.html'));
});

app.get('/company/about', (req, res) => {
    res.sendFile(path.join(templatesPath, 'about.html'));
});
// If none of the others execute, this will
app.all('*', (req, res) => {
    res.sendFile(path.join(templatesPath, '404.html'));
});

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));