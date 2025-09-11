import axios from 'axios'
import { getToken } from './AuthService'

const BASE_REST_API_URL = 'http://localhost:8080/api/items'

axios.interceptors.request.use(config => {
    const token = getToken();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

/** POST Item - Saves item to backend */
export const saveItem = (item) => axios.post(BASE_REST_API_URL, item)
/** GET Item - Gets an item based on a given ID */
export const getItemById = (id) => axios.get(BASE_REST_API_URL + '/' + id)
/** GET Items - Gets all items stored in the backend */
export const getAllItems = () => axios.get(BASE_REST_API_URL)
/** PUT Item - Updates an item stored in the backend to have a new value */
export const updateItem = (id, item) => axios.put(BASE_REST_API_URL + '/' + id, item)
/** DELETE Item - Deletes an item from the backend based on a given ID */
export const deleteItemById = (id) => axios.delete(BASE_REST_API_URL + '/' + id)