import HTTPClient from './HTTPClient.js';

const BASE_API_PATH = '/api';

export default {
  // Authenticate user
  login: (username) => {
    return HTTPClient.post(`${BASE_API_PATH}/login`, { username });
  },

  // Log user out
  logout: () => {
    return HTTPClient.post(`${BASE_API_PATH}/logout`);
  },

  // Get current user
  getCurrentUser: () => {
    return HTTPClient.get(`${BASE_API_PATH}/me`);
  },

  // Get howls for the feed
  getFeed: () => {
    return HTTPClient.get(`${BASE_API_PATH}/feed`);
  },

  // Post a new howl
  postHowl: (text) => {
    return HTTPClient.post(`${BASE_API_PATH}/howls`, { text });
  },

  // Get howls by user
  getHowlsByUser: (userId) => {
    return HTTPClient.get(`${BASE_API_PATH}/users/${userId}/howls`);
  },

  // Get user details by ID
  getUserById: (userId) => {
    return HTTPClient.get(`${BASE_API_PATH}/users/${userId}`);
  },

  // Get followed users
  getFollowedUsers: (userId) => {
    return HTTPClient.get(`${BASE_API_PATH}/users/${userId}/followed`);
  },

  // Follow a user
  followUser: (userId, userToFollowId) => {
    return HTTPClient.post(`${BASE_API_PATH}/users/${userToFollowId}/follow`);
  },

  // Unfollow a user
  unfollowUser: (userId, userToUnfollowId) => {
    return HTTPClient.post(`${BASE_API_PATH}/users/${userToUnfollowId}/unfollow`);
  },
};