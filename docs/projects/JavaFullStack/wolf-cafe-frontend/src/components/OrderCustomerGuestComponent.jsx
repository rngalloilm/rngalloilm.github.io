// Necessary imports
import React, { useEffect, useState } from 'react';
import { createOrder } from '../services/OrdersService';
import { getAllLocations } from '../services/LocationService';
import { getMenu } from '../services/MenuService';
import { Tooltip as ReactTooltip } from 'react-tooltip';

//the order component for a guest customer(a customer that is not signed in)
const OrderCustomerGuestComponent = () => {
  const [newOrder, setNewOrder] = useState({
    email: '',
    orderedItems: [],
    orderedRecipes: [],
    status: 'Pending',
    tipRate: null,
  }); // Stores the order details
  const [location, setLocation] = useState({ id: 1, name: '', address: '', taxRate: 0 }); // Stores the selected location
  const [availableItems, setAvailableItems] = useState([]); // State to store available items
  const [availableRecipes, setAvailableRecipes] = useState([]); // State to store available recipes
  const [orderedItems, setOrderedItems] = useState([]); // State to store ordered items
  const [orderedRecipes, setOrderedRecipes] = useState([]); // State to store ordered recipes
  const [allLocations, setAllLocations] = useState([]); // State to store list of locations in the system
  const [successMessage, setSuccessMessage] = useState(''); // State to store success messages
  const [errors, setErrors] = useState({ general: '' }); // State to store error messages

  // Fetches all the locations
  useEffect(() => {
    fetchAllLocations();
  }, []);

  // Fetches the menu for the selected location
  useEffect(() => {
    if (location.id) {
      setOrderedItems([]); // Reset ordered items
      setOrderedRecipes([]); // Reset ordered recipes
      fetchMenuForLocation(location.id);
    }
  }, [location.id]);

  // Fetches all the available locations
  const fetchAllLocations = async () => {
    try {
      const response = await getAllLocations();
      setAllLocations(response.data);
      if (response.data.length > 0) {
        setLocation(response.data[0]); // Set the default location
      }
    } catch (error) {
      setErrors({ general: 'Failed to load location details. ' + error.message });
    }
  };

  // Fetches the menu for a specific location
  const fetchMenuForLocation = async (locationId) => {
    try {
      const response = await getMenu(locationId);
      const { recipeList, itemList } = response.data;

      const includedRecipes = recipeList
        .filter((entry) => entry.included)
        .map((entry) => ({
          id: entry.recipe.id,
          name: entry.recipe.name,
          price: entry.recipe.price, // price in cents
          ingredients: entry.recipe.ingredients,
        }));

      const includedItems = itemList
        .filter((entry) => entry.included)
        .map((entry) => ({
          id: entry.item.id,
          name: entry.item.name,
          description: entry.item.description,
          price: entry.item.price, // price in cents
        }));

      setAvailableRecipes(includedRecipes);
      setAvailableItems(includedItems);
    } catch (error) {
      setErrors({ general: 'Failed to load menu. ' + error.message });
    }
  };

  // Function to add an item
  const handleAddItemToOrder = (itemId) => {
    const item = availableItems.find((i) => i.id === itemId);
    if (item && !orderedItems.some((oi) => oi.id === item.id)) {
      setOrderedItems([...orderedItems, { ...item, quantity: 1 }]);
    }
  };

  // Function to add a recipe to an order
  const handleAddRecipeToOrder = (recipeId) => {
    const recipe = availableRecipes.find((r) => r.id === recipeId);
    if (recipe && !orderedRecipes.some((or) => or.id === recipe.id)) {
      setOrderedRecipes([...orderedRecipes, { ...recipe, quantity: 1 }]);
    }
  };

  // Function to update the quantity of items
  const handleUpdateItemQuantity = (index, quantity) => {
    const updatedItems = [...orderedItems];
    updatedItems[index].quantity = parseInt(quantity, 10) || 1;
    setOrderedItems(updatedItems);
  };

  // Function to update the quantity of a recipe
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

    if (!newOrder.email) {
      setErrors({ general: 'Email is required for guest orders.' });
      return;
    }

    if (orderedItems.length === 0 && orderedRecipes.length === 0) {
      setErrors({ general: 'Order must contain at least one item or recipe.' });
      return;
    }

    if (newOrder.tipRate == null || newOrder.tipRate < 0) {
      setErrors({ general: 'Tip rate cannot be negative.' });
      return;
    }

    const formattedOrder = {
      ...newOrder,
      status: 'Pending',
      location: {
        id: location.id,
        name: location.name,
        address: location.address,
        taxRate: location.taxRate,
      },
      tipRate: newOrder.tipRate,
      orderedItems: [
        ...orderedItems.map((item) => ({
          item: { id: item.id },
          quantity: item.quantity,
        })),
        ...orderedRecipes.map((recipe) => ({
          recipe: { id: recipe.id },
          quantity: recipe.quantity,
        })),
      ],
    };

    try {
      let sentorder = await createOrder(formattedOrder);
      setSuccessMessage(
        'Order created successfully! You should receive an email regarding your order. Your Order ID is ' +
          sentorder.data.id,
      );
      setNewOrder({
        email: '',
        orderedItems: [],
        orderedRecipes: [],
        status: 'Pending',
        tipRate: null,
      });
      setOrderedItems([]);
      setOrderedRecipes([]);
    } catch (error) {
      setErrors({ general: error.response?.data?.message || error.message });
    }
  };

  // Function to calculate the total price of an order
  const calculateTotalPrice = () => {
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

  // Render the component
  return (
    <div className="container mt-3">
      <h2 className="text-center">Create an Order</h2>
      {errors.general && (
        <div className="p-3 mb-2 bg-danger text-white">{errors.general}</div>
      )}
      {successMessage && (
        <div className="p-3 mb-2 bg-success text-white">{successMessage}</div>
      )}
      <br />

      <div className="form-group mb-3">
        <label className="form-label">Select Location</label>
        <select
          value={location.id || ''}
          onChange={(e) =>
            setLocation(
              allLocations.find((loc) => loc.id === parseInt(e.target.value, 10)) || {},
            )
          }
          className="form-control"
		  data-tooltip-id="location-tooltip"
		  data-tooltip-content="Select a location for your order"
        >
          <option value="" disabled>
            Select a location
          </option>
          {allLocations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleCreateOrder}>
        <div className="form-group mb-2">
          <label className="form-label">Your Email</label>
          <input
            type="email"
            value={newOrder.email}
            onChange={(e) => {
              setNewOrder({ ...newOrder, email: e.target.value });
              if (e.target.value) {
                setErrors({ ...errors, general: '' }); // Clear the error if email is entered
              }
            }}
            onBlur={(e) => {
              if (!e.target.value) {
                setErrors({ ...errors, general: 'Email is required for guest orders.' });
              }
            }}
            className="form-control"
            required
          />
        </div>

        {/* Available Items Table */}
        <div className="form-group mb-2">
          <label className="form-label">Available Items</label>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Add to Order</th>
              </tr>
            </thead>
            <tbody>
              {availableItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleAddItemToOrder(item.id)}
                    >
                      Add to Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Available Recipes Table */}
        <div className="form-group mb-2">
          <label className="form-label">Available Recipes</label>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Add to Order</th>
              </tr>
            </thead>
            <tbody>
              {availableRecipes.map((recipe) => (
                <tr key={recipe.id}>
                  <td>{recipe.name}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleAddRecipeToOrder(recipe.id)}
                    >
                      Add to Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Ordered Items */}
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
                style={{ width: '80px' }}
              />
              <button
		        type="button"
		        className="btn btn-danger"
		        onClick={() => handleRemoveItem(index)}
		        data-tooltip-id={`remove-item-tooltip-${item.id}`}
		        data-tooltip-content="Remove this item from your order"
		      >
                Remove
              </button>
              <ReactTooltip id={`remove-item-tooltip-${item.id}`} place="top" />
            </div>
          ))}
        </div>

        {/* Ordered Recipes */}
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
                style={{ width: '80px' }}
              />
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleRemoveRecipe(index)}
                data-tooltip-id={`remove-recipe-tooltip-${recipe.id}`}
		            data-tooltip-content="Remove this recipe from your order"
              >
                Remove
              </button>
              <ReactTooltip id={`remove-recipe-tooltip-${recipe.id}`} place="top" />
            </div>
          ))}
        </div>


        {/* Tip Rate Selection */}
        <div className="form-group mb-2">
          <label className="form-label">Select Tip Rate</label>
          <div>
            <button
              type="button"
              className={`btn ${
                newOrder.tipRate === 0.15 ? 'btn-primary' : 'btn-secondary'
              } me-2`}
              onClick={() => setNewOrder({ ...newOrder, tipRate: 0.15 })}
            >
              15%
            </button>
            <button
              type="button"
              className={`btn ${
                newOrder.tipRate === 0.2 ? 'btn-primary' : 'btn-secondary'
              } me-2`}
              onClick={() => setNewOrder({ ...newOrder, tipRate: 0.2 })}
            >
              20%
            </button>
            <button
              type="button"
              className={`btn ${
                newOrder.tipRate === 0.25 ? 'btn-primary' : 'btn-secondary'
              } me-2`}
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

        {/* Order Summary */}
        {(orderedItems.length > 0 || orderedRecipes.length > 0) && (
          <>
            {newOrder.tipRate != null && newOrder.tipRate >= 0 ? (
              <div className="mt-3">
                <h5>Order Summary</h5>
                <p>Subtotal: ${calculateTotalPrice().subtotal}</p>
                <p>
                  Tax ({(location.taxRate * 100).toFixed(2)}%): $
                  {calculateTotalPrice().tax}
                </p>
                <p>
                  Tip ({(newOrder.tipRate * 100).toFixed(2)}%): $
                  {calculateTotalPrice().tip}
                </p>
                <h5>Total: ${calculateTotalPrice().total}</h5>
              </div>
            ) : (
              <div className="mt-3">
                <p>Please ensure tip rate is not negative.</p>
              </div>
            )}
          </>
        )}

        <button type="submit" className="btn btn-primary">
          Create Order
        </button>
      </form>
    </div>
  );
};

export default OrderCustomerGuestComponent;
