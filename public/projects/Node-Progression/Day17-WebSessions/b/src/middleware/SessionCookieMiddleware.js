// Generate a random 6-byte session ID 
const crypto = require('crypto');
function generateSessionId() {
  return crypto.randomBytes(6).toString('hex');
}

// Sessions to store the session data
const sessions = {};

// Store the name of the cookie
const SESSION_COOKIE_NAME = 'NCParks';

// Generate an object that will represent the data
function generateEmptySession() {
    return {
      visitedParks: [],
      createdAt: new Date(),
    };
}

// Recovers a session from a cookie if it exists
function SessionCookieMiddleware(req, res, next) {
    let sessionId = req.cookies[SESSION_COOKIE_NAME];
    
    if (!sessionId || !sessions[sessionId]) {
        sessionId = generateSessionId();
        const session = generateEmptySession();

        sessions[sessionId] = session;
        req.session = session;
        
        res.cookie(SESSION_COOKIE_NAME, sessionId, {
            httpOnly: true,
            secure: true,
            maxAge: 2 * 60 * 1000
        });
        
        console.log('We have a new visitor!', sessionId, req.session);
    } else {
        // Get the session ID from the cookie
        if (sessions[sessionId]) {
            req.session = sessions[sessionId];
        } else {
            // If session ID exists in cookie but not in sessions, create a new session
            const session = generateEmptySession();
            sessions[sessionId] = session;
            req.session = session;
        }

        console.log('Oh look,', sessionId, 'is back!', req.session);
    }
    
    next();
}

module.exports = SessionCookieMiddleware;