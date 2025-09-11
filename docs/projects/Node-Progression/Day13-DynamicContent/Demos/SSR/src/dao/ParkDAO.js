const CountyDAO = require('./CountyDAO');
let {parks} = require('./data');

//This file mimics making asynchronous request to a database
module.exports = {

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

  getParkById: (id) => {
    return new Promise((resolve, reject) => {
      const park = parks[id];
      if(park) {
        park.counties = getParkCountyArray(park);
        resolve(park);
      }
      else {
        reject();
      }
    });
  },

}


function getParkCountyArray(park) {
  let parkCounties = [];
  park.county.forEach(countyId => {
    CountyDAO.getCountyById(countyId).then(county => {
      parkCounties.push(county);
    });
  });
  return parkCounties;
}