const crypto = require('crypto');

const sessions = {};
const SESSION_COOKIE_NAME = "NCParks";

module.exports.initializeSession = (req, res, user) => {
  // Retrieve the sessionId from the cookies
  let sessionId = req.cookies[SESSION_COOKIE_NAME];

  if (!sessionId || !sessions[sessionId]) {
    sessionId = crypto.randomBytes(64).toString('hex');

    const sessionData = {
      user: user,
      visitedParks: [],
      createdAt: new Date(),
    };

    // Store the session data in the sessions object
    sessions[sessionId] = sessionData;

    // Set the session cookie with secure, httpOnly, and expiry in 2 minutes
    res.cookie(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: true,
      maxAge: 2 * 60 * 1000, // 2 minutes in milliseconds
    });
  }

  req.session = sessions[sessionId];
};


module.exports.removeSession = (req, res) => {
  // Retrieve the sessionId from the cookies
  const sessionId = req.cookies[SESSION_COOKIE_NAME];

  if (sessionId && sessions[sessionId]) {
    // Delete session from memory
    delete sessions[sessionId];
  }

  // Expire the cookie by setting it with an empty value and past expiration date
  res.cookie(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    expires: new Date(0), // Set expiration date in the past
  });
};


module.exports.CookieAuthMiddleware = (req, res, next) => {
  // Check if the request has a session cookie
  const sessionId = req.cookies[SESSION_COOKIE_NAME];

  if (!sessionId) {
    return res.status(401).json({ error: "Not Authenticated" });
  }

  // Check if the session exists
  if (!sessions[sessionId]) {
    module.exports.removeSession(req, res);
    return res.status(401).json({ error: "Not Authenticated" });
  }

  // Store session in req.session for other middleware
  req.session = sessions[sessionId];

  // Continue to the next middleware
  next();
};
