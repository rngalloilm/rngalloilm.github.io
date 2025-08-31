// Necessary imports
import React, { useEffect, useState } from 'react';
import { getPendingOrders, createOrder, deleteOrder, fulfillOrder } from '../services/OrdersService'; 
import { getAllLocations } from '../services/LocationService';
import { listRecipes } from '../services/RecipesService';
import { getAllItems } from '../services/ItemService';
import { getLocationId } from '../services/AuthService';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const OrdersComponent = () => {
    const [orders, setOrders] = useState([]); // Store information about orders in the system
    // Store details about the new order, including email
    const [newOrder, setNewOrder] = useState({
        userId: null,
        email: '', // Added email field
        orderedItems: [],
        orderedRecipes: [],
        status: 'Pending',
        tipRate: null
    });
    // Stores information about the location
    const [location, setLocation] = useState({ id: null, name: '', address: '', taxRate: 0 });
    const [availableItems, setAvailableItems] = useState([]); // Store information about the available items 
    const [availableRecipes, setAvailableRecipes] = useState([]); // Store information about the available recipes
    const [orderedItems, setOrderedItems] = useState([]); // Stores the items ordered
    const [orderedRecipes, setOrderedRecipes] = useState([]);  // Stores the recipes ordered
    const [allLocations, setAllLocations] = useState([]); // Stores all the locations in the system
    const [successMessage, setSuccessMessage] = useState(''); // Stores the success messages
    const [errors, setErrors] = useState({ general: '' }); // Stores the error messages

    const currentLocationId = getLocationId();
    // Fetches all locations, items, and recipes
    useEffect(() => {
        fetchAllLocations();
        fetchAvailableItems();
        fetchAvailableRecipes();
    }, []);
    // Fetches the location details and the pending orders at the selected location
    useEffect(() => {
        if (currentLocationId) {
            const selectedLocation = allLocations.find(loc => loc.id === currentLocationId);
            if (selectedLocation) setLocation(selectedLocation);
            fetchPendingOrders(currentLocationId);
        }
    }, [currentLocationId, allLocations]);
    // Fetches the items available
    const fetchAvailableItems = async () => {
        try {
            const response = await getAllItems();
            setAvailableItems(response.data);
        } catch (error) {
            setErrors({ general: 'Failed to load items. ' + error.message });
        }
    };
    // Fetches the recipes available
    const fetchAvailableRecipes = async () => {
        try {
            const response = await listRecipes();
            setAvailableRecipes(response.data);
        } catch (error) {
            setErrors({ general: 'Failed to load recipes. ' + error.message });
        }
    };
    // Fetches the pending orders at the selected location
    const fetchPendingOrders = async (locationId) => {
        try {
            const response = await getPendingOrders(locationId);
            setOrders(response.data);
        } catch (error) {
            setErrors({ general: error.message });
        }
    };
    // Fetches all the locations in the system
    const fetchAllLocations = async () => {
        try {
            const response = await getAllLocations();
            setAllLocations(response.data);
            if (response.data.length > 0 && currentLocationId) {
                const selectedLocation = response.data.find(loc => loc.id === currentLocationId) || response.data[0];
                setLocation(selectedLocation);
            }
        } catch (error) {
            setErrors({ general: 'Failed to load location details. ' + error.message });
        }
    };
    // Function to fulfill an order
    const handleFulfillOrder = async (id) => {
        try {
            const response = await fulfillOrder(id);
            setOrders(orders.map(order => order.id === id ? response.data : order));
            setSuccessMessage('Order fulfilled successfully!');
        } catch (error) {
            setErrors({ general: error.message });
        }
    };
    // Function to delete an order
    const handleDeleteOrder = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this order?");
        if (!confirmDelete) return;

        try {
            await deleteOrder(id); 
            setOrders(orders.filter(order => order.id !== id));
            setSuccessMessage('Order deleted successfully!');
        } catch (error) {
            setErrors({ general: error.message });
        }
    };
    // Function to add an item to an order
    const handleAddItemToOrder = (itemId) => {
        const item = availableItems.find(i => i.id === parseInt(itemId, 10));
        if (item && !orderedItems.some(oi => oi.id === item.id)) {
            setOrderedItems([...orderedItems, { ...item, quantity: 1 }]);
        }
    };
    // Function to add a recipe to an order
    const handleAddRecipeToOrder = (recipeId) => {
        const recipe = availableRecipes.find(r => r.id === parseInt(recipeId, 10));
        if (recipe && !orderedRecipes.some(or => or.id === recipe.id)) {
            setOrderedRecipes([...orderedRecipes, { ...recipe, quantity: 1 }]);
        }
    };
    // Function to update the item quantity 
    const handleUpdateItemQuantity = (index, quantity) => {
        const updatedItems = [...orderedItems];
        updatedItems[index].quantity = parseInt(quantity, 10) || 1;
        setOrderedItems(updatedItems);
    };
    // Function to update the recipe quantity 
    const handleUpdateRecipeQuantity = (index, quantity) => {
        const updatedRecipes = [...orderedRecipes];
        updatedRecipes[index].quantity = parseInt(quantity, 10) || 1;
        setOrderedRecipes(updatedRecipes);
    };
    // Function to remove an item
    const handleRemoveItem = (index) => {
        setOrderedItems(orderedItems.filter((_, i) => i !== index));
    };
    // Function to remove a recipe 
    const handleRemoveRecipe = (index) => {
        setOrderedRecipes(orderedRecipes.filter((_, i) => i !== index));
    };
    // Function to create an order
    const handleCreateOrder = async (e) => {
        e.preventDefault();
        setErrors({ general: '' });

        if (orderedItems.length === 0 && orderedRecipes.length === 0) {
            setErrors({ general: 'Order must contain at least one item or recipe.' });
            return;
        }

        if (newOrder.tipRate == null) {
            setErrors({ general: 'Please select a tip rate.' });
            return;
        }
		
		if(newOrder.userId == null && (newOrder.email == null || newOrder.email == "")) {
			setErrors({general: 'Please include an email address when placing an anonymous orders'})
			return;
		}
        
        const formattedOrder = { 
            ...newOrder, 
            status: "Pending", 
            userId: newOrder.userId || null,
            email: newOrder.email || null, // Include email in the order data
            location: {
                id: location.id,
                name: location.name,
                address: location.address,
                taxRate: location.taxRate,
                menuId: location.menuId,
                inventoryId: location.inventoryId,
            },
            tipRate: newOrder.tipRate,
            orderedItems: [
                ...orderedItems.map(item => ({
                    item: { id: item.id },
                    quantity: item.quantity,
                })),
                ...orderedRecipes.map(recipe => ({
                    recipe: { id: recipe.id },
                    quantity: recipe.quantity,
                })),
            ],
        };

        try {
            const response = await createOrder(formattedOrder); 
            // Instead of adding response.data to orders, fetch the pending orders again
            await fetchPendingOrders(location.id);
            setSuccessMessage('Order created successfully!');
            // Reset newOrder, including email
            setNewOrder({ userId: null, email: '', orderedItems: [], orderedRecipes: [], status: 'Pending', tipRate: null });
            setOrderedItems([]);
            setOrderedRecipes([]);
        } catch (error) {
            setErrors({ general: error.message || 'Invalid Order Attempt' });
        }
    };
    // Function to calculate the total price of an order
    const calculateOrderTotalPrice = (order) => {
        let subtotalCents = 0;

        if (order.orderedItems) {
            order.orderedItems.forEach((orderItem) => {
                let priceCents = 0;
                if (orderItem.item) {
                    priceCents = orderItem.item.price * 100;
                } else if (orderItem.recipe) {
                    priceCents = orderItem.recipe.price;
                }
                console.log(subtotalCents)
                subtotalCents += priceCents * orderItem.quantity;
            });
        }

        const taxCents = subtotalCents * (order.location.taxRate || 0);
        const tipCents = subtotalCents * (order.tipRate || 0);
        const totalCents = subtotalCents + taxCents + tipCents;

        return (totalCents / 100).toFixed(2);
    };
    // Function to calculate the total price of the new order
    const calculateNewOrderTotalPrice = () => {
        let subtotalCents = 0;

        orderedItems.forEach((item) => {
            subtotalCents += item.price * item.quantity * 100;
        });

        orderedRecipes.forEach((recipe) => {
            subtotalCents += recipe.price * recipe.quantity;
        });

        const taxCents = subtotalCents * location.taxRate;
        const tipCents = subtotalCents * newOrder.tipRate;
        const totalCents = subtotalCents + taxCents + tipCents;

        return {
            subtotal: (subtotalCents / 100).toFixed(2),
            tax: (taxCents / 100).toFixed(2),
            tip: (tipCents / 100).toFixed(2),
            total: (totalCents / 100).toFixed(2),
        };
    };

    return (
        <div className="container mt-3">
            <h2 className="text-center">Pending Orders</h2>
            {errors.general && <div className="p-3 mb-2 bg-danger text-white">{errors.general}</div>}
            {successMessage && <div className="p-3 mb-2 bg-success text-white">{successMessage}</div>}
            <br />

            <div className="form-group mb-3">
                <label className="form-label">Select Location</label>
                <select
                    value={location.id || ""}
                    onChange={e => {
                        const selectedLocation = allLocations.find(
                            loc => loc.id === parseInt(e.target.value, 10)
                        );
                        setLocation(selectedLocation || {});
                    }}
                    className="form-control"
                >
                    <option value="" disabled>Select a location</option>
                    {allLocations.map(loc => (
                        <option key={loc.id} value={loc.id}>
                            {loc.name} 
                        </option>
                    ))}
                </select>
            </div>

            <form onSubmit={handleCreateOrder}>
			<div className="form-group mb-2">
			    <label className="form-label">Customer ID (Leave blank for anonymous)</label>
			    <input
			        type="text"
			        value={newOrder.userId || ''}
			        onChange={e => {
			            const value = parseInt(e.target.value);
			            setNewOrder({
			                ...newOrder,
			                userId: isNaN(value) ? null : value,
			                email: isNaN(value) ? newOrder.email : '', // Clear email if userId is set
			            });
			        }}
			        className="form-control"
			        disabled={!!newOrder.email} // Disable if email is set
			    />
			</div>
			<div className="form-group mb-2">
			    <label className="form-label">Customer Email (If ID is not specified)</label>
			    <input
			        type="email"
			        value={newOrder.email}
			        onChange={e =>
			            setNewOrder({
			                ...newOrder,
			                email: e.target.value,
			                userId: e.target.value ? null : newOrder.userId, // Clear userId if email is set
			            })
			        }
			        className="form-control"
			        disabled={!!newOrder.userId} // Disable if userId is set
			    />
			</div>
                {/* Rest of order information */}
                <div className="form-group mb-2">
                    <label className="form-label">Select Item</label>
                    <select 
                        className="form-control"
                        onChange={(e) => handleAddItemToOrder(e.target.value)}
                        defaultValue=""
                    >
                        <option value="" disabled>Select an item</option>
                        {availableItems.map(item => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group mb-2">
                    <label className="form-label">Select Recipe</label>
                    <select 
                        className="form-control"
                        onChange={(e) => handleAddRecipeToOrder(e.target.value)}
                        defaultValue=""
                    >
                        <option value="" disabled>Select a recipe</option>
                        {availableRecipes.map(recipe => (
                            <option key={recipe.id} value={recipe.id}>{recipe.name}</option>
                        ))}
                    </select>
                </div>

          <div className="form-group mb-2">
				  <label className="form-label">Ordered Items</label>
				  {orderedItems.map((item, index) => (
				    <div key={item.id} className="d-flex align-items-center mb-2">
				      <span className="me-2">{item.name}</span>
				      <input
				        type="number"
				        value={item.quantity}
				        onChange={(e) => handleUpdateItemQuantity(index, e.target.value)}
				        min="1"
				        className="form-control me-2"
				        style={{ width: "80px" }}
				      />
				      <button 
				        type="button" 
				        className="btn btn-danger" 
				        onClick={() => handleRemoveItem(index)}
				        data-tooltip-id={`remove-item-tooltip-${item.id}`}  // Unique tooltip ID for each item
				        data-tooltip-content="Remove this item from your order"  // Tooltip content
				      >
				        Remove
				      </button>
				      {/* Tooltip */}
				      <ReactTooltip id={`remove-item-tooltip-${item.id}`} place="top" />
				    </div>
				  ))}
				</div>
				<div className="form-group mb-2">
				  <label className="form-label">Ordered Recipes</label>
				  {orderedRecipes.map((recipe, index) => (
				    <div key={recipe.id} className="d-flex align-items-center mb-2">
				      <span className="me-2">{recipe.name}</span>
				      <input
				        type="number"
				        value={recipe.quantity}
				        onChange={(e) => handleUpdateRecipeQuantity(index, e.target.value)}
				        min="1"
				        className="form-control me-2"
				        style={{ width: "80px" }}
				      />
				      <button 
				        type="button" 
				        className="btn btn-danger" 
				        onClick={() => handleRemoveRecipe(index)}
				        data-tooltip-id={`remove-recipe-tooltip-${recipe.id}`}  // Unique tooltip ID for each recipe
				        data-tooltip-content="Remove this recipe from your order"  // Tooltip content
				      >
				        Remove
				      </button>
				      {/* Tooltip */}
				      <ReactTooltip id={`remove-recipe-tooltip-${recipe.id}`} place="top" />
				    </div>
				  ))}
				</div>


                <div className="form-group mb-2">
                    <label className="form-label">Select Tip Rate</label>
                    <div>
                        <button
                            type="button"
                            className={`btn ${newOrder.tipRate === 0.15 ? 'btn-primary' : 'btn-secondary'} me-2`}
                            onClick={() => setNewOrder({ ...newOrder, tipRate: 0.15 })}
                        >
                            15%
                        </button>
                        <button
                            type="button"
                            className={`btn ${newOrder.tipRate === 0.2 ? 'btn-primary' : 'btn-secondary'} me-2`}
                            onClick={() => setNewOrder({ ...newOrder, tipRate: 0.2 })}
                        >
                            20%
                        </button>
                        <button
                            type="button"
                            className={`btn ${newOrder.tipRate === 0.25 ? 'btn-primary' : 'btn-secondary'} me-2`}
                            onClick={() => setNewOrder({ ...newOrder, tipRate: 0.25 })}
                        >
                            25%
                        </button>
                    </div>
                    <div className="mt-2">
                        <label className="form-label me-2">Custom Tip Rate (%):</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={
                                newOrder.tipRate && ![0.15, 0.2, 0.25].includes(newOrder.tipRate)
                                    ? newOrder.tipRate * 100
                                    : ''
                            }
                            onChange={(e) => {
                                const value = parseFloat(e.target.value) / 100;
                                if (!isNaN(value)) {
                                    setNewOrder({ ...newOrder, tipRate: value });
                                } else {
                                    setNewOrder({ ...newOrder, tipRate: null });
                                }
                            }}
                            className="form-control"
                            style={{ width: '100px', display: 'inline-block' }}
                        />
                    </div>
                </div>

                {(orderedItems.length > 0 || orderedRecipes.length > 0) && newOrder.tipRate != null && (
                    <div className="mt-3">
                        <h5>Order Summary</h5>
                        <p>Subtotal: ${calculateNewOrderTotalPrice().subtotal}</p>
                        <p>
                            Tax ({(location.taxRate * 100).toFixed(2)}%): ${calculateNewOrderTotalPrice().tax}
                        </p>
                        <p>
                            Tip ({(newOrder.tipRate * 100).toFixed(2)}%): ${calculateNewOrderTotalPrice().tip}
                        </p>
                        <h5>Total: ${calculateNewOrderTotalPrice().total}</h5>
                    </div>
                )}

                <button type="submit" className="btn btn-primary">Add Order</button>
            </form>
            <br />

            {/* Pending Orders View (Unchanged from your old class) */}
            <div className="row">
                {orders && orders.length > 0 ? (
                    orders.map(order => (
                        <div className="col-md-4 mb-3" key={order.id}>
                            <div className="card bg-light">
                                <div className="card-body">
                                    <h5 className="card-title">Order ID: {order.id}</h5>
                                    <p className="card-text">
                                        <strong>Customer ID:</strong> {order.userId || 'Anonymous'}<br />
                                        {/* You can include email here if desired */}
                                        {/* <strong>Customer Email:</strong> {order.email || 'N/A'}<br /> */}
                                        <strong>Items:</strong> 
                                        {order.orderedItems && order.orderedItems.length > 0 ? (
                                            order.orderedItems
                                                .filter(item => item.item !== null).map(item => (
                                                    <span key={item.id}>Item {item.item.name} (x{item.quantity}), </span>
                                                ))
                                        ) : (
                                            <span>No items</span>
                                        )}
                                        <br />
                                        <strong>Recipes:</strong> 
                                        {order.orderedItems && order.orderedItems.length > 0 ? (
                                            order.orderedItems.filter(recipe => recipe.recipe != null).map(recipe => (
                                                <span key={recipe.id}>Recipe {recipe.recipe.name} (x{recipe.quantity}), </span>
                                            ))
                                        ) : (
                                            <span>No recipes</span>
                                        )}
                                        <br />
                                        <strong>Status:</strong> {order.status}<br />
                                        <strong>Location:</strong> {order.location.name} - {order.location.address}<br />
                                        <strong>Total Price:</strong> ${calculateOrderTotalPrice(order)}
                                    </p>
                                    <button
                                        className="btn btn-success"
                                        onClick={() => handleFulfillOrder(order.id)}
                                        disabled={order.status === 'COMPLETED'}
                                    >
                                        Fulfill Order
                                    </button>
                                    <button className="btn btn-danger" onClick={() => handleDeleteOrder(order.id)}>
                                        Delete Order
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No pending orders available.</p>
                )}
            </div>
        </div>
    );
};

export default OrdersComponent;
