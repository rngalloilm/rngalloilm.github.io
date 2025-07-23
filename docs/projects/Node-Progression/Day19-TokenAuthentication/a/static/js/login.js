import api from './APIClient.js';

const loginForm = document.querySelector('#loginForm');
const username = document.querySelector('#username');
const password = document.querySelector('#password');

const errorBox = document.querySelector('#errorbox');

function showError(error) {
  errorBox.classList.remove("hidden");
  if(error.status === 401) {
    errorBox.textContent = "Invalid username or password";
  }
  else {
    errorBox.textContent = error;
  }
}

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  errorBox.classList.add("hidden");

  api.logIn(username.value, password.value).then(userData => {
    document.location = "./";
  }).catch((error) => {
    showError(error)
  });
});
