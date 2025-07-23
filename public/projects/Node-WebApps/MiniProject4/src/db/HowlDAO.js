const howls = require('../data/howls.json');

module.exports = {
  // Create a new howl
  createHowl: (userId, text) => {
    return new Promise((resolve) => {
      const newHowl = {
        id: Object.keys(howls).length + 1,
        userId,
        datetime: new Date().toISOString(),
        text,
      };
      howls[newHowl.id] = newHowl;
      resolve(newHowl);
    });
  },

  // Get howls by a specific user
  getHowlsByUser: (userId) => {
    return new Promise((resolve) => {
      const userHowls = Object.values(howls).filter(howl => howl.userId === userId);
      // Sort howls in reverse chronological order
      userHowls.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
      resolve(userHowls);
    });
  },

  // Get howls by multiple users (for the feed)
  getHowlsByUsers: (userIds) => {
    return new Promise((resolve) => {
      const feedHowls = Object.values(howls).filter(howl =>
        userIds.includes(howl.userId)
      );
      // Sort howls in reverse chronological order
      feedHowls.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
      resolve(feedHowls);
    });
  },
};