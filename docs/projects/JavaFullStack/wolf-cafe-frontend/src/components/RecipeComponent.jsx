import React, {useEffect, useState} from 'react'
import { createRecipe } from '../services/RecipesService'
import { useNavigate } from 'react-router-dom'
import {getIngredients} from "../services/IngredientService.js";

/** Form to create a new recipe. */
const RecipeComponent = () => {

    /** Where we store the name and price of the recipe being created **/
    const [name, setName] = useState("")
    const [stringPrice, setPrice] = useState("")

    /** Where we store the list of ingredients being used & the ingredients leftover **/
    const [ingredientsForRecipe, setIngredientsForRecipe] = useState([]);
    const [availableIngredients, setAvailableIngredients] = useState([]);

    /** Where we store the selected ingredient (from the select field to add/remove) **/
    const [selectedIngredient, setSelectedIngredient] = useState({ingredient: {id: -1, name: ""}, amount: 0});
    const [selectedRemoveIngredient, setSelectedRemoveIngredient] = useState({ingredient: {id: -1, name: ""}, amount: 0});

    /** Where we handle navigation & error states **/
    const navigator = useNavigate()
    const [errors, setErrors] = useState({
        general: "",
        name: "",
        price: ""
    })
    const [isValid, setIsValid] = useState(true);

    /** Upon page load, all ingredients are loaded from the back-end into the "add ingredient" select **/
    useEffect(() => {
        getAllIngredients()
    }, [])

    // Function to fetch all ingredients from the back-end and then transform them into {ingredient, amount}, from which we update the front-end
    function getAllIngredients() {
        getIngredients().then((response) => {
            // Transform the response data to include ingredient and amount fields
            const transformedData = response.data.map(ingredient => ({
                ingredient: ingredient,
                amount: 0
            }));

            // Set the transformed data to availableIngredients
            setAvailableIngredients(transformedData);
        }).catch(error => {
            console.log(error);
        });
    }

    // Function to update the ingredient amount in the backend from a front-end entry
    const setIngredientAmount = (id, stringAmount) => {
        if(stringAmount.length === 0) {
            stringAmount = "0";
        }

        let amount = parseInt(stringAmount) || 0;
        const updatedErrors = { ...errors };

        // Check if value is negative
        if (amount < 0) {
            updatedErrors[id] = "Amount cannot be negative";
        } else {
            delete updatedErrors[id]; // Clear the error if valid
        }

        setErrors(updatedErrors);
        setIsValid(Object.keys(updatedErrors).length === 0);

        setIngredientsForRecipe(prevIngredients =>
            prevIngredients.map(ingredient =>
                ingredient.ingredient.id === id ? { ...ingredient, amount: amount } : ingredient
            )
        );
    };

    // Function to add ingredient that was selected
    const addIngredient = (e) => {
        e.preventDefault()

        if(selectedIngredient.ingredient.name.length == 0){
            return
        }

        if (selectedIngredient && !ingredientsForRecipe.some(ing => ing.ingredient.id === selectedIngredient.ingredient.id)) {
            setAvailableIngredients(availableIngredients.filter(ing => {
                return ing.ingredient.id !== selectedIngredient.ingredient.id
            }));
            const modifiedRecipe = {ingredient: {id: parseInt(selectedIngredient.ingredient.id), name: selectedIngredient.ingredient.name},
                amount: parseInt(selectedIngredient.amount)}
            setIngredientsForRecipe([...ingredientsForRecipe, modifiedRecipe]);
            setSelectedIngredient({ingredient: {id: -1, name: ""}, amount: 0}); // Clear the selected ingredient
        }
    };

    // Function to remove ingredient that was selected
    const removeIngredient = (e) => {
        e.preventDefault();
        if (selectedRemoveIngredient && ingredientsForRecipe.some(ing => ing.ingredient.id === selectedRemoveIngredient.ingredient.id)) {
            setIngredientsForRecipe(ingredientsForRecipe.filter(ing => {
                return ing.ingredient.id !== selectedRemoveIngredient.ingredient.id
            }));
            const modifiedRecipe = {ingredient: {id: parseInt(selectedRemoveIngredient.ingredient.id), name: selectedRemoveIngredient.ingredient.name},
                amount: 0}
            setAvailableIngredients([...availableIngredients, modifiedRecipe]);
            setSelectedRemoveIngredient({ingredient: {id: -1, name: ""}, amount: 0}); // Clear the selected ingredient
        }
    };

    // Function to save recipe and then navigate back to the recipe list page (with error validation)
    function saveRecipe(e) {
        console.log("got save recipe");
        e.preventDefault();

        if (validateForm()) {
            const ingredients = ingredientsForRecipe;
            const price = parseInt((parseFloat(stringPrice) * 100))
            const recipe = {name, price, ingredients}
            console.log(recipe)

            createRecipe(recipe).then((response) => {
                console.log(response.data)
                navigator("/recipes")
            }).catch(error => {
                console.error(error)
                const errorsCopy = {... errors}
                if (error.response.status == 507) {
                    errorsCopy.general = "Recipe list is at capacity."
                } 
                if (error.response.status == 409) {
                    errorsCopy.general = "Duplicate recipe name."
                }

                if(error.response.status == 400) {
                    //console.log(error.response.data.error);
                    errorsCopy.general = error.response.data.error;
                }

                setErrors(errorsCopy)
            })
        } else {
            console.log("failed to validate")
        }
    }

    // Function that validates the user's inputs and then presents any errors if any problems are found.
    function validateForm() {
        let valid = true
        
        const errorsCopy = {... errors}

        if (name.trim()) {
            errorsCopy.name = ""
        } else {
            errorsCopy.name = "Name is required."
            valid = false
        }

        if (ingredientsForRecipe.length === 0) {
            errorsCopy.general = "At least one ingredient is required."
            valid = false
        } else {
            errorsCopy.general = ""
        }

        const price = parseFloat(stringPrice);
        if (isNaN(price) || price < 0 ) {
            errorsCopy.price = "Price must be a positive number."
            valid = false
        }
		
		if (stringPrice.indexOf('.') == -1 || stringPrice.slice(-3, -2) != '.') {
            errorsCopy.price = "Price must include a decimal following: P.XX"
            valid = false
        }

        ingredientsForRecipe.forEach((ingredient) => {
            const numericValue = parseFloat(ingredient.amount);
            if (numericValue < 0 || isNaN(numericValue)) {
                errorsCopy[ingredient.ingredient.id] = "Amount cannot be negative or empty";
            } else {
                delete errorsCopy[ingredient.ingredient.id]
            }
        });

        setErrors(errorsCopy);
        setIsValid(Object.keys(errorsCopy).length === 3);

        // Return whether the form is valid
        if(valid) {
            valid = Object.keys(errorsCopy).length === 3;
        }

        return valid
    }

    // Function that returns any errors found in a HTML friendly format
    function getGeneralErrors() {
        if (errors.general) {
            return <div className="p-3 mb-2 bg-danger text-white">{errors.general}</div>
        }
    }

    return (
        <div className="container mt-3">
            <br /><br />
            <div className="row">
                <div className="card col-md-6 offset-md-3">
                    <h2 className="text-center">Add Recipe</h2>

                    <div className="card-body">
                        { getGeneralErrors() }
                        <form>
                            <div className="form-group mb-2">
                                <label className="form-label">Recipe Name</label>
                                <input 
                                    type="text"
                                    name="recipeName"
                                    placeholder="Enter Recipe Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`form-control ${errors.name ? "is-invalid":""}`}
                                >
                                </input>
                                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                            </div>

                            <div className="form-group mb-2">
                                <label className="form-label">Recipe Price</label>
                                <input 
                                    type="text"
                                    name="recipePrice"
                                    placeholder="Enter Recipe Price (as P.XX)"
                                    value={stringPrice}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className={`form-control ${errors.price ? "is-invalid":""}`}
                                >
                                </input>
                                {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                            </div>

                            { /** We map all ingredients selected into a field for the user to modify **/ }
                            {
                                ingredientsForRecipe.map((ingredient) => (
                                    <div className="form-group mb-2" key={ingredient.ingredient.id}>
                                        <label className="form-label">Amount for {ingredient.ingredient.name}</label>
                                        <input
                                            type="text"
                                            name={`amount_${ingredient.ingredient.name}`}
                                            placeholder={`Enter Amount for ${ingredient.ingredient.name}`}
                                            value={ingredient.amount || ""}
                                            onChange={(e) => setIngredientAmount(ingredient.ingredient.id, e.target.value)}
                                            className="form-control"
                                        />

                                        {errors[ingredient.ingredient.id] && (
                                            <div className="text-danger">
                                                {errors[ingredient.ingredient.id]}
                                            </div>
                                        )}
                                    </div>
                                ))
                            }
                            
                            { /** Component to select any ingredients the user wishes to be in the recipe **/ }
                            <div className="form-group mb-2">
                                <label className="form-label">Add Ingredient</label>
                                <div className="d-flex align-items-center mb-2">
                                    <select
                                        className="form-select"
                                        value={selectedIngredient.ingredient.name}
                                        onChange={(e) => {
                                            const selectedId = e.target.options[e.target.selectedIndex].getAttribute('data-id'); // Get the id from data-id attribute
                                            const selectedAmount = e.target.options[e.target.selectedIndex].getAttribute('data-id-2'); // Get the amount from data-id attribute
                                            setSelectedIngredient({ingredient: {id: parseInt(selectedId), name: e.target.value}, amount: selectedAmount});
                                        }}
                                    >
                                        <option value="">Select Ingredient</option>
                                        {availableIngredients.map((ingredient) => (
                                            <option key={ingredient.ingredient.id} value={ingredient.ingredient.name} data-id={ingredient.ingredient.id} data-id-2={ingredient.amount}>
                                                {ingredient.ingredient.name}
                                            </option>
                                        ))}
                                    </select>
                                    <button className="btn btn-primary ms-2" onClick={addIngredient}>Add Ingredient</button>
                                </div>
                            </div>

                            { /** Component to select any ingredients the user wishes to remove from the recipe **/ }
                            <div className="form-group mb-2">
                                <label className="form-label">Remove Ingredient</label>
                                <div className="d-flex align-items-center mb-2">
                                    <select
                                        className="form-select"
                                        value={selectedRemoveIngredient.ingredient.name}
                                        onChange={(e) => {
                                            const selectedId = e.target.options[e.target.selectedIndex].getAttribute('data-id'); // Get the id from data-id attribute
                                            const selectedAmount = e.target.options[e.target.selectedIndex].getAttribute('data-id-2'); // Get the amount from data-id attribute
                                            setSelectedRemoveIngredient({ingredient: {id: parseInt(selectedId), name: e.target.value}, amount: selectedAmount});
                                        }}    >
                                        <option value="">Select Ingredient to Remove</option>
                                        {ingredientsForRecipe.map((ingredient) => (
                                            <option key={ingredient.ingredient.id} value={ingredient.ingredient.name} data-id={ingredient.ingredient.id} data-id-2={ingredient.amount}>
                                                {ingredient.ingredient.name}
                                            </option>
                                        ))}
                                    </select>
                                    <button className="btn btn-danger ms-2" onClick={removeIngredient}>Remove Ingredient</button>
                                </div>
                            </div>
                            <button className="btn btn-success" onClick={(e) => saveRecipe(e)}>Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default RecipeComponent