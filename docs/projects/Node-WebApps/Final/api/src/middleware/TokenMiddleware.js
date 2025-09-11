const jwt = require('jsonwebtoken');

const TOKEN_COOKIE_NAME = "MinipackBudgetPlanner";
const API_SECRET = process.env.API_SECRET_KEY;

// Define public API routes that don't require authentication.
const publicPaths = [
  '/api/auth/login',
  '/api/auth/register'
];

exports.TokenMiddleware = (req, res, next) => {
  // If the route is public, bypass token check.
  if (publicPaths.includes(req.originalUrl)) {
    return next();
  }

  let token = null;
  if (req.cookies[TOKEN_COOKIE_NAME]) {
    token = req.cookies[TOKEN_COOKIE_NAME];
  } else {
    const authHeader = req.get('Authorization');
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1].trim();
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const decodedPayload = jwt.verify(token, API_SECRET);
    req.user = decodedPayload.user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
};

exports.generateToken = (req, res, user) => {
  const payload = {
    user: user,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // expires in 1 hour
  };
  const token = jwt.sign(payload, API_SECRET);
  res.cookie(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 1000 * 24
  });
};

exports.removeToken = (req, res) => {
  res.cookie(TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    maxAge: -360000
  });
};
