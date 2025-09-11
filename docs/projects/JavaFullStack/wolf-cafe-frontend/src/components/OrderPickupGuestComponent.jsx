import React, { useState } from 'react';
import { getActiveOrder, completeOrder } from '../services/OrdersService';

// THIS WAS GENERATED WITH AI
// Model: ChatGPT 01-Preview
// Prompt: 	I made a copy of OrderPickupComponent called 
//			OrderPickupGuestComponent. The difference is that the users who
//			place the orders here are not logged in and are using the app as
//			guests. Is it possible to pull their orders from another component? I
// 			supplied a component that displays some order functionality.
//			''' OrdersComponent code '''
//			''' OrderPickupComponent code '''

//the pick up order component for a customer not signed in 
const OrderPickupGuestComponent = () => {
    const [orderId, setOrderId] = useState('');
    const [email, setEmail] = useState('');
    const [order, setOrder] = useState(null);
    const [errors, setErrors] = useState({ general: '' });
    const [successMessage, setSuccessMessage] = useState('');


	//function to fetch order details based on order id
    const handleFetchOrder = async () => {
        setErrors({ general: '' });
        setSuccessMessage('');
        try {
            // Pass both orderId and email to fetch the order
            const response = await getActiveOrder(orderId, email);
            const fetchedOrder = response.data;

            if (fetchedOrder.userId) {
                setErrors({ general: 'This order belongs to a registered user. You are not authorized to view it.' });
                setOrder(null);
                return;
            }

            setOrder(fetchedOrder);
        } catch (error) {
            setErrors({ general: error.response?.data?.message || 'Order not found. Please check the order ID and email.' });
            setOrder(null);
        }
    };
	//function to pick up order 
    const handlePickupOrder = async () => {
        setErrors({ general: '' });
        setSuccessMessage('');
        try {
            if (order.userId) {
                setErrors({ general: 'This order belongs to a registered user. You are not authorized to pick it up.' });
                return;
            }
            await completeOrder(order.id);
            setOrder(null);
            setSuccessMessage('Order picked up successfully!');
        } catch (error) {
            setErrors({ general: error.response?.data?.message || 'Failed to pick up order. Please try again.' });
        }
    };
	//function to calcualte the total price of an order
    const calculateOrderTotalPrice = (order) => {
        let subtotalCents = 0;

        if (order.orderedItems) {
            order.orderedItems.forEach((orderItem) => {
                let priceCents = 0;
                if (orderItem.item) {
                    priceCents = orderItem.item.price * 100; // price in cents
                } else if (orderItem.recipe) {
                    priceCents = orderItem.recipe.price; // price in cents
                }
                subtotalCents += priceCents * orderItem.quantity;
            });
        }

        const taxCents = subtotalCents * (order.location.taxRate || 0);
        const tipCents = subtotalCents * (order.tipRate || 0);
        const totalCents = subtotalCents + taxCents + tipCents;

        return (totalCents / 100).toFixed(2);
    };

    return (
        <div className="container mt-3">
            <h2 className="text-center">Guest Order Pickup</h2>
            {errors.general && (
                <div className="p-3 mb-2 bg-danger text-white">{errors.general}</div>
            )}
            {successMessage && (
                <div className="p-3 mb-2 bg-success text-white">{successMessage}</div>
            )}

            {/* Order ID Input */}
            <div className="form-group mb-3">
                <label htmlFor="orderId" className="form-label">Enter Order ID</label>
                <input
                    type="text"
                    id="orderId"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="form-control"
                    placeholder="Order ID"
                />
            </div>

            {/* Email Input */}
            <div className="form-group mb-3">
                <label htmlFor="email" className="form-label">Enter Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    placeholder="Email associated with the order"
                />
            </div>

            <button className="btn btn-primary mt-2" onClick={handleFetchOrder}>
                Fetch Order
            </button>

            {/* Display Order Details */}
            {order ? (
                <div className="order-details mt-4">
                    <h3>Order Details</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Items</th>
                                <th>Recipes</th>
                                <th>Status</th>
                                <th>Total Price</th>
                                <th>Pickup</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{order.id}</td>
                                <td>
                                    {order.orderedItems &&
                                        order.orderedItems.map((orderItem) =>
                                            orderItem.item ? (
                                                <div key={orderItem.id}>
                                                    {orderItem.item.name} (x{orderItem.quantity})
                                                </div>
                                            ) : null
                                        )}
                                </td>
                                <td>
                                    {order.orderedItems &&
                                        order.orderedItems.map((orderItem) =>
                                            orderItem.recipe ? (
                                                <div key={orderItem.id}>
                                                    {orderItem.recipe.name} (x{orderItem.quantity})
                                                </div>
                                            ) : null
                                        )}
                                </td>
                                <td>{order.status}</td>
                                <td>${calculateOrderTotalPrice(order)}</td>
                                <td>
                                    {order.status === 'READY_FOR_PICKUP' && (
                                        <button
                                            className="btn btn-primary"
                                            onClick={handlePickupOrder}
                                        >
                                            Pickup Order
                                        </button>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-muted">Enter a valid order ID and email to view details.</p>
            )}
        </div>
    );
};

export default OrderPickupGuestComponent;