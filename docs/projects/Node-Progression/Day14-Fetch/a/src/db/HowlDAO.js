const howls = require('./howls.json');

module.exports = {
  getHowls: () => {
    return new Promise((resolve, reject) => {
      resolve(howls);
    });
  },
};