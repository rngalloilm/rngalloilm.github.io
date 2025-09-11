const express = require('express');
const app = express();

// Cookie, goes before router
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Cookie
const SessionCookieMiddleware = require('./middleware/SessionCookieMiddleware')
app.use(SessionCookieMiddleware);

const routes = require('./routes');
app.use(routes);

const PORT = 3000;
// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));