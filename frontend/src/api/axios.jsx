import axios from 'axios';

const instance = axios.create({
  baseURL: '/api', // Use the relative URL to access the backend service using the service name 'backend'
  timeout: 5000, // in milliseconds
  withCredentials: true, // Fix typo: change 'withCredentialsl' to 'withCredentials'
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
