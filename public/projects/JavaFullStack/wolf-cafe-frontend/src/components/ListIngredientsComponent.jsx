import React, { useEffect, useState } from 'react'
import { getIngredients, removeIngredient } from '../services/IngredientService.js'
import { useNavigate } from 'react-router-dom'
import {Tooltip as ReactTooltip} from 'react-tooltip';

/** Lists all the recipes and provide the option to create a new recipe
 * and delete an existing recipe.
 */
const ListIngredientsComponent = () => {
	/** where we store the recipes data */
    const [recipes, setIngredients] = useState([])

    const navigator = useNavigate();

    useEffect(() => {
        getAllIngredients()
    }, [])
	/**
	 * dispaly the ingredient in the system 
	 */
    function getAllIngredients() {
        getIngredients().then((response) => {
            setIngredients(response.data)
        }).catch(error => {
            console.error(error)
        })
    }
	/**
	 * removes the ingreddient from the system 
	 * @param id of the ingredient being removed 
	 */
    function removeIngredientCallback(id) {
        removeIngredient(id).then((response) => {
            console.log(`Got response ${response.data}`)
            getAllIngredients();
        }).catch(error => {
            alert(`${error.response.data.error}`);
        })
    }
	/**
	 * adds new Ingredeint to system 
	 * @returns the appropriate dispaly to reflect the user actions related to ingredient 
	 */
    function addNewIngredient() {
        navigator('/add-ingredient')
    }

    return (
        <div className="container mt-3">
            <h2 className="text-center">List of Ingredients</h2>
            <button className="btn btn-primary mb-2" onClick={ addNewIngredient }>Add Ingredient</button>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Ingredient Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        recipes.map(ingredient =>
                        <tr key={ingredient.id}>
                            <td>{ingredient.name}</td>
                            <td>
                                <button className="btn btn-danger" onClick={() => removeIngredientCallback(ingredient.id)}
                                    style={{marginLeft: '10px'}} 								data-tooltip-id={`delete-tt-${ingredient.id}`}  data-tooltip-content={`Delete ingredient ${ingredient.name}`}>
								<ReactTooltip id={`delete-tt-${ingredient.id}`} place="top"/>
                                Delete</button>
                            </td>
                        </tr>)
                    }
                </tbody>
            </table>
        </div>
    )

}

export default ListIngredientsComponent
