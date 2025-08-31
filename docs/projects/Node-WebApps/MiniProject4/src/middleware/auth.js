const UserDAO = require('../db/UserDAO');

function auth(req, res, next) {
  const userId = req.cookies.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  UserDAO.getUserById(userId)
    .then(user => {
      req.userId = userId;
      next();
    })
    .catch(() => res.status(401).json({ error: 'Unauthorized' }));
}

module.exports = auth;