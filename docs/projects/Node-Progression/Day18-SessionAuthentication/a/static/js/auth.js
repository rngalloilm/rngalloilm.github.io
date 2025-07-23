import api from './APIClient.js';

function displayUserInHeader(user) {
  let link = document.createElement('a');
  link.href = '#';
  link.innerHTML = "Log Out";
  link.addEventListener("click", e => {
    e.preventDefault();
    logOut();
  })

  document.getElementById('user').textContent = `${user.first_name} ${user.last_name} (${user.username}) `;
  document.getElementById('user').appendChild(document.createElement('br'));
  document.getElementById('user').appendChild(link);
}

function logOut() {
  api.logOut()
  .then(() => {
    // Redirect to login page after successful logout
    document.location = './login';
  })
  .catch(error => {
    console.error("Logout failed:", error);
  });
}

// Retrieve current user when page loads
api.getCurrentUser()
  .then(user => {
    displayUserInHeader(user);
  })
  .catch(error => {
    // Debugging
    console.log(`${error.status}`, error);

    // If unauthorized, redirect to login
    if (error.status == 401) {
      document.location = './login';
    }
  });