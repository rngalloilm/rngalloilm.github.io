const express = require('express');
const UserDAO = require('./db/UserDAO.js');
const cookieParser = require('cookie-parser');
const apiRouter = express.Router();

apiRouter.use(cookieParser());
apiRouter.use(express.json());
const { generateToken, removeToken, TokenMiddleware } = require('../middleware/TokenMiddleware');

// Apply TokenMiddleware to all routes except login and logout
apiRouter.use((req, res, next) => {
    if (req.path === '/users/login' || req.path === '/users/logout') {
        next();
    } else {
        TokenMiddleware(req, res, next);
    }
});

// Login route
apiRouter.post('/users/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Credentials not provided' });
    }

    UserDAO.getUserByCredentials(email, password)
        .then((user) => {
            generateToken(res, user);
            res.json({ user });
        })
        .catch((error) => {
            res.status(error.code || 500).json({ error: error.message });
        });
});

// Logout route
apiRouter.post('/users/logout', (req, res) => {
    removeToken(res);
    res.json({ success: true });
});

// Get current user
apiRouter.get('/users/current', (req, res) => {
    res.json({ user: req.user });
});

module.exports = apiRouter;