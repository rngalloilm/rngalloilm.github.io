const CountyDAO = require('./CountyDAO');
let parks = require('./data/parks.json');

//This file mimics making asynchronous request to a database
module.exports = {
  getParks: () => {
    return new Promise((resolve, reject) => {
      let parkArray = Object.values(parks);
      parkArray.forEach(park => {
        park.counties = getParkCountyArray(park);
      });
      resolve(parkArray);
    });
  },

  getParksByCountyId: (countyId) => {
    return new Promise((resolve, reject) => {
      try{
        countyId = parseInt(countyId);
        const results = Object.values(parks).filter(park => !countyId || countyId === NaN || park.county.includes(countyId));

        results.forEach(park => {
          park.counties = getParkCountyArray(park);
        });

        resolve(results);
      }
      catch (error) {
        reject(error);
      }
    });
  },

  getParkById: (parkId) => {
    return new Promise((resolve, reject) => {
      const park = parks[parkId];
      if(park) {
        park.counties = getParkCountyArray(park);
        resolve(park);
      }
      else {
        reject();
      }
    });
  },

  createPark: (parkData) => {
    return new Promise((resolve, reject) => {
      // Get the largest id and increment by 1
      let parks = Object.values(parks);
      let lastPark = parks[parks.length - 1];
      let id = lastPark.id + 1;
      // Set id on new park object
      parkData.id = id;
      // Add the new park to the parks object
      parks[id] = parkData;
      resolve(parkData);
    });
  },

};


function getParkCountyArray(park) {
  let parkCounties = [];
  park.county.forEach(countyId => {
    CountyDAO.getCountyById(countyId).then(county => {
      parkCounties.push(county);
    });
  });
  return parkCounties;
}