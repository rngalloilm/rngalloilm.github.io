let {counties} = require('./data');

//This file mimics making asynchronous request to a database
module.exports = {
  getCounties: () => {
    return new Promise((resolve, reject) => {
      resolve(Object.values(counties));
    });
  },

  getCountyById: (id) => {
    return new Promise((resolve, reject) => {
      const county = counties[id];
      if(county) {
        resolve(county);
      }
      else {
        reject();
      }
    });
  },

}

