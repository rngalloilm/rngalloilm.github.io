import React, { useEffect, useState } from 'react'
import { listRecipes, deleteRecipe } from '../services/RecipesService'
import { getIngredients } from "../services/IngredientService.js";
import { useNavigate } from 'react-router-dom'
import {Tooltip as ReactTooltip} from 'react-tooltip';

/** Lists all the recipes and provide the option to create a new recipe
 * and delete an existing recipe.
 */
const ListRecipesComponent = () => {
	/**where we store the recipes and ingredient data */
    const [recipes, setRecipes] = useState([])
    const [ingredients, setIngredients] = useState([]);
    const navigator = useNavigate();
    const [errors, setErrors] = useState({
        general: ""
    })

    // Loads all recipes from the database and fetches all ingredients on page load
    useEffect(() => {
        getAllRecipes()
        fetchAllIngredients()
    }, [])

    // Fetches all recipes from the database and then updates them in React
    function getAllRecipes() {
        listRecipes().then((response) => {
            setRecipes(response.data)
        }).catch(error => {
            console.error(error)
        })
    }
	/**
	 * gets and displays all the ingredients in the system 
	 */
    const fetchAllIngredients = () => {
        getIngredients().then(response => {
            setIngredients(response.data);
        }).catch(error => {
            console.error(error);
        });
    };
	/**
	 * adds new Recipes to the system with the inventory and ingredients in the system 
	 */
    function addNewRecipe() {
        navigator('/add-recipe')
    }
	/**
	 * modify an existing recipes in the system 
	 */
    function modifyRecipe(recipe_name) {
        navigator(`/modify-recipe/${recipe_name}`)
    }
	/**
	 * removes a recipe in the system according to the given id
	 * @param id the id of the ingredient in the system 
	 * @returns the updates from the recipes user actions 
	 */
    function removeRecipe(id) {
        console.log(id)

        deleteRecipe(id).then((response) => {
            getAllRecipes()
        }).catch(error => {
            const errorsCopy = {...errors}
            errorsCopy.general = error.response.data
            console.log(error)
            setErrors(errorsCopy)
        })
    }

    // Function that returns any errors found in a HTML friendly format
    function getGeneralErrors() {
        if (errors.general) {
            return <div className="p-3 mb-2 bg-danger text-white">{errors.general}</div>;
        }
    }

    return (
        <div className="container mt-3">
            <h2 className="text-center">List of Recipes</h2>
            {getGeneralErrors()}
            <h8>Recipes should be set up before accepting any orders for the day. You cannot modify/delete recipes once they are in an order.<br></br></h8>
            <button className="btn btn-primary mb-2" onClick={ addNewRecipe }>Add Recipe</button>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Recipe Name</th>
                        <th>Recipe Price</th>
                        {ingredients.map(ingredient => (
                            <th key={ingredient.id}>Amount {ingredient.name}</th>
                        ))}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        recipes.map(recipe => 
                        <tr key={recipe.id}>
                            <td>{recipe.name}</td>
                            <td>{(recipe.price / 100).toFixed(2)}</td>
                            {ingredients.map(ingredient => {
                                // Find the amount of the current ingredient in the recipe
                                const recipeIngredient = recipe.ingredients.find(ing => ing.ingredient.id === ingredient.id);
                                return (
                                    <td key={ingredient.id}>
                                        {recipeIngredient ? recipeIngredient.amount : 0}
                                    </td>
                                );
                            })}
                            <td>
                                <button className="btn btn-danger" onClick={() => modifyRecipe(recipe.name)}
                                        style={{marginLeft: '10px'}} data-tooltip-id={`modify-tt-${recipe.id}`}  data-tooltip-content={`Modify recipe ${recipe.name}`}>
									<ReactTooltip id={`modify-tt-${recipe.id}`} place="top"/>Modify</button>
                                <button className="btn btn-danger" onClick={() => removeRecipe(recipe.id)}
                                    style={{marginLeft: '10px'}} data-tooltip-id={`delete-tt-${recipe.id}`}  data-tooltip-content={`Delete recipe ${recipe.name}`}
                                > <ReactTooltip id={`delete-tt-${recipe.id}`} place="top"/> Delete</button>
                            </td>
                        </tr>)
                    }
                </tbody>
            </table>
        </div>
    )

}

export default ListRecipesComponent