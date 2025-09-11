//neccessary imports
import React, { useState, useEffect } from 'react';
import { loginAPICall, isUserLoggedIn, getUserRole } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import {Tooltip as ReactTooltip} from 'react-tooltip';

//a component for user login 
const LoginComponent = () => {
    const [usernameOrEmail, setUsernameOrEmail] = useState(''); //stores the username or email
    const [password, setPassword] = useState(''); //stores the password of the user 
    const [errors, setErrors] = useState({}); //stores teh error message 

    const navigate = useNavigate();

	//function to validate the login crediental
    function validateForm(){
        var valid = true;

        if(!usernameOrEmail.trim()){setErrors({usernameOrEmail: 'Please enter a username or email'}); valid = false}
        if(!password.trim()){setErrors({password: 'Please enter a password'}); valid = false}
        return valid
    }

	//determines if the user is already logged in and determines appropriate path based on user role
    useEffect(() => {
        if (isUserLoggedIn()) {
            const role = getUserRole();
            if (role === 'ROLE_CUSTOMER') {
                navigate('/menu');
            } else if (role === 'ROLE_ADMIN') {
                navigate('/view-users');
            } else if (role === 'ROLE_STAFF') {
                navigate('/orders');
            } else {
                navigate('/menu'); // Default path
            }
        }
    }, [navigate]);
	//handles the login submission 
    async function handleLoginForm(e) {
        e.preventDefault();
        if(!validateForm()){
            return
        }
        try {
            await loginAPICall(usernameOrEmail, password);
        } catch (error) {
            setErrors({general: 'Invalid username or password'})
            console.error('ERROR: ' + error);
        }
    }
//render the login form
    return (
        <div className='container'>
            <br />
            <div className='row justify-content-center'>
                <div className='col-md-6'>
                    <div className='card'>
                        <div className='card-header'>
                            <h2 className='text-center'>Login Form</h2>
                            {errors.general && <p className='text-danger'>{errors.general}</p>}
                        </div>
                        <div className='card-body'>
                            <form onSubmit={handleLoginForm}>
                                <div className='mb-3 row'>
                                    <label className='col-md-4 col-form-label'>Username</label>
                                    <div className='col-md-8'>
                                        <input
                                            type='text'
                                            name='usernameOrEmail'
                                            className='form-control'
                                            placeholder='Enter username or email'
                                            value={usernameOrEmail}
                                            onChange={(e) => setUsernameOrEmail(e.target.value)}
                                        />
                                        {errors.usernameOrEmail && <p className='text-danger'>{errors.usernameOrEmail}</p>}
                                    </div>
                                </div>
                                <div className='mb-3 row'>
                                    <label className='col-md-4 col-form-label'>Password</label>
                                    <div className='col-md-8'>
                                        <input
                                            type='password'
                                            name='password'
                                            className='form-control'
                                            placeholder='Enter password'
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        {errors.password && <p className='text-danger'>{errors.password}</p>}
                                    </div>
                                </div>
                                <div className='form-group' data-tooltip-id="login-submit" data-tooltip-content="Submit the login form to process your login transaction">
								    <ReactTooltip id="login-submit" place="top"/>
                                    <button className='btn btn-primary w-100' type='submit'>Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginComponent;