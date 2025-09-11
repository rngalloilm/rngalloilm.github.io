import HTTPClient from './HTTPClient.js';

const BASE_API_PATH = './api';

const getCounties = () => {
  return HTTPClient.get(`${BASE_API_PATH}/counties`);
};

const getCountyById = (id) => {
  return HTTPClient.get(`${BASE_API_PATH}/counties/${id}`);
};

const getParks = () => {
  return HTTPClient.get(`${BASE_API_PATH}/parks`);
};

const getParkById = (id) => {
  return HTTPClient.get(`${BASE_API_PATH}/parks/${id}`);
};

const getParksByCountyId = (countyId) => {
  if(countyId == "all") {
    return getParks();
  }
  return HTTPClient.get(`${BASE_API_PATH}/counties/${countyId}/parks`);
};

const getVisitedParks = () => {
  return HTTPClient.get(`${BASE_API_PATH}/parks/visited`);
};

export default {
  getCounties,
  getCountyById,
  getParks,
  getParkById,
  getParksByCountyId,
  getVisitedParks
};
