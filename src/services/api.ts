
import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'https://api.muscle-garage-evolve.com/api', // Replace with your actual backend URL
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  response => response,
  error => {
    const { response } = error;
    
    // Handle token expiration - redirect to login
    if (response && response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;
