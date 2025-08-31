import React, { useEffect, useState } from 'react';
import { getCompletedOrders } from '../services/OrdersService'; 
import { getLocationId } from '../services/AuthService';
import { Line } from 'react-chartjs-2'; 
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

//component to display the order history for staff 
const OrderHistoryForStaff = () => {
    const [orders, setOrders] = useState([]); //stores the order 
    const [totalRevenue, setTotalRevenue] = useState(0); //stores the total revenue 
    const [popularItems, setPopularItems] = useState([]); //stores the most popular items order at WolfCafe
    const [errors, setErrors] = useState(''); //stores the error messges 
	const [chartData, setChartData] = useState(null); // Stores chart data

    const locationId = getLocationId(); //get the location 
	//fetches the order history of the indicated location 
    useEffect(() => {
        fetchOrderHistory();
    }, [locationId]);
	//fetches  the completed order for a specific locaiton 
    const fetchOrderHistory = async () => {
        try {
            const response = await getCompletedOrders(locationId); 
            setOrders(response.data);
            calculateTotalRevenue(response.data);
            calculatePopularItems(response.data);
			prepareChartData(response.data);
        } catch (error) {
            setErrors('Failed to fetch order history: ' + error.message);
        }
    };
	//calculates the total revenu from all orders
    const calculateTotalRevenue = (orders) => {
        let revenueCents = orders.reduce((sum, order) => {
            let subtotalCents = 0;
            order.orderedItems.forEach(item => {
                const priceCents = item.item?.price * 100 || item.recipe?.price || 0;
                subtotalCents += priceCents * item.quantity;
            });
            const taxCents = subtotalCents * (order.location.taxRate || 0);
            const tipCents = subtotalCents * (order.tipRate || 0);
            const totalCents = subtotalCents + taxCents + tipCents;
            return sum + totalCents;
        }, 0);
        setTotalRevenue((revenueCents / 100).toFixed(2));
    };
	//function to calculate the most poplar items based on the quanity sold of each item 
    const calculatePopularItems = (orders) => {
        const itemCounts = {};
        orders.forEach((order) => {
            order.orderedItems.forEach((item) => {
                const name = item.item?.name || item.recipe?.name;
                itemCounts[name] = (itemCounts[name] || 0) + item.quantity;
            });
        });

        const sortedItems = Object.entries(itemCounts).sort((a, b) => b[1] - a[1]);
        setPopularItems(sortedItems.slice(0, 5));
    };
	
	/** 
	 * “GENERATIVE AI WAS USED”, 
	 * chatGpt 
	 * prompt: For this order history component[inserted the component],
	 *  I want a to display a graph of order's per day
	 */
	// Function to prepare the chart data (orders per day)
	    const prepareChartData = (orders) => {
	        const orderDates = {};

	        // Group orders by the date they were placed (use the order creation date or current date if none exists)
	        orders.forEach(order => {
	            const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : new Date().toLocaleDateString();
	            if (orderDates[orderDate]) {
	                orderDates[orderDate]++;
	            } else {
	                orderDates[orderDate] = 1;
	            }
	        });

	        const dates = Object.keys(orderDates);
	        const orderCounts = dates.map(date => orderDates[date]);

	        // Set the chart data
	        setChartData({
	            labels: dates,
	            datasets: [
	                {
	                    label: 'Orders per Day',
	                    data: orderCounts,
	                    backgroundColor: '#42A5F5',
	                    borderColor: '#1E88E5',
	                    borderWidth: 1,
	                    fill: false, // Line chart
	                },
	            ],
	        });
	    };
	//function to calculate the total price of an order
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

    return (
        <div className="container mt-3">
            <h2 className="text-center">Order History for Location {locationId}</h2>
            {errors && <div className="p-3 mb-2 bg-danger text-white">{errors}</div>}

            <div className="mb-3">
                <h4>Total Revenue: ${totalRevenue}</h4>
                <h5>Top 5 Popular Items/Recipes:</h5>
                <ul>
                    {popularItems.map(([name, count], index) => (
                        <li key={index}>
                            {name}: {count} orders
                        </li>
                    ))}
                </ul>
            </div>
			{/* Render the chart if chartData is available */}
			            {chartData && (
			                <div className="mb-3">
			                    <h4>Orders per Day</h4>
			                    <Line data={chartData} />
			                </div>
			            )}

            <table className="table mt-3">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Status</th>
                        <th>Customer</th>
                        <th>Items/Recipes</th>
                        <th>Total Price</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.status}</td>
                            <td>{order.userId ? `User ${order.userId}` : 'Anonymous'}</td>
                            <td>
                                {order.orderedItems.map((item, index) => (
                                    <span key={index}>
                                        {item.item?.name || item.recipe?.name} (x{item.quantity})
                                        {index !== order.orderedItems.length - 1 && ', '}
                                    </span>
                                ))}
                            </td>
                            <td>${calculateOrderTotalPrice(order)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderHistoryForStaff;
