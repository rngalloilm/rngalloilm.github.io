const follows = require('../data/follows.json');

module.exports = {
  getFollowedUsers: (userId) => {
    return new Promise((resolve) => {
      const followedUsers = follows[userId]?.following || [];
      resolve(followedUsers);
    });
  },

  followUser: (userId, userToFollowId) => {
    return new Promise((resolve) => {
      if (!follows[userId]) {
        follows[userId] = { userId, following: [] };
      }
      if (!follows[userId].following.includes(userToFollowId)) {
        follows[userId].following.push(userToFollowId);
      }
      resolve(follows[userId].following);
    });
  },

  unfollowUser: (userId, userToUnfollowId) => {
    return new Promise((resolve) => {
      if (follows[userId]) {
        follows[userId].following = follows[userId].following.filter(
          id => id !== userToUnfollowId
        );
      }
      resolve(follows[userId]?.following || []);
    });
  },
};