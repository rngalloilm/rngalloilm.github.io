import HTTPClient from './HTTPClient.js';

const BASE_API_PATH = './api';

const handleAuthError = (error) => {
  if(error.status === 401) {
    document.location = './login';
  }
  throw error;
};


const getCounties = () => {
  return HTTPClient.get(`${BASE_API_PATH}/counties`)
    .catch(handleAuthError);
};

const getCountyById = (id) => {
  return HTTPClient.get(`${BASE_API_PATH}/counties/${id}`)
  .catch(handleAuthError);
};

const getParks = () => {
  return HTTPClient.get(`${BASE_API_PATH}/parks`)
  .catch(handleAuthError);
};

const getParkById = (id) => {
  return HTTPClient.get(`${BASE_API_PATH}/parks/${id}`)
  .catch(handleAuthError);
};

const getParksByCountyId = (countyId) => {
  if(countyId == "all") {
    return getParks();
  }
  return HTTPClient.get(`${BASE_API_PATH}/counties/${countyId}/parks`)
  .catch(handleAuthError);
};

const getVisitedParks = () => {
  return HTTPClient.get(`${BASE_API_PATH}/users/current/parks`)
  .catch(handleAuthError);
};





const logIn = (username, password) => {
  const data = {
    username: username,
    password: password
  };
  return HTTPClient.post(`${BASE_API_PATH}/users/login`, data);
};

const logOut = () => {
  return HTTPClient.post(`${BASE_API_PATH}/users/logout`, {});
};

const getCurrentUser = () => {
  return HTTPClient.get(`${BASE_API_PATH}/users/current`)
  .catch(handleAuthError);
};



export default {
  getCounties,
  getCountyById,
  getParks,
  getParkById,
  getParksByCountyId,
  getVisitedParks,
  getCurrentUser,
  logIn,
  logOut
};
