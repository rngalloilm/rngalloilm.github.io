import axios from 'axios';
import { getToken } from './AuthService';

const API_BASE_URL = 'http://localhost:8080/api/locations';

// Set the authorization header for every request using an interceptor
axios.interceptors.request.use(config => {
    const token = getToken();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// Fetch all locations
export const getAllLocations = () => axios.get(API_BASE_URL);

// Fetch a single location by ID
export const getLocationById = (id) => axios.get(`${API_BASE_URL}/${id}`);

// Delete a location by ID
export const deleteLocationById = (id) => axios.delete(`${API_BASE_URL}/${id}`);

// Create a new location
export const createLocation = (location) => {
    return axios.post(API_BASE_URL, location, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`,
        },
    });
};
//updates the tax for a specific location
export const updateLocationTaxRate = (id, taxRate) => {
    return axios.put(`${API_BASE_URL}/${id}/taxrate`, { taxRate }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`,
        },
    });
};


export const fetchLocations = () => getAllLocations();