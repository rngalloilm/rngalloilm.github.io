//neccessayr imports 
import React, { useEffect, useState } from 'react'
import { getItemById, saveItem, updateItem } from '../services/ItemService' 
import { useNavigate, useParams } from 'react-router-dom'
import { getLocationId } from '../services/AuthService'

const TodoComponent = () => {
	//compoent for itemes
    const [name, setName] = useState('') //storing the name of the items 
    const [description, setDescription] = useState('') //storing the description of the item
    const [price, setPrice] = useState('') //storing the price of the item 
	const [amount, setAmount] = useState('') //store the amount of initial inventory
    const [errors, setErrors] = useState({}) //storing the error messages 
    const [general, setGeneral] = useState('')
    const { id } = useParams() 
	
	const locationId = parseInt(getLocationId());

    const navigate = useNavigate()
//using the id to identify the item and used for updating the item 
    useEffect(() => {
        if (id) {
            getItemById(id).then((response) => {
                console.log(response.data)
                setName(response.data.name)
                setDescription(response.data.description)
                setPrice(response.data.price)
            }).catch(error => {
                console.error(error)
            })
        }
    }, [id])
// error checking, making all the feilds for the item is valid
    function validateFields() {
        const newErrors = {}
        const stringPrice = parseFloat
        if (!name.trim()) newErrors.name = "Name is required."
        if (!description.trim()) newErrors.description = "Description is required."
        if ( parseFloat(price) <= 0 || isNaN(price) || price.length == 0 || price.indexOf('.') == -1 || price.slice(-3, -2) != '.') newErrors.price = "Price must be in form P.XX"
        if ( !id && (parseFloat(amount) < 0 || isNaN(amount) || amount.length == 0)) newErrors.amount = "Amount must be valid integer."
        return newErrors
    }

//function for saving or updating the item in the system based on id 
    function saveOrUpdateItem(e) {
        
        e.preventDefault()
        const newErrors = validateFields()
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            console.log(newErrors)
            return
        }
        
        const itemDto = { name, description, price: parseFloat(price) }
		const itemCreation = {itemDto, initialAmount: parseInt(amount), locationId}
        console.log(itemDto)
        if (id) {
            updateItem(id, itemDto).then((response) => {
                console.log(response.data)
                navigate('/items')
            }).catch(error => {
                console.error(error)
                setGeneral(error.response.data)
            })
        } else {
            saveItem(itemCreation).then((response) => {
                console.log(response.data)
                navigate('/items')
            }).catch(error => {
                console.log(error)
                if(error.response){
                    if(error.response.data){
                        setGeneral(error.response.data)
                    }
                }
                
            })
        }
    }
//function to dispaly the title based on the id of an item 
    function pageTitle() {
        if (id) {
            return <h2 className='text-center'>Update Item</h2>
        } else {
            return <h2 className='text-center'>Add Item</h2>
        }
    }

    function getGeneralErrors() {
        if (general) {
            return <div className="p-3 mb-2 bg-danger text-white">{general}</div>;
        }
    }
//render the form for adding or updating an item 
    return (
        <div className='container'>
            <br /> <br />
            <div className='row'>
                <div className='card col-md-6 offset-md-3 offset-md-3'>
                    {pageTitle()}
                    {getGeneralErrors()}
                    <div className='card-body'>
                        <form>
                            <div className='form-group mb-2'>
                                <label className='form-label'>Item Name:</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    placeholder='Enter Item Name'
                                    name='name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                {errors.name && <p className='text-danger'>{errors.name}</p>}
                            </div>

                            <div className='form-group mb-2'>
                                <label className='form-label'>Item Description:</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    placeholder='Enter Item Description'
                                    name='description'
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                {errors.description && <p className='text-danger'>{errors.description}</p>}
                            </div>

                            <div className='form-group mb-2'>
                                <label className='form-label'>Item Price:</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    placeholder='Enter Item Price (as P.XX)'
                                    name='price'
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                                {errors.price && <p className='text-danger'>{errors.price}</p>}
                            </div>
							{!id &&
							<div className="form-group mb-2">
							    <label className="form-label">Amount</label>
							     <input type="text" name="amount" placeholder="Enter Amount (as an integer)"
							           value={amount} onChange={(e) => setAmount(e.target.value)}
							           className={`form-control ${errors.amount ? "is-invalid" : ""}`}>
							      </input> {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
							       </div>}

                            <button type='submit' className='btn btn-success' onClick={(e) => saveOrUpdateItem(e)}>Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TodoComponent
