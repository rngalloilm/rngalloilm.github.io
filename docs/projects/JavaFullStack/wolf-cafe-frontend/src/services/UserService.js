import axios from "axios";
import { getToken } from "./AuthService";

/** Base URL for the User API */
const REST_API_BASE_URL = "http://localhost:8080/api/users";

/** GET Users - lists all users (only accessible to admin) */
export const listUsers = () => {
  const token = getToken();
  return axios.get(REST_API_BASE_URL, {
    headers: {
      'Authorization': `${token}`,
    },
  });
};

/** DELETE User - deletes a user by ID (only accessible to admin) */
export const deleteUser = (id) => {
  const token = getToken();
  return axios.delete(REST_API_BASE_URL + "/" + id, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

/** GET User by ID */
export const getUserById = (id) => {
  const token = getToken();
  return axios.get(REST_API_BASE_URL + "/" + id, {
    headers: {
      'Authorization': `${token}`,
    },
  });
};

/** PUT Update User */
export const editUser = (id, userData) => {
  const token = getToken();
  return axios.put(REST_API_BASE_URL + "/" + id, userData, {
    headers: {
      'Authorization': `${token}`,
    },
  });
};

/** GET current user */
export const getCurrentUser = () => {
	const token = getToken();
  return axios.get(REST_API_BASE_URL + "/me"	, {
	    headers: {
	      'Authorization': `${token}`,
	    },
	  });
};
