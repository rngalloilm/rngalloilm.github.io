import APIClient from './APIClient.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = loginForm.querySelector('input[type="text"]').value.trim();
    if (username) {
      APIClient.login(username)
        .then(user => {
          window.location.href = '/'; // Redirect to home page
        })
        .catch(err => console.error('Login failed', err));
    }
  });
});