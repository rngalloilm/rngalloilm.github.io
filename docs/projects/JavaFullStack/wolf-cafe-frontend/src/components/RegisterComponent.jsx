import React, { useState } from 'react';
import { registerAPICall } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import { Tooltip as ReactTooltip } from 'react-tooltip';
//component to register an user 
const RegisterComponent = () => {
    const [name, setName] = useState(''); //store the user name 
    const [username, setUsername] = useState(''); //store the username of user
    const [email, setEmail] = useState(''); //store the email of user 
    const [password, setPassword] = useState(''); //store the password of the user 
    const [confirmPassword, setConfirmPassword] = useState(''); 
    const [errorMessage, setErrorMessage] = useState(''); //stoer the error messages 

    const navigate = useNavigate();
	//function to handle the form submission
    function handleRegistrationForm(e) {
        e.preventDefault();

        // Check if any field is empty
        if (!name || !username || !email || !password || !confirmPassword) {
            setErrorMessage('All fields are required.');
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        const register = { name, username, email, password};
        console.log(register);

        registerAPICall(register)
            .then((response) => {
                console.log(response.data);
                navigate('/login'); // Redirect to login on successful registration
            })
            .catch((error) => {
                console.error(error);
                setErrorMessage('Failed to register. Please try again.');
            });
    }

    return (
        <div className='container'>
            <br /><br />
            <div className='row'>
                <div className='col-md-6 offset-md-3 offset-md-3'>
                    <div className='card'>
                        <div className='card-header'>
                            <h2 className='text-center'>User Registration Form</h2>
                        </div>
                        <div className='card-body'>
                            {errorMessage && <div className='alert alert-danger'>{errorMessage}</div>}
                            <form onSubmit={handleRegistrationForm}>
                                <div className='row mb-3'>
                                    <label className='col-md-3 control-label'>Name</label>
                                    <div className='col-md-9'>
                                        <input
                                            type='text'
                                            name='name'
                                            className='form-control'
                                            placeholder='Enter name'
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className='row mb-3'>
                                    <label className='col-md-3 control-label'>Username</label>
                                    <div className='col-md-9'>
                                        <input
                                            type='text'
                                            name='username'
                                            className='form-control'
                                            placeholder='Enter username'
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className='row mb-3'>
                                    <label className='col-md-3 control-label'>Email</label>
                                    <div className='col-md-9'>
                                        <input
                                            type='email'
                                            name='email'
                                            className='form-control'
                                            placeholder='Enter email'
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className='row mb-3'>
                                    <label className='col-md-3 control-label'>Password</label>
                                    <div className='col-md-9'>
                                        <input
                                            type='password'
                                            name='password'
                                            className='form-control'
                                            placeholder='Enter password'
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className='row mb-3'>
                                    <label className='col-md-3 control-label'>Confirm Password</label>
                                    <div className='col-md-9'>
                                        <input
                                            type='password'
                                            name='confirmPassword'
                                            className='form-control'
                                            placeholder='Confirm password'
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

								<div className='form-group mb-3'>
								    <button 
								        type='submit' 
								        className='btn btn-primary'
								        data-tooltip-id="submit-button-tooltip"  // Tooltip ID for the button
								        data-tooltip-content="Click the submit button to create a customer account."  // Tooltip content
								    >
								        Submit
								    </button>
								    <ReactTooltip id="submit-button-tooltip" place="top" />
								</div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterComponent;