import axios from 'axios';

// Check if we are running locally (development)
const isLocal = window.location.hostname === 'localhost';

const api = axios.create({
  // Use localhost if developing, otherwise use the production URL
  baseURL: isLocal ? 'http://localhost:5000/api' : 'https://ebanitech-v788.onrender.com/api',
});

// Interceptor to automatically add the Authorization token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle common errors (e.g., 401 logout)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optional: Clear token and navigate to login on unauthorized
    }
    return Promise.reject(error);
  }
);

export default api;
