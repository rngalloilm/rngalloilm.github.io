//neccesary imports
import React, {useEffect, useState} from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import {isUserLoggedIn, getUserRole, logout, getLocation} from '../services/AuthService';
import {Tooltip as ReactTooltip} from 'react-tooltip';

//the header component for Wolfcare, based on role, user can see certian pages
const HeaderComponent = () => {
    const isAuth = isUserLoggedIn();
    const role = getUserRole(); // Get the user role
    const navigate = useNavigate();

    const [headerTitle, setHeaderTitle] = useState("WolfCafe");
    //What to do if the user logs out
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    //What to set the title based on user role
    useEffect(() => {
        if (role === 'ROLE_ADMIN') {
            setHeaderTitle("WolfCafe - Admin");
        } else if (role === 'ROLE_STAFF') {
            const locationName = getLocation();
            console.log(locationName);
            setHeaderTitle(`WolfCafe - ${locationName}`);
        } else {
            setHeaderTitle("WolfCafe")
        }
    }, [role]);

    //Used to display what is in the header
    return (
        <header>
            <nav className='navbar navbar-expand-md navbar-dark bg-dark shadow-sm sticky-top custom-navbar'>
                <div className='container'>
                    <a href='http://localhost:3000' className='navbar-brand'>
                        {headerTitle}
                    </a>
                    <div className='collapse navbar-collapse'>
                        <ul className='navbar-nav me-auto'>
                            {/* Links for any authenticated user */}

                            {/* Links for staff users */}
                            {isAuth && (role == "ROLE_STAFF") && (
                                <>
                                    <li className='nav-item' data-tooltip-id="item-header-tt"
                                        data-tooltip-content="Items page to modify, delete or add items">
                                        <ReactTooltip id="item-header-tt" place="top"/>
                                        <NavLink to='/items' className='nav-link'>
                                            Items
                                        </NavLink>
                                    </li>
                                    <li className='nav-item' data-tooltip-id="ingredient-header-tt"
                                        data-tooltip-content="Ingredients page to modify, delete or add ingredients">
                                        <ReactTooltip id="ingredient-header-tt" place="top"/>
                                        <NavLink to='/ingredients' className='nav-link'>
                                            Ingredients
                                        </NavLink>
                                    </li>
                                    <>
                                        <li className='nav-item' data-tooltip-id="recipe-header-tt"
                                            data-tooltip-content="Recipes page to modify, delete or add recipes">
                                            <ReactTooltip id="recipe-header-tt" place="top"/>
                                            <NavLink to='/recipes' className="nav-link">
                                                Recipes
                                            </NavLink>
                                        </li>
                                    </>
                                    <li className='nav-item' data-tooltip-id="inventory-header-tt"
                                        data-tooltip-content="Inventory page to modify the quantitiy of how many ingredients/items we're storing">
                                        <ReactTooltip id="inventory-header-tt" place="top"/>
                                        <NavLink to='/inventory' className='nav-link'>
                                            Inventory
                                        </NavLink>
                                    </li>
                                    <li className='nav-item' data-tooltip-id="order-header-tt"
                                        data-tooltip-content="Orders page to create orders for users, see a list of pending orders to be fulfilled and manage those">
                                        <ReactTooltip id="order-header-tt" place="top"/>
                                        <NavLink to='/orders' className='nav-link'>
                                            Orders
                                        </NavLink>
                                    </li>
                                    <li className='nav-item' data-tooltip-id='manage-menu-header-tt'
                                        data-tooltip-content="Menu management page to exclude/include items/recipes from the menu for your location">
                                        <ReactTooltip id="manage-menu-header-tt" place="top"/>
                                        <NavLink to='/manage-menu' className='nav-link'>
                                            Menu Management
                                        </NavLink>
                                    </li>
                                    <li className='nav-item' data-tooltip-id='staff-order-history-header-tt'
                                        data-tooltip-content="Order History page to see all completed orders for your location, as well as statistical analysis of items/recipes for your location ">
                                        <ReactTooltip id="staff-order-history-header-tt" place="top"/>
                                        <NavLink to='/staff-order-history' className='nav-link'>
                                            Order History
                                        </NavLink>
                                    </li>
                                </>
                            )}

                            {/* Links for customer users */}
                            {isAuth && (role == "ROLE_CUSTOMER") && (
                                <>
                                    <li className='nav-item' data-tooltip-id='cust-order-history-header-tt'
                                        data-tooltip-content="Order History page to see your completed orders ">
                                        <ReactTooltip id="cust-order-history-header-tt" place="top"/>
                                        <NavLink to='/order-history' className='nav-link'>
                                            Order History
                                        </NavLink>
                                    </li>

                                    <li className='nav-item' data-tooltip-id='menu-header-tt'
                                        data-tooltip-content="Menu page to see the available items/recipes for a location, as well as their pricing ">
                                        <ReactTooltip id="menu-header-tt" place="top"/>
                                        <NavLink to='/menu' className='nav-link'>
                                            Menu
                                        </NavLink>
                                    </li>
									<li className='nav-item' data-tooltip-id='order-cust-header-tt'
									                                       data-tooltip-content="Order page to place an online order for a given quantity of available items/recipes for a chosen location ">
                                        <ReactTooltip id="order-cust-header-tt" place="top"/>
                                        <NavLink to='/order-customer' className='nav-link'>
                                            Order
                                        </NavLink>
                                    </li>
									<li className='nav-item' data-tooltip-id='order-pickup-header-tt'
									                                       data-tooltip-content="Order Pickup page to confirm you picked up your order after staff fulfills it ">
                                        <ReactTooltip id="order-pickup-header-tt" place="top"/>
                                        <NavLink to='/order-pickup' className='nav-link'>
                                            Order Pickup
                                        </NavLink>
                                    </li>
                                </>
                            )}

                            {/* Admin-only navigation links */}
                            {isAuth && role === 'ROLE_ADMIN' && (
                                <>
								<li className='nav-item' data-tooltip-id='view-users-header-tt'
								                                       data-tooltip-content="View Users page to manage all customers and staff ">
                                        <ReactTooltip id="view-users-header-tt" place="top"/>
                                        <NavLink to='/view-users' className='nav-link'>
                                            View Users
                                        </NavLink>
                                    </li>
									<li className='nav-item' data-tooltip-id='create-staff-header-tt'
									                                       data-tooltip-content="Create staff page to create a staff member for a location">
                                        <ReactTooltip id="create-staff-header-tt" place="top"/>
                                        <NavLink to='/create-staff' className='nav-link'>
                                            Create Staff
                                        </NavLink>
                                    </li>
									<li className='nav-item' data-tooltip-id='locations-header-tt'
									                                       data-tooltip-content="Locations page to view and modify locations for the enterprise ">
                                        <ReactTooltip id="locations-header-tt" place="top"/>
                                        <NavLink to='/locations' className='nav-link'>
                                            Locations
                                        </NavLink>
                                    </li>
                                </>
                            )}
                        </ul>
                        <ul className='navbar-nav'>
                            {/* Links for non-authenticated users */}
                            {!isAuth && (
                                <>
								<li className='nav-item' data-tooltip-id='register-header-tt'
								                                       data-tooltip-content="Registration page for customers to be able to sign up to store their order history">
                                        <ReactTooltip id="register-header-tt" place="top"/>
                                        <NavLink to='/register' className='nav-link'>
                                            Register
                                        </NavLink>
                                    </li>
									<li className='nav-item' data-tooltip-id='login-header-tt'
									                                       data-tooltip-content="Login page for customers with an account to sign back in ">
                                        <ReactTooltip id="login-header-tt" place="top"/>
                                        <NavLink to='/login' className='nav-link'>
                                            Login
                                        </NavLink>
                                    </li>
									<li className='nav-item' data-tooltip-id='menu-guest-header-tt'
									                                       data-tooltip-content="Menu page to see the available items/recipes for a location, as well as their pricing ">
                                        <ReactTooltip id="menu-guest-header-tt" place="top"/>
                                        <NavLink to='/menu' className='nav-link'>
                                            Menu
                                        </NavLink>
                                    </li>
									<li className='nav-item' data-tooltip-id='order-customer-guest-header-tt'
									                                       data-tooltip-content="Order page for guests to be able to place an order for a location ">
                                        <ReactTooltip id="order-customer-guest-header-tt" place="top"/>
                                        <NavLink to='/order-customer-guest' className='nav-link'>
                                            Order
                                        </NavLink>
                                    </li>
									<li className='nav-item' data-tooltip-id='order-pickup-guest-header-tt'
									                                       data-tooltip-content="Pickup package for guests to be able to view status and pick up their order when fulfilled by staff ">
                                        <ReactTooltip id="order-pickup-guest-header-tt" place="top"/>
                                        <NavLink to='/order-pickup-guest' className='nav-link'>
                                            Order Pickup Guest
                                        </NavLink>
                                    </li>
                                </>
                            )}
                            {/* Logout link for authenticated users */}
                            {isAuth && (
                                <>


								<li className='nav-item' data-tooltip-id='logout-header-tt'
								                                       data-tooltip-content="Button to log out of your account ">
                                        <ReactTooltip id="logout-header-tt" place="top"/>
                                        <NavLink
                                            to='/login'
                                            className='nav-link'
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </NavLink>
                                    </li>

                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default HeaderComponent;