import React, { useEffect, useState } from 'react';
import { createStaffAPICall } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import { isAdminUser } from '../services/AuthService';
import { getAllLocations } from '../services/LocationService';
import {Tooltip as ReactTooltip} from 'react-tooltip';

const CreateStaffComponent = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [locationId, setLocationId] = useState('');
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();

  if (!isAdminUser()) {
    navigate('/');
    return null;
  }

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = () => {
    getAllLocations()
      .then((response) => {
        if (response.data.length === 0) {
          setErrorMessage('No locations exist. Create a location first.');
        } else {
          setLocations(response.data);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch locations', error);
        setErrorMessage('Failed to load locations. Please try again.');
      });
  };

  const handleCreateStaffForm = (e) => {
    e.preventDefault();
    if (!name || !username || !email || !password || !locationId) {
      setErrorMessage('All fields are required, including location.');
      return;
    }

    const register = { name, username, email, password, locationId };

    createStaffAPICall(register)
      .then(() => {
        navigate('/view-users');
      })
      .catch((error) => {
        const message =
          error.response?.data?.message || error.response?.data?.error || 'Failed to create staff user.';
        setErrorMessage(message);
      });
  };

  return (
    <div className='container'>
      <br /><br />
      <div className='row'>
        <div className='col-md-6 offset-md-3 offset-md-3'>
          <div className='card'>
            <div className='card-header'>
              <h2 className='text-center'>Create Staff User</h2>
            </div>
            <div className='card-body'>
              {errorMessage && <div className='alert alert-danger'>{errorMessage}</div>}
              <form>
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
                    ></input>
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
                    ></input>
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
                    ></input>
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
                    ></input>
                  </div>
                </div>

                <div className='row mb-3'>
                  <label className='col-md-3 control-label'>Location</label>
                  <div className='col-md-9'>
                    <select
                      className='form-control'
                      value={locationId}
                      onChange={(e) => setLocationId(parseInt(e.target.value))}
                    >
                      <option value=''>Select a location</option>
                      {locations.map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className='form-group mb-3'>
                  <button className='btn btn-primary' onClick={handleCreateStaffForm} data-tooltip-id={`submit-staff-button`}  data-tooltip-content={`Submit the staff member to process creation`}
				>
				  <ReactTooltip id={`submit-staff-button`} place="top"/>
                    Submit
                  </button>
                  <button
                    type='button'
                    className='btn btn-secondary'
                    onClick={() => navigate('/view-users')}
                    style={{ marginLeft: '10px' }}
					 data-tooltip-id={`cancel-staff-button`}  data-tooltip-content={`Cancel the create staff member transaction`}
					>
					  <ReactTooltip id={`cancel-staff-button`} place="top"/>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateStaffComponent;
