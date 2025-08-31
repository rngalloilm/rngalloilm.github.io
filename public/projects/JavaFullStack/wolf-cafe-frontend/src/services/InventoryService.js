import axios from "axios"

/** Base URL for the Inventory API - Correspond to methods in Backend's InventoryController. */
const REST_API_BASE_URL = "http://localhost:8080/api/inventory"

/** GET Inventory - returns all inventory */
export const getInventory = (locationId) => axios.get(REST_API_BASE_URL + "/" + locationId)

/** PUT Inventory - updates the inventory */
export const updateInventory = (locationId, inventory) => axios.put(REST_API_BASE_URL + "/" + locationId, inventory)