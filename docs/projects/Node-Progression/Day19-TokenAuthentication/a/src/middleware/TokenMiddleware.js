const jwt = require('jsonwebtoken');

// Secret key for signing the JWT (in a real app, this should be stored securely)
const API_SECRET = 'your_random_secret_key_here';

// Cookie name for the token
const TOKEN_COOKIE_NAME = "NCParksToken";

// Middleware to handle token validation
exports.TokenMiddleware = (req, res, next) => {
  let token = null;

  // Check for the token in the cookie
  if (req.cookies[TOKEN_COOKIE_NAME]) {
    token = req.cookies[TOKEN_COOKIE_NAME]; // Get token from cookie
  }
  // If no cookie, check the Authorization header
  else {
    const authHeader = req.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Extract the token from "Bearer <token>"
      token = authHeader.split(' ')[1].trim();
    }
  }

  // If no token is found, return a 401 error
  if (!token) {
    return res.status(401).json({ error: 'Not Authenticated' });
  }

  // Verify the token
  try {
    const payload = jwt.verify(token, API_SECRET);
    req.user = payload.user; // Attach the user payload to the request object
    next(); // Proceed to the next middleware/route
  } catch (error) {
    // Handle invalid or expired tokens
    res.status(401).json({ error: 'Not Authenticated' });
  }
};

// Function to generate a token and set it as a cookie
exports.generateToken = (req, res, user) => {
  // Create the payload with user information and expiration time
  const payload = {
    user: user, // Private claim for user data
    exp: Math.floor(Date.now() / 1000) + 3600, // Expiration time: 1 hour from now (in seconds)
  };

  // Generate the JWT
  const token = jwt.sign(payload, API_SECRET);

  // Set the token as a cookie in the response
  res.cookie(TOKEN_COOKIE_NAME, token, {
    httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
    secure: true, // Ensure the cookie is only sent over HTTPS
    maxAge: 120000, // Cookie expiration time: 2 minutes (in milliseconds)
  });
};

// Function to remove the token (logout)
exports.removeToken = (req, res) => {
  // Clear the token cookie by setting an expired cookie
  res.cookie(TOKEN_COOKIE_NAME, '', {
    httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
    secure: true, // Ensure the cookie is only sent over HTTPS
    expires: new Date(0), // Set expiration date to a past date
  });
};