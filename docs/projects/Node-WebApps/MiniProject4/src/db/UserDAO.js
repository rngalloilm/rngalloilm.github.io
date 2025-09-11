const users = require('../data/users.json');

module.exports = {
  getUserById: (userId) => {
    return new Promise((resolve, reject) => {
      const user = users[userId];
      if (user) {
        resolve(user);
      } else {
        reject(new Error('User not found'));
      }
    });
  },

  getUserByUsername: (username) => {
    return new Promise((resolve, reject) => {
      const user = Object.values(users).find(user => user.username === username);
      if (user) {
        resolve(user);
      } else {
        reject(new Error('User not found'));
      }
    });
  },

  getAllUsers: () => {
    return new Promise((resolve) => {
      resolve(Object.values(users));
    });
  },
};