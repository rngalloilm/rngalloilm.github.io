//neccesary imports
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAdminUser } from '../services/AuthService';
import { getMenu } from '../services/MenuService';
import { getAllLocations } from '../services/LocationService';
import { Tooltip as ReactTooltip } from 'react-tooltip';
//a component to dispaly menu details 
const MenuComponent = () => {
    const [recipes, setRecipes] = useState([]); //stores the list of recipes
    const [items, setItems] = useState([]); //stores the list of items 
    const [locations, setLocations] = useState([]); //stores the list of locations
    const [selectedLocation, setSelectedLocation] = useState(""); //stores the selected location
    const navigate = useNavigate();
    const isAdmin = isAdminUser(); //checks if the user is an admin 
	//fetches the location
    useEffect(() => {
        fetchLocations();
    }, []);

	//fetches menu whenever the location changes
    useEffect(() => {
        if (selectedLocation) {
            listMenu(selectedLocation);
        }
    }, [selectedLocation]);
	//fetches the list of locations
    function fetchLocations() {
        getAllLocations()
            .then((response) => {
                setLocations(response.data);
                if (response.data.length > 0) {
                    setSelectedLocation(response.data[0].id);
                }
            })
            .catch((error) => {
                console.error("Error fetching locations:", error);
            });
    }
	//fetches the menu from the selected location
    function listMenu(locationId) {
        getMenu(locationId)
            .then((response) => {
                const { recipeList, itemList } = response.data;

                const transformedRecipes = recipeList
                    .filter((entry) => entry.included) 
                    .map((entry) => ({
                        id: entry.id,
                        name: entry.recipe.name,
                        price: entry.recipe.price,
                        ingredients: entry.recipe.ingredients,
                    }));

                const transformedItems = itemList
                    .filter((entry) => entry.included) 
                    .map((entry) => ({
                        id: entry.id,
                        name: entry.item.name,
                        description: entry.item.description,
                        price: entry.item.price,
                    }));

                setRecipes(transformedRecipes);
                setItems(transformedItems);
            })
            .catch((error) => {
                console.error("Error fetching menu data:", error);
            });
    }
	//handles a change of location
    const handleLocationChange = (event) => {
        setSelectedLocation(event.target.value);
    };
	//handles displaying ingredients for the selected recipe
    const handleShowIngredients = (ingredients) => {
        const ingredientNames = ingredients
            .map((ing) => ing.ingredient.name)
            .join(", ");
        alert(`Ingredients: ${ingredientNames}`);
    };
	//render the component 
    return (
        <div className='container'>
            <h2 className='text-center'>Menu</h2>
            
            <div className="mb-3">
                <label htmlFor="locationSelector" className="form-label">Select Location:</label>
                <select 
                    id="locationSelector" 
                    className="form-select" 
                    value={selectedLocation} 
                    onChange={handleLocationChange}
                >
                    {locations.map((location) => (
                        <option key={location.id} value={location.id}>
                            {location.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="menu-section">
                <h3>Recipes</h3>
                <table className='table table-bordered table-striped'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Ingredients</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recipes.length > 0 ? (
                            recipes.map((recipe) => (
								<tr key={recipe.id}>
								 <td>{recipe.name}</td>
								      <td>{(recipe.price / 100).toFixed(2)}</td>
								        <td>
								          <button
								              className='btn btn-info'
								               onClick={() => handleShowIngredients(recipe.ingredients)}
								               data-tooltip-id={`recipe-ingredients-${recipe.id}`} 
								               data-tooltip-content={`Show ingredients for ${recipe.name}`}
								               >
								              Show Ingredients
								              </button>
								               <ReactTooltip id={`recipe-ingredients-${recipe.id}`} place="top" />
								               </td>
								               </tr>

                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center">No recipes available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="menu-section mt-4">
                <h3>Items</h3>
                <table className='table table-bordered table-striped'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length > 0 ? (
                            items.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.description}</td>
                                    <td>{item.price}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center">No items available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MenuComponent;