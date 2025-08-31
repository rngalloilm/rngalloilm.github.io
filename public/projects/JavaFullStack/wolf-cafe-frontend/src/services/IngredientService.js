import axios from "axios"

/** Base URL for the Ingredients API - Correspond to methods in Backend's IngredientController. */
const REST_API_BASE_URL = "http://localhost:8080/api/ingredients"

/** GET Ingredients - returns all ingredients in databsae */
export const getIngredients = () => axios.get(REST_API_BASE_URL)


/** GET Ingredient - returns all ingredients */
export const  createIngredient = (ingredient) => axios.post(REST_API_BASE_URL, ingredient)

/** DELETE Ingredient - deletes the specified ingredient **/
export const  removeIngredient = (id) => axios.delete(REST_API_BASE_URL + "/" + id)
