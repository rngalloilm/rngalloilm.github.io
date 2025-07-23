const express = require('express');
const router = express.Router();
const UserDAO = require('../db/UserDAO');
const HowlDAO = require('../db/HowlDAO');
const FollowDAO = require('../db/FollowDAO');
const auth = require('../middleware/auth');

// Authenticate user
router.post('/login', (req, res) => {
  const { username } = req.body;
  UserDAO.getUserByUsername(username)
    .then(user => {
      res.cookie('userId', user.id, { httpOnly: true });
      res.json(user);
    })
    .catch(() => res.status(401).json({ error: 'Invalid username' }));
});

// Log user out
router.post('/logout', (req, res) => {
  // Clear the userId cookie
  res.clearCookie('userId', { httpOnly: true });
  res.json({ success: true, message: 'Logged out successfully' });
});

// Get current user
router.get('/me', auth, (req, res) => {
  UserDAO.getUserById(req.userId)
    .then(user => res.json(user))
    .catch(() => res.status(404).json({ error: 'User not found' }));
});

// Create a new howl
router.post('/howls', auth, (req, res) => {
  const { text } = req.body;
  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Howl text cannot be empty' });
  }
  HowlDAO.createHowl(req.userId, text)
    .then(newHowl => res.status(201).json(newHowl))
    .catch(() => res.status(500).json({ error: 'Failed to post howl' }));
});

// Get howls by user
router.get('/users/:userId/howls', (req, res) => {
  const { userId } = req.params;
  HowlDAO.getHowlsByUser(userId)
    .then(howls => res.json(howls))
    .catch(() => res.status(404).json({ error: 'Howls not found' }));
});

// Get howls from followed users
router.get('/feed', auth, (req, res) => {
  FollowDAO.getFollowedUsers(req.userId)
    .then(followedUsers => {
      const userIds = [req.userId, ...followedUsers];
      return HowlDAO.getHowlsByUsers(userIds);
    })
    .then(feedHowls => res.json(feedHowls))
    .catch(() => res.status(500).json({ error: 'Failed to fetch feed' }));
});

// Follow a user
router.post('/users/:userId/follow', auth, (req, res) => {
  const { userId } = req.params;
  FollowDAO.followUser(req.userId, parseInt(userId))
    .then(followedUsers => res.json(followedUsers))
    .catch(() => res.status(500).json({ error: 'Failed to follow user' }));
});

// Unfollow a user
router.post('/users/:userId/unfollow', auth, (req, res) => {
  const { userId } = req.params;
  FollowDAO.unfollowUser(req.userId, parseInt(userId))
    .then(followedUsers => res.json(followedUsers))
    .catch(() => res.status(500).json({ error: 'Failed to unfollow user' }));
});

// Get followed users for a specific user
router.get('/users/:userId/followed', auth, (req, res) => {
  const { userId } = req.params;
  FollowDAO.getFollowedUsers(userId)
    .then(followedUsers => res.json(followedUsers))
    .catch(() => res.status(500).json({ error: 'Failed to fetch followed users' }));
});

// Get user details by ID
router.get('/users/:userId', (req, res) => {
  const { userId } = req.params;
  UserDAO.getUserById(userId)
    .then(user => res.json(user))
    .catch(() => res.status(404).json({ error: 'User not found' }));
});

module.exports = router;