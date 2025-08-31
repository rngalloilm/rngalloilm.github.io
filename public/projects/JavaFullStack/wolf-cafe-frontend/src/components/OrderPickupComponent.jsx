//necessary imports
import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/UserService';
import { completeOrder } from '../services/OrdersService';
//pick up order component for a loginned in user 
const OrderPickupComponent = () => {
    const [orders, setOrders] = useState([]); //stores the order 
    const [errors, setErrors] = useState({ general: '' }); //stores the error messages 
    const [successMessage, setSuccessMessage] = useState(''); //stores the success messages 
	//fetches the user order
    useEffect(() => {
        fetchUserOrders();
    }, []);
	//fetches the user's order from the backend 
    const fetchUserOrders = async () => {
        try {
            const response = await getCurrentUser();
            const user = response.data;
            const filteredOrders = user.orders.filter(order =>
                ['Pending', 'READY_FOR_PICKUP'].includes(order.status)
            );
            setOrders(filteredOrders);
        } catch (error) {
            setErrors({ general: error.response?.data?.message || error.message });
        }
    };
	//function to handle marking a order as picked up
    const handlePickupOrder = async (orderId) => {
        try {
            await completeOrder(orderId);
            setOrders(orders.filter(order => order.id !== orderId));
            setSuccessMessage('Order picked up successfully!');
        } catch (error) {
            setErrors({ general: error.response?.data?.message || error.message });
        }
    };
	//function to calcualte the total price of order 
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


    // THIS WAS GENERATED WITH AI
	// Model: ChatGPT 01-preview
	// Prompt:	Implement the HTML for this app in OrderPickupComponent. Add 
	//			edits to OrdersService if needed. I included some relevant code to 
	//			assist you. The current code can serve as a guide but is unrelated so it
	//			will be replaced by what I need.
	//			I need a table with the orders that the "customer" user placed, orders 
	//			that are status "pending" or "ready". The table displays the order's 
	//			status and a button to "Pickup order" that will set the order to status 
	//			"complete" and will be removed from the table. 
    return (
        <div className="container mt-3">
            <h2 className="text-center">Your Orders</h2>
            {errors.general && (
                <div className="p-3 mb-2 bg-danger text-white">{errors.general}</div>
            )}
            {successMessage && (
                <div className="p-3 mb-2 bg-success text-white">{successMessage}</div>
            )}
            <br />
            {orders && orders.length > 0 ? (
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
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>
                                    {order.orderedItems &&
                                        order.orderedItems.map(orderItem =>
                                            orderItem.item ? (
                                                <div key={orderItem.id}>
                                                    {orderItem.item.name} (x{orderItem.quantity})
                                                </div>
                                            ) : null
                                        )}
                                </td>
                                <td>
                                    {order.orderedItems &&
                                        order.orderedItems.map(orderItem =>
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
                                            onClick={() => handlePickupOrder(order.id)}
                                        >
                                            Pickup Order
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No orders to display.</p>
            )}
        </div>
    );
};

export default OrderPickupComponent;