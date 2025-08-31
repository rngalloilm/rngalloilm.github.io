import {useEffect, useState} from 'react'
import {getRecipe, updateRecipe} from '../services/RecipesService.js'
import {useNavigate, useParams} from 'react-router-dom'
import {getIngredients} from "../services/IngredientService.js";
import {Tooltip as ReactTooltip} from 'react-tooltip';

const ModifyRecipeComponent = () => {

    /** Where we store the name and price of the recipe being created **/
    const { recipeName } = useParams(); // Fetch recipeId from the URL params
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");

    /** Where we store the list of ingredients being used & the ingredients leftover **/
    const [ingredientsForRecipe, setIngredientsForRecipe] = useState([]);
    const [availableIngredients, setAvailableIngredients] = useState([]);
    const [isValid, setIsValid] = useState(true);

    /** Where we store the selected ingredient (from the select field to add/remove) **/
    const [selectedIngredient, setSelectedIngredient] = useState({ ingredient: { id: -1, name: "" }, amount: 0 });
    const [selectedRemoveIngredient, setSelectedRemoveIngredient] = useState({ ingredient: { id: -1, name: "" }, amount: 0 });

    /** Where we handle navigation & error states **/
    const navigator = useNavigate()
    const [errors, setErrors] = useState({
        general: "",
        name: "",
        price: ""
    })

    /**
     * Upon page load, all ingredients are loaded from the back-end into the "add ingredient" select
     * OR "remove ingredient select, and the recipe ingredients are loaded into their fields
     * with pre-set amounts from the database
     * **/
	
	useEffect(() => {
	        getAllIngredients();

	        // Initialize Bootstrap tooltips
	        const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
	        tooltipTriggerList.forEach(tooltipTriggerEl => {
	            new bootstrap.Tooltip(tooltipTriggerEl);
	        });

	    }, [recipeName]);
   

    // Loads ingredients from the database then calls "loadRecipe" to load the fields
    function getAllIngredients() {
        getIngredients().then((response) => {
            const transformedData = response.data.map(ingredient => ({
                ingredient: {
                    name: ingredient.name,
                    id: ingredient.id
                },
                amount: 0
            }));

            // Load the recipe only after ingredients have been fetched
            if (recipeName) {
                loadRecipe(recipeName, transformedData);
            }
        }).catch(error => {
            console.error(error);
        });
    }

    // Loads the recipe from the database. Sets the ID, name, price, ingredients (and amounts) + the available ingredients not chosen yet
    function loadRecipe(name, transformedData) {
        getRecipe(name).then((response) => {
            const { id, name, price, ingredients } = response.data;
            setId(id);
            setName(name);
            setPrice(price);
            setIngredientsForRecipe(ingredients);
            console.log(ingredients)
            // Remove selected ingredients from the available list
            const updatedAvailableIngredients = transformedData.filter(ing =>
                !ingredients.some(recipeIng => recipeIng.ingredient.id === ing.ingredient.id)
            );

            setAvailableIngredients(updatedAvailableIngredients);
        }).catch(error => {
            console.error("Error loading recipe: ", error);
        });
    }

    // Function to update the ingredient amount in the backend from a front-end entry

    const setIngredientAmount = (id, stringAmount) => {
        const amount = parseInt(stringAmount) || 0;

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
        e.preventDefault();
        if (selectedIngredient && !ingredientsForRecipe.some(ing => ing.ingredient.id === selectedIngredient.ingredient.id)) {
            const updatedAvailableIngredients = availableIngredients.filter(ing => ing.ingredient.id !== selectedIngredient.ingredient.id);
            setAvailableIngredients(updatedAvailableIngredients);

            // Add selected ingredient to ingredientsForRecipe
            const modifiedRecipe = { ...selectedIngredient, amount: parseInt(selectedIngredient.amount) || 0 };
            setIngredientsForRecipe([...ingredientsForRecipe, modifiedRecipe]);

            // Reset the selected ingredient state
            setSelectedIngredient({ ingredient: { id: -1, name: "" }, amount: 0 });
        }
    };

    // Function to remove ingredient that was selected
    const removeIngredient = (e) => {
        e.preventDefault();
        if (selectedRemoveIngredient && ingredientsForRecipe.some(ing => ing.ingredient.id === selectedRemoveIngredient.ingredient.id)) {
            setIngredientsForRecipe(ingredientsForRecipe.filter(ing => ing.ingredient.id !== selectedRemoveIngredient.ingredient.id));
            setAvailableIngredients([...availableIngredients, selectedRemoveIngredient]);
            setSelectedRemoveIngredient({ ingredient: { id: -1, name: "" }, amount: 0 });
        }
    };

    // Function to save recipe and then navigate back to the recipe list page (with error validation)
    function saveRecipe(e) {
        e.preventDefault();
        if (validateForm()) {
            const priceAsNumber = parseInt(price);
            const recipe = { id, name, price: priceAsNumber, ingredients: ingredientsForRecipe };

            updateRecipe(recipe).then((response) => {
                navigator("/recipes");
            }).catch(error => {
                console.error(error.response);
                const errorsCopy = { ...errors };
                if (error.response.status === 507) {
                    errorsCopy.general = "Recipe list is at capacity.";
                }
                if (error.response.status === 409) {
                    errorsCopy.general = "Duplicate recipe name.";
                }
                if (error.response.status === 405){
                    errorsCopy.general = error.response.data;
                }
                setErrors(errorsCopy);
            });
        }
    }

    // Function that validates the user's inputs and then presents any errors if any problems are found.
    function validateForm() {
        let valid = true;
        const errorsCopy = { ...errors };

        if (!name.trim()) {
            errorsCopy.name = "Name is required.";
            valid = false;
        } else {
            errorsCopy.name = "";
        }

        if (isNaN(price) || parseInt(price) <= 0) {
            errorsCopy.price = "Price must be a positive integer.";
            valid = false;
        } else {
            errorsCopy.price = "";
        }

        if (ingredientsForRecipe.length === 0) {
            errorsCopy.general = "At least one ingredient is required.";
            valid = false;
        }

        ingredientsForRecipe.forEach((ingredient) => {
            const numericValue = parseFloat(ingredient.amount);
            if (numericValue < 0 || isNaN(numericValue)) {
                errorsCopy[ingredient.ingredient.id] = "Amount cannot be negative or empty";
            }
        });

        setErrors(errorsCopy);
        setIsValid(Object.keys(errorsCopy).length === 3);

        // Return whether the form is valid
        if(valid) {
            valid = Object.keys(errorsCopy).length === 3;
        }

        return valid;
    }

    // Function that returns any errors found in a HTML friendly format
    function getGeneralErrors() {
        if (errors.general) {
            return <div className="p-3 mb-2 bg-danger text-white">{errors.general}</div>;
        }
    }

    return (
        <div className="container mt-3">
            <br /><br />
            <div className="row">
                <div className="card col-md-6 offset-md-3">
                    <h2 className="text-center">Modify Recipe</h2>
                    <div className="card-body">
                        {getGeneralErrors()}
                        <form>
                            <div className="form-group mb-2">
                                <label className="form-label">Recipe Name</label>
                                <input
                                    type="text"
                                    name="recipeName"
                                    placeholder="Enter Recipe Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                />
                                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                            </div>

                            <div className="form-group mb-2">
                                <label className="form-label">Recipe Price</label>
                                <input
                                    type="text"
                                    name="recipePrice"
                                    placeholder="Enter Recipe Price (as an integer)"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className={`form-control ${errors.price ? "is-invalid" : ""}`}
                                />
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
                                            const selectedId = e.target.options[e.target.selectedIndex].getAttribute('data-id');
                                            setSelectedIngredient({ ingredient: { id: parseInt(selectedId), name: e.target.value }, amount: 0 });
                                        }}
                                    >
                                        <option value="">Select Ingredient</option>
                                        {availableIngredients.map((ingredient) => (
                                            <option key={ingredient.ingredient.id} value={ingredient.ingredient.name} data-id={ingredient.ingredient.id}>
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
                                            const selectedId = e.target.options[e.target.selectedIndex].getAttribute('data-id');
                                            setSelectedRemoveIngredient({ ingredient: { id: parseInt(selectedId), name: e.target.value }, amount: 0 });
                                        }}
                                    >
                                        <option value="">Select Ingredient to Remove</option>
                                        {ingredientsForRecipe.map((ingredient) => (
                                            <option key={ingredient.ingredient.id} value={ingredient.ingredient.name} data-id={ingredient.ingredient.id}>
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

export default ModifyRecipeComponent