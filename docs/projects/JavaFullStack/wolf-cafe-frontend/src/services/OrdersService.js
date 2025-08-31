import axios from 'axios';
import { getToken } from './AuthService';

const API_BASE_URL = 'http://localhost:8080/api/orders';

// Set the authorization header for every request using an interceptor
axios.interceptors.request.use(config => {
    const token = getToken();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// Fetch pending orders by location ID
export const getPendingOrders = (locationId) => axios.get(`${API_BASE_URL}/pending/${locationId}`);

// Fetch all completed orders by location ID
export const getCompletedOrders = (locationId) => axios.get(`${API_BASE_URL}/completed/${locationId}`);

// Create a new order
export const createOrder = (order) => axios.post(API_BASE_URL, order);

// Delete an order by ID
export const deleteOrder = (id) => axios.delete(`${API_BASE_URL}/${id}`);

// Fulfill an order by ID
export const fulfillOrder = (id) => axios.put(`${API_BASE_URL}/${id}/status/ready`);

// Get an order by ID
export const getActiveOrder = (id, email) =>
    axios.get(`${API_BASE_URL}/${id}`, { params: { email } });

// Customer completes (picks up) an order
export const completeOrder = (id) => axios.put(`${API_BASE_URL}/${id}/status/completed`);

// Fetch anonymous orders by location ID
export const getAnonymousOrders = (locationId) => axios.get(`${API_BASE_URL}/anonymous/${locationId}`);