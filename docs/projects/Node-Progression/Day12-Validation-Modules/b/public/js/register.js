import validateForm from './formValidation.js';

const form = document.querySelector('form');
form.addEventListener('submit', validateForm);
