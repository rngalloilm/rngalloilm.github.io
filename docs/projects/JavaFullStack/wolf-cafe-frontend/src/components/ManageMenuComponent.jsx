import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMenu, updateMenuForLocation } from '../services/MenuService';
import { getAllItems } from '../services/ItemService';
import {getLocationId } from '../services/AuthService'
import { listRecipes } from '../services/RecipesService'
import {Tooltip as ReactTooltip} from 'react-tooltip';

const ManageMenuComponent = () => {
    const [recipes, setRecipes] = useState([]);
    const [items, setItems] = useState([]);
    const [location, setLocation] = useState([]);
    const [filter, setFilter] = useState("all");
    const navigate = useNavigate();

    const locationId = getLocationId();

    useEffect(() => {
        fetchMenuData();
    }, []);

    const fetchMenuData = () => {
        getMenu(locationId).then((response) => {
            const { location, recipeList, itemList } = response.data;
            setLocation(location);

            // Populate recipes and items with included status
            getAllRecipes(location, recipeList);
            fetchItemsData(location, itemList);
        }).catch(error => {
            console.error("Error fetching menu data:", error);
        });
    };

    const getAllRecipes = (location, recipeList) => {
        listRecipes().then((response) => {
            const transformedRecipes = response.data.map(recipe => {
                const existingRecipe = recipeList.find(r => r.recipe.id === recipe.id);
                return existingRecipe
                    ? { ...existingRecipe, included: existingRecipe.included }
                    : { id: recipe.id, included: false, menuId: location.menuId, recipe: recipe };
            });
            setRecipes(transformedRecipes);
        }).catch(error => {
            console.error(error);
        });
    };

    const fetchItemsData = (location, itemList) => {
        getAllItems().then((response) => {
            const transformedItems = response.data.map(item => {
                const existingItem = itemList.find(i => i.item.id === item.id);
                return existingItem
                    ? { ...existingItem, included: existingItem.included }
                    : { id: item.id, included: false, menuId: location.menuId, item: item };
            });
            setItems(transformedItems);
        }).catch(error => {
            console.error("Error fetching items data:", error);
        });
    };

    const handleRecipeToggle = (id) => {
        setRecipes(prevRecipes =>
            prevRecipes.map(recipe =>
                recipe.id === id ? { ...recipe, included: !recipe.included } : recipe
            )
        );
    };

    const handleItemToggle = (id) => {
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, included: !item.included } : item
            )
        );
    };

    const handleSaveChanges = () => {
        updateMenuForLocation({ recipeList: recipes, itemList: items }, locationId).then(() => {
            alert("Menu updated successfully!");
        }).catch(error => {
            console.error("Error updating menu:", error);
        });
    };

    const filteredRecipes = recipes.filter(recipe => {
        if (filter === "included") return recipe.included;
        if (filter === "excluded") return !recipe.included;
        return true;
    });

    const filteredItems = items.filter(item => {
        if (filter === "included") return item.included;
        if (filter === "excluded") return !item.included;
        return true;
    });

    return (
        <div className='container mt-3'>
            <h2 className='text-center'>Manage Menu</h2>
            <div className='d-flex justify-content-between mb-3'>
                <button className="btn btn-primary" onClick={() => navigate('/add-recipe')}>Add New Recipe</button>
                <button className="btn btn-secondary" onClick={() => navigate('/add-item')}>Add New Item</button>
                <select className="form-select w-25" value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="all">Show All</option>
                    <option value="included">Included Only</option>
                    <option value="excluded">Excluded Only</option>
                </select>
                <button className="btn btn-success" onClick={handleSaveChanges}>Save Changes</button>
            </div>
            <div className='menu-section'>
                <h3>Recipes</h3>
                <table className='table table-bordered'>
                    <thead>
                        <tr>
                            <th>Select</th>
                            <th>Name</th>
                            <th>Price</th>
                        </tr>
                    </thead>
					<tbody>
					     {filteredRecipes.map(recipe => (
					                            <tr key={`R${recipe.id}`}>
					                                <td data-tooltip-id={`mm-checkbox-tt-R${recipe.recipe.id}`} data-tooltip-content={`${
					                                    recipe.included ? "Exclude" : "Include"
					                                } recipe ${recipe.recipe.name}`}>
					                                    <ReactTooltip id={`mm-checkbox-tt-R${recipe.recipe.id}`} place="top" />
					                                    <input
					                                        type="checkbox"
					                                        checked={recipe.included}
					                                        onChange={() => handleRecipeToggle(recipe.id)}
					                                    />
					                                </td>
					                                <td>{recipe.recipe.name}</td>
					                                <td>{(recipe.recipe.price / 100).toFixed(2)}</td>
					                            </tr>
					                        ))}
					                    </tbody>

                </table>
            </div>
            <div className='menu-section mt-4'>
                <h3>Items</h3>
                <table className='table table-bordered'>
                    <thead>
                        <tr>
                            <th>Select</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                        </tr>
                    </thead>
					<tbody>
					                        {filteredItems.map(item => (
					                            <tr key={`I${item.id}`}>
					                                <td data-tooltip-id={`mm-checkbox-tt-I${item.item.id}`} data-tooltip-content={`${
					                                    item.included ? "Exclude" : "Include"
					                                } item ${item.item.name}`}>
					                                    <ReactTooltip id={`mm-checkbox-tt-I${item.item.id}`} place="top" />
					                                    <input
					                                        type="checkbox"
					                                        checked={item.included}
					                                        onChange={() => handleItemToggle(item.id)}
					                                    />
					                                </td>
					                                <td>{item.item.name}</td>
					                                <td>{item.item.description}</td>
					                                <td>{item.item.price.toFixed(2)}</td>
					                            </tr>
					                        ))}
					                    </tbody>

                </table>
            </div>
        </div>
    );
};

export default ManageMenuComponent;
