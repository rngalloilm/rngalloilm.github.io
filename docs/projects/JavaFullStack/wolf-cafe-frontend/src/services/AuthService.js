// AuthService.js
import axios from 'axios';

const AUTH_REST_API_BASE_URL = 'http://localhost:8080/api/auth';

/**
 * Registers a new user.
 * @param {Object} registerObj - The registration details.
 * @returns {Promise} - The axios request promise.
 */
export const registerAPICall = (registerObj) => 
    axios.post(`${AUTH_REST_API_BASE_URL}/register`, registerObj)
        .catch((error) => {
            console.error('Registration failed', error);
            throw error;  // Rethrow to handle errors in components if needed
        });

/**
 * Creates a new staff member.
 * @param {Object} registerObj - The registration details for the staff member.
 * @returns {Promise} - The axios request promise.
 */
export const createStaffAPICall = (registerObj) => {
    const token = getToken();
    return axios.post(`${AUTH_REST_API_BASE_URL}/createStaff`, registerObj, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    }).catch((error) => {
        console.error('Staff creation failed', error);
        throw error;  // Rethrow for component-level error handling
    });
};

/**
 * Logs in the user with provided credentials.
 * @param {string} usernameOrEmail - The username or email of the user.
 * @param {string} password - The user's password.
 * @returns {Promise<void>} - Resolves when login completes successfully.
 */
export const loginAPICall = async (usernameOrEmail, password) => {
    try {
        const response = await axios.post(`${AUTH_REST_API_BASE_URL}/login`, { usernameOrEmail, password });
        const { accessToken, role, location } = response.data;
		
        storeToken(accessToken);
        saveLoggedInUser(usernameOrEmail, role, location);

        // Redirect user based on their role
        window.location.href = role === 'ROLE_ADMIN' ? '/view-users' : '/menu';
    } catch (error) {
        console.error('Login failed', error);
        throw error;  // Rethrow error for component-level handling if needed
    }
};

/**
 * Stores the JWT token in local storage.
 * @param {string} token - The JWT token.
 */
export const storeToken = (token) => {
    localStorage.setItem('token', token);
};

export const listUsers = (users) => axios.get(AUTH_REST_API_BASE_URL + "/" + "user")
export const getUserById = (id) => axios.get(AUTH_REST_API_BASE_URL + "/user/" + id)
export const editUser = (id, user) => axios.put(AUTH_REST_API_BASE_URL + "/user/" + id, user)
export const deleteUser = (id) => axios.delete(AUTH_REST_API_BASE_URL + "/user/" + id)


/**
 * Retrieves the stored JWT token.
 * @returns {string|null} - The JWT token or null if not found.
 */
export const getToken = () => localStorage.getItem('token');

/**
 * Saves the authenticated user's details in session storage.
 * @param {string} username - The username or email.
 * @param {string} role - The user's role.
 */
export const saveLoggedInUser = (username, role, location) => {
    sessionStorage.setItem('authenticatedUser', username);
    sessionStorage.setItem('role', role);
	
	if(location) {
	   sessionStorage.setItem('locationId', location.id)
	   sessionStorage.setItem('locationName', location.name)
	}
};

/**
 * Checks if a user is logged in.
 * @returns {boolean} - True if a user is logged in, otherwise false.
 */
export const isUserLoggedIn = () => {return sessionStorage.getItem('authenticatedUser') !== null && sessionStorage.getItem('authenticatedUser') !== 'undefined'}

/**
 * Gets the logged-in user's username or email.
 * @returns {string|null} - The username or null if not logged in.
 */
export const getLoggedInUser = () => sessionStorage.getItem('authenticatedUser');

/**
 * Logs out the user by clearing session and local storage.
 */
export const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.clear();
    window.location.href = '/login';  // Redirect to login page
};

/**
 * Checks if the logged-in user is an admin.
 * @returns {boolean} - True if the user has admin role, otherwise false.
 */
export const isAdminUser = () => getUserRole() === 'ROLE_ADMIN';

export const getLocation = () => sessionStorage.getItem('locationName')
export const getLocationId = () => sessionStorage.getItem('locationId')

/**
 * Gets the user's role from session storage.
 * @returns {string|null} - The user's role or null if not available.
 */
export const getUserRole = () => sessionStorage.getItem('role');
