//neccessary imports 
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAdminUser } from '../services/AuthService';
import { getAllLocations, deleteLocationById, createLocation, updateLocationTaxRate } from '../services/LocationService';
import {Tooltip as ReactTooltip} from 'react-tooltip';

//compoent for locations 
const LocationComponent = () => {
    const [locations, setLocations] = useState([]);// stores the locations is the system 
    const [newLocation, setNewLocation] = useState({ name: '', address: '', taxRate: '', endOfDayTime: '' }); //stores the new location fields 
    const [taxRateInputs, setTaxRateInputs] = useState({}); //stores the tax rate for locations in the system
    const [successMessage, setSuccessMessage] = useState(''); //stores the success messages
    const [errors, setErrors] = useState({ general: '' }); //stores the error messges 
    const [realTaxRateInputs, setRealTaxRateInputs] = useState([])
    const navigate = useNavigate();
    const isAdmin = isAdminUser(); //determines if the user is a admin 
	//fetches the list of locations 
    useEffect(() => {
        listLocations();
    }, []);
	//fetches all the locations from the backend 
    const listLocations = async () => {
        try {
            const response = await getAllLocations();
            setLocations(response.data);

            // Initialize taxRateInputs with current tax rates
            const initialTaxRates = {};
            const initialTaxRates2 = {};
            response.data.forEach(location => {
                initialTaxRates[location.id] = location.taxRate;
                initialTaxRates2[location.id] = location.taxRate * 100;
            });
            setTaxRateInputs(initialTaxRates);
            setRealTaxRateInputs(initialTaxRates2);
        } catch (error) {
            console.error('Error fetching locations:', error);
            setErrors({ general: 'Error fetching locations: ' + error.message });
        }
    };
	//adds a new location
    const addNewLocation = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrors({ general: '' });

        // Basic frontend validation
        if (!newLocation.name || !newLocation.address || !newLocation.taxRate || !newLocation.endOfDayTime) {
            setErrors({ general: "All fields are required." });
            return;
        }

        const taxRate = parseFloat(newLocation.taxRate / 100); // Tax is input as whole percentage
        if (taxRate < 0.02) {
            setErrors({ general: "Tax rate must be at least 2%." });
            return;
        }

        const locationToAdd = { ...newLocation, taxRate };

        try {
            const response = await createLocation(locationToAdd);
            console.log('New location added:', response.data);
            setNewLocation({ id: '', name: '', address: '', taxRate: '', endOfDayTime: '' }); // Reset form fields
            setErrors({ general: '' }); // Clear any previous error
            setSuccessMessage('Location added successfully!');
            listLocations(); // Refresh the list
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Error adding location.";
            setErrors({ general: errorMsg });
            console.error('Error adding location:', errorMsg);
        }
    };
	//delete a location
    const deleteLocation = async (id) => {
        console.log('Deleting location with ID:', id);
        setSuccessMessage('');
        setErrors({ general: '' });

        try {
            await deleteLocationById(id);
            setSuccessMessage('Location deleted successfully!');
            listLocations();
        } catch (error) {
            console.error('Error deleting location:', error);
            setErrors({ general: ('Error deleting location: ' + error?.response?.data?.error || error.message) });
        }
    };

    // Handle tax rate input changes
    const handleTaxRateChange = (locationId, value) => {
        setTaxRateInputs({
            ...taxRateInputs,
            [locationId]: value,
        });
        setRealTaxRateInputs({
            ...realTaxRateInputs,
            [locationId]: value,
        });
    };

    // Submit the updated tax rate
    const submitTaxRate = async (locationId) => {
        setSuccessMessage('');
        setErrors({ general: '' });

        const taxRateValue = (taxRateInputs[locationId]);
        console.log(taxRateValue)
        const taxRate = parseFloat(taxRateValue);
        if (isNaN(taxRate) || taxRate < 2) {
            setErrors({ general: 'Tax rate must be at least 2%' });
            return;
        }

        try {
            await updateLocationTaxRate(locationId, (taxRate / 100)); // Updated tax is input as whole percentage
            setSuccessMessage('Tax rate updated successfully');
            listLocations(); // Refresh the list to get updated data
        } catch (error) {
            console.error('Error updating tax rate:', error);
            setErrors({ general: 'Error updating tax rate: ' + error.message });
        }
    };
	//render the location 
    return (
        <div className='container'>
            <br /> <br />
            <h2 className='text-center'>Locations</h2>
            {errors.general && <div className="p-3 mb-2 bg-danger text-white">{errors.general}</div>}
            {successMessage && <div className="p-3 mb-2 bg-success text-white">{successMessage}</div>}
            {isAdmin && (
                <form onSubmit={addNewLocation}>
                    <h4 className='text-center'>Add New Location</h4>
                    <div className='form-group mb-2'>
                        <label className='form-label'>Name:</label>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Enter Location Name'
                            value={newLocation.name}
                            onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className='form-group mb-2'>
                        <label className='form-label'>Address:</label>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Enter Address'
                            value={newLocation.address}
                            onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
                            required
                        />
                    </div>
                    <div className='form-group mb-2'>
                        <label className='form-label'>Tax Rate:</label>
                        <input
                            type='number'
                            className='form-control'
                            placeholder='Enter Tax Rate %'
                            value={newLocation.taxRate}
                            onChange={(e) => setNewLocation({ ...newLocation, taxRate: e.target.value })}
                            required
                            min="2" // Minimum value as per backend requirement
                            step="1" // Allow decimal values
                        />
                    </div>
                    <div className='form-group mb-2'>
                        <label className='form-label'>End of Day Time:</label>
                        <input
                            type='time'
                            className='form-control'
                            value={newLocation.endOfDayTime}
                            onChange={(e) => setNewLocation({ ...newLocation, endOfDayTime: e.target.value })}
                            required
                        />
                    </div>
                    <button type='submit' className='btn btn-success'>Add Location</button>
                </form>
            )}
            <div>
                <table className='table table-bordered table-striped'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Tax Rate</th>
                            <th>End of Day Time (Eastern U.S. Time)</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {locations.map((location) => (
                            <tr key={location.id}>
                                <td>{location.id}</td>
                                <td>{location.name}</td>
                                <td>{location.address}</td>
                                <td>
                                    <input
                                        type='number'
                                        value={realTaxRateInputs[location.id]} // Displays whole percentage
                                        onChange={(e) => handleTaxRateChange(location.id, e.target.value)}
                                        min="2"
										step="1"
                                    />
                                    <button onClick={() => submitTaxRate(location.id)} className='btn btn-primary btn-sm' style={{ marginLeft: '5px' }} data-tooltip-id={`tax-tt-${location.id}`}  data-tooltip-content={`Submit tax rate for location ${location.name}`}>
									<ReactTooltip id={`tax-tt-${location.id}`} place="top"/>
									Submit
									</button>	
                                </td>
                                <td>{location.endOfDayTime}</td>
                                <td>
                                    {isAdmin && (
                                        <button
                                            className='btn btn-danger'
                                            onClick={() => deleteLocation(location.id)}
                                            style={{ marginLeft: "10px" }}
											data-tooltip-id={`delete-tt-${location.id}`}  data-tooltip-content={`Delete location ${location.name}`}
                                        >
										<ReactTooltip id={`delete-tt-${location.id}`} place="top"/>
                                            Delete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LocationComponent;
