//neccessary imports
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAdminUser } from '../services/AuthService'
import { getAllItems, deleteItemById } from '../services/ItemService'
import {Tooltip as ReactTooltip} from 'react-tooltip';

//component for listing all the items in the system 
const ListItemsComponent = () => {
	
	const [items, setItems] = useState([]) //storing the item object
	const [errors, setErrors] = useState({general: ""})
	const navigate = useNavigate()

	const isAdmin = isAdminUser() //used to determine if the user is admin
	
	//fetches the list of items 
	useEffect(() => {
	    listItems()
	}, [])
	//function to fetch all the items using backend 
	function listItems() {
	    getAllItems().then((response) => {
	        setItems(response.data)
	    }).catch(error => {
	        console.error(error)
	    })
	}
	//navigate to the page for adding an item
	function addNewItem() {
		navigate('/add-item')
	}
	//nagivate to the page for updating an item
	function updateItem(id) {
		console.log(id)
		navigate(`/update-item/${id}`)
	}
	//function for deleteing an item by its ID
	function deleteItem(id) {
		console.log(id)
		deleteItemById(id).then((response) => {
			listItems()
		}).catch(error => {
			const errorsCopy = {...errors}
			errorsCopy.general = error.response.data
			console.error(error)
			setErrors(errorsCopy)
		})
	}

	// Function that returns any errors found in a HTML friendly format
    function getGeneralErrors() {
        if (errors.general) {
            return <div className="p-3 mb-2 bg-danger text-white">{errors.general}</div>;
        }
    }

	//render the list of items 
	return (
		<div className='container'>
			<br /> <br />
		    <h2 className='text-center'>Items</h2>
			{getGeneralErrors()}
			<h8>Items should be set up before accepting any orders for the day. You cannot modify/delete items once they are in an order.<br></br></h8>
			{
				
				<button className='btn btn-primary mb-2' onClick={addNewItem}>Add Item</button>
			}
			<div>
				<table className='table table-bordered table-striped'>
					<thead>
						<tr>
							<th>Item Name</th>
							<th>Description</th>
							<th>Price</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{
							items.map((item) =>
								<tr key={item.id}>
									<td>{item.name}</td>
									<td>{item.description}</td>
									<td>{item.price}</td>
									<td>
										{
											<button className='btn btn-info' onClick={() => updateItem(item.id) } data-tooltip-id={`update-tt-${item.id}`}  data-tooltip-content={`Update item ${item.name}`}>
											<ReactTooltip id={`update-tt-${item.id}`} place="top"/>
											Update
											</button>
										    
										}
										{
											<button className='btn btn-danger' onClick={() => deleteItem(item.id) } style={{marginLeft: "10px"} } data-tooltip-id={`delete-tt-${item.id}`}  data-tooltip-content={`Delete item ${item.name}`}>
											<ReactTooltip id={`delete-tt-${item.id}`} place="top"/>
											Delete
											</button>
										}
									</td>
								</tr>
							)
						}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default ListItemsComponent