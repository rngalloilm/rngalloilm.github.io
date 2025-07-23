const path = require('path');
// Import our Express dependency
const express = require('express');
// Create a new server instance
const app = express();

app.use(express.static('public'));
app.use(express.json());

const templateFolder = path.join(__dirname, '..', 'templates');

app.get('/', (req, res) => {
  res.sendFile(path.join(templateFolder, 'index.html'));
});

// Acitivity code
const HowlDAO = require('./db/HowlDAO');

app.get('/howls', (req, res) => {
  HowlDAO.getHowls()
    .then(howls => {
      res.json(howls);
    });
});

app.post('/howls', (req, res) => {
  const message = req.body.message;

  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message cannot be empty" });
  }
  HowlDAO.createHowl(message)
    .then(createdHowl => res.status(201).json(createdHowl))
    .catch(err => res.status(500).json({ error: "Failed to post howl" }));
});

// Port number we want to use on this server
const PORT = 3000;
// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));