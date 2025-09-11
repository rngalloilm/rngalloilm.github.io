let counties = require('./data/counties.json');

//This file mimics making asynchronous request to a database
module.exports = {
  getCounties: () => {
    return new Promise((resolve, reject) => {
      resolve(Object.values(counties));
    });
  },

  getCountyById: (countyId) => {
    return new Promise((resolve, reject) => {
      const county = counties[countyId];
      if(county) {
        resolve(county);
      }
      else {
        reject();
      }
    });
  },

  createCounty: (countyName) => {
    return new Promise((resolve, reject) => {
      // Get the largest id and increment by 1
      let id = Object.keys(counties).length + 1;
      // Create the new county object
      const county = {
        id: id,
        name: countyName
      };
      // Add the new county to the counties object
      counties[id] = county;
      resolve(county);
    });
  },
};
