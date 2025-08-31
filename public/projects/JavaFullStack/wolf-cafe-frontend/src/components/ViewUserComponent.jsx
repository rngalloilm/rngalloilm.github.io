import { useEffect, useState } from 'react';
import { listUsers, deleteUser } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import {Tooltip as ReactTooltip} from 'react-tooltip';


const ViewUserComponent = () => {
  const [users, setUsers] = useState([]); // State to hold all user data
  const [filteredUsers, setFilteredUsers] = useState([]); // State to hold filtered user data
  const [error, setError] = useState(null); // State for error handling
  const [filterRole, setFilterRole] = useState('all'); // State for role filter
  const navigate = useNavigate();

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Re-apply filter whenever users or filterRole changes
  useEffect(() => {
    applyFilter();
  }, [users, filterRole]);

  // Function to fetch users from the API
  const fetchUsers = async () => {
    try {
      const response = await listUsers();
      setUsers(response.data); // Populate the state with user data
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users.");
    }
  };

  // Function to apply the role filter
  const applyFilter = () => {
    if (filterRole === 'all') {
      setFilteredUsers(users);
    } else {
      const roleToFilter = filterRole === 'staff' ? 'ROLE_STAFF' : 'ROLE_CUSTOMER';
      const filtered = users.filter(user => user.roles.some(role => role.name === roleToFilter));
      setFilteredUsers(filtered);
    }
  };

  // Function to handle deleting a user
  const handleDelete = async (id) => {
    // Display error message and do not proceed if attempting to delete admin user
    if (id === 1) {
      setError("Cannot delete the admin user.");
      return; // Do not proceed to show confirm dialog
    } else {
      // Clear any existing error messages
      setError(null);
    }

    console.log('handleDelete called with id:', id);
    // Confirm deletion
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await deleteUser(id);
      // Update the users state by removing the deleted user
      const updatedUsers = users.filter(user => user.id !== id);
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user.");
    }
  };

  // Function to handle modifying a user
  const handleModify = (id) => {
    console.log(`Modify user with id: ${id}`);
    // Navigate to modify page
    navigate(`/edit-user/${id}`);
  };

  // Function to handle filter button clicks
  const handleFilterChange = (role) => {
    setFilterRole(role);
    // Clear any previous error messages when changing the filter
    setError(null);
  };

  return (
    <div className="container mt-3">
      <h2 className="text-center">List of Users</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Filter Buttons */}
      <div className="mb-3">
        <button
          className={`btn btn-${filterRole === 'all' ? 'primary' : 'secondary'} me-2`}
          onClick={() => handleFilterChange('all')}
        >
          View All
        </button>
        <button
          className={`btn btn-${filterRole === 'staff' ? 'primary' : 'secondary'} me-2`}
          onClick={() => handleFilterChange('staff')}
        >
          View Staff
        </button>
        <button
          className={`btn btn-${filterRole === 'customer' ? 'primary' : 'secondary'}`}
          onClick={() => handleFilterChange('customer')}
        >
          View Customers
        </button>
      </div>

      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Name</th>
            <th>Roles</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.username}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.name}</td>
              <td>{user.roles.map(role => role.name.replace('ROLE_', '')).join(', ')}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => handleModify(user.id)}
                  style={{ marginRight: '10px' }}
				  data-tooltip-id={`modify-button-tt-${user.username}`}  data-tooltip-content={`Modify the user ${user.username}`}
                >
				  <ReactTooltip id={`modify-button-tt-${user.username}`} place="top"/>
                  Modify
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(user.id)}
				    data-tooltip-id={`delete-button-tt-${user.username}`}  data-tooltip-content={`Delete the user ${user.username}`}
				  >
				    <ReactTooltip id={`delete-button-tt-${user.username}`} place="top"/>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewUserComponent;