const howls = require('./howls.json');

module.exports = {
  getHowls: () => {
    return new Promise((resolve, reject) => {
      resolve(howls);
    });
  },

  createHowl: (message) => {
    return new Promise((resolve, reject) => {
      const newHowl = {
        user: '@student',
        message: message
      };
      howls.push(newHowl);
      resolve(newHowl);
    })
  }
};
