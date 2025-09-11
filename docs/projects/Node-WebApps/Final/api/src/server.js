const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const routes = require('./routes');

app.use(cors());  // Enable CORS for calendar
app.use(bodyParser.json()); // Parse JSON requests for calendar
app.use(routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
