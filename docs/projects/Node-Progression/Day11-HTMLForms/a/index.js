const path = require('path');

// Import our dependencies
const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const templatesPath = path.join(__dirname, 'templates');
// Create a new server instance
const app = express();
// Port number we want to use on this server
const PORT = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(templatesPath, 'form.html'));
});

app.get('/submit/get', (req, res) => {
    res.sendFile(path.join(templatesPath, 'received.html'));
    console.log("query", req.query);
});

app.post('/submit/post/url', (req, res) => {
    res.sendFile(path.join(templatesPath, 'received.html'));
    console.log("body", req.body);
});

// upload.none() means we just want the body; no files
app.post('/submit/post/multipart', upload.none(), (req, res) => {
    res.sendFile(path.join(templatesPath, 'received.html'));
    console.log("body", req.body);
});

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));