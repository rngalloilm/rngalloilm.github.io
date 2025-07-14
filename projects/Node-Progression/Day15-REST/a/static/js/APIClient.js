import HTTPClient from './HTTPClient.js';

export default {
  getCounties,
  getCountyById,
  getParksByCountyId,
  getParkById
};

const BASE_URL = '/api';

// Fetch all counties
function getCounties() {
  return HTTPClient.get(`${BASE_URL}/counties`)
  .then(response => response)
  .catch(error => {
    console.error('Error fetching counties: ', error);
  });
};

// Fetch a specific county by ID
function getCountyById(id) {
  return HTTPClient.get(`${BASE_URL}/counties/${id}`)
  .then(response => response)
  .catch(error => {
    console.error('Error fetching county by ID: ', error);
  });
};

// Fetch parks by county ID
function getParksByCountyId(countyId) {
  return HTTPClient.get(`${BASE_URL}/parks?countyId=${countyId}`)
  .then(response => response)
  .catch(error => {
    console.error('Error fetching parks by county: ', error);
  });
};

// Fetch a specific park by ID
function getParkById(id) {
  return HTTPClient.get(`${BASE_URL}/parks/${id}`)
  .then(response => response)
  .catch(error => {
    console.error('Error fetching park by ID: ', error);
  });
};

// -- Legacy
// import {counties, parks} from './data.js';

// const getCounties = () => {
//   return new Promise((resolve, reject) => {
//     resolve(Object.values(counties));
//   });
// };

// const getCountyById = (id) => {
//   return new Promise((resolve, reject) => {
//     const county = counties[id];
//     if(county) {
//       resolve(county);
//     }
//     else {
//       reject();
//     }
//   });
// };

// const getParksByCountyId = (countyId) => {
//   return new Promise((resolve, reject) => {
//     try{
//       countyId = parseInt(countyId);
//       const results = Object.values(parks).filter(park => !countyId || countyId === NaN || park.county.includes(countyId));
//       results.forEach(park => {
//         park.counties = getParkCountyArray(park);
//       });
//       resolve(results);
//     }
//     catch (error) {
//       reject(error);
//     }
//   });
// };

// const getParkById = (id) => {
//   return new Promise((resolve, reject) => {
//     const park = parks[id];
//     if(park) {
//       park.counties = getParkCountyArray(park);
//       resolve(park);
//     }
//     else {
//       reject();
//     }
//   });
// };

// function getParkCountyArray(park) {
//   let parkCounties = [];
//   park.county.forEach(countyId => {
//     getCountyById(countyId).then(county => {
//       parkCounties.push(county);
//     });
//   });
//   return parkCounties;
// }