import axios from "axios";

/** Base URL for the Recipe API - Correspond to methods in Backend's Recipe Controller. */
const REST_API_BASE_URL = "http://localhost:8080/api/menu";

/** GET Menu - lists the menu for a location */
export const getMenu = (locationId) => axios.get(`${REST_API_BASE_URL}/${locationId}`);

/** PUT Menu - updates the menu for a specific location */
export const updateMenuForLocation = (menu, locationId) => 
    axios.put(`${REST_API_BASE_URL}/${locationId}`, menu);
