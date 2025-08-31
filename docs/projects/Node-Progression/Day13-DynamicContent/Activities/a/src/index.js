const path = require('path');
// Import our Express dependency
const express = require('express');
// Create a new server instance
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const templateFolder = path.join(__dirname, '..', 'templates');

app.get('/', (req, res) => {
  res.sendFile(path.join(templateFolder, 'index.html'));
});

app.get('/park', (req, res) => {
  res.sendFile(path.join(templateFolder, 'park.html'));
});

app.get('/error', (req, res) => {
  res.sendFile(path.join(templateFolder, 'error.html'));
});


// Port number we want to use on this server
const PORT = 3000;
// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));