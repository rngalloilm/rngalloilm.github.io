import axios from 'axios';

//const URL = 'http://localhost:3000';
const URL = 'https://localhost/api/';

const instance = axios.create({
  baseURL: URL,
});

export {instance};