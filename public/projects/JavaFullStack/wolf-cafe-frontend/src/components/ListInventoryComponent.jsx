import React, { useEffect, useState } from 'react'
import { getInventory } from '../services/InventoryService.js'
import { useNavigate } from 'react-router-dom'


const ListInventoryComponent = () => {
	/** where we store the inventory items data  */
    const [inventoryItems, setInventoryItems] = useState([])

    const navigator = useNavigate();
	/** get the inventory data  */
    useEffect(() => {
        fetchAllInventory()
    }, [])

   /**
	* gets all the items in the inventory
    */
    function fetchAllInventory() {
        getInventory().then((response) => {
            setInventoryItems(response.data.items) 
        }).catch(error => {
            console.error(error)
        })
    }



	/**
	 * adds a new inventory item
	 * @returns the appopriate display to reflects the add inventory action
	 */
    function addNewInventoryItem() {
        navigator('/add-inventory')
    }

    return (
        <div className="container mt-3">
            <h2 className="text-center">List of Inventory Items</h2>
            <button className="btn btn-primary mb-2" onClick={ addNewInventoryItem }>Add Inventory Item</button>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Ingredient Name</th>
                        <th>Amount</th>
                        
                    </tr>
                </thead>
                <tbody>
                    {
                        inventoryItems.map(item =>
                        <tr key={item.id}>
                            <td>{item.ingredient.name}</td> {}
                            <td>{item.amount}</td>
                            
                        </tr>)
                    }
                </tbody>
            </table>
        </div>
    )
}

export default ListInventoryComponent;
