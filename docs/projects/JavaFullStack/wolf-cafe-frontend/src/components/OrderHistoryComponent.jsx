import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/UserService';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

//creating a chart
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

//a component to display the order history for a customer 
const OrderHistoryComponent = () => {
    const [orders, setOrders] = useState([]); // stores the order 
    const [user, setUser] = useState(null); //stores the user 
    const [errors, setErrors] = useState(''); //store the error messages 
	//fetch the user 
    useEffect(() => {
        fetchUserData();
    }, []);
//fetches the data of the user, including the order history 
    const fetchUserData = async () => {
        try {
            const response = await getCurrentUser();
            setUser(response.data);
            setOrders(response.data.orders || []);
        } catch (error) {
            setErrors('Failed to fetch user data: ' + error.message);
        }
    };
//calcualte the toal price for a specific order
    const calculateOrderTotalPrice = (order) => {
        let subtotalCents = 0;
        order.orderedItems.forEach(item => {
            const priceCents = item.item?.price * 100 || item.recipe?.price || 0;
            subtotalCents += priceCents * item.quantity;
        });
        const taxCents = subtotalCents * (order.location.taxRate || 0);
        const tipCents = subtotalCents * (order.tipRate || 0);
        const totalCents = subtotalCents + taxCents + tipCents;
        return (totalCents / 100).toFixed(2);
    };
//render the component 
    return (
        <div className="container mt-3">
            <h2 className="text-center">Order History</h2>
            {errors && <div className="p-3 mb-2 bg-danger text-white">{errors}</div>}
            {!user ? (
                <p>Loading...</p>
            ) : orders.length === 0 ? (
                <p>No order history found.</p>
            ) : (
                <div className="row">
                    {orders.map((order) => (
                        <div className="col-md-4 mb-3" key={order.id}>
                            <div className="card bg-light">
                                <div className="card-body">
                                    <h5 className="card-title">Order ID: {order.id}</h5>
                                    <p className="card-text">
                                        <strong>Status:</strong> {order.status}<br />
                                        <strong>Location:</strong> {order.location?.name || 'Unknown'}<br />
                                        <strong>Items:</strong>{' '}
                                        {order.orderedItems.map((item, index) => (
                                            <span key={item.id}>
                                                {item.recipe 
                                                    ? `${item.recipe.name} (x${item.quantity})` 
                                                    : `${item.item.name} (x${item.quantity})`}
                                                {index !== order.orderedItems.length - 1 && ', '}
                                            </span>
                                        )) || 'None'}<br />
                                        <strong>Total Price:</strong> ${calculateOrderTotalPrice(order)}<br />
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistoryComponent;
