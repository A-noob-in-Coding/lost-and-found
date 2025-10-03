import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // Don't set Content-Type here - let the interceptor handle it
});

// Request interceptor to handle headers intelligently
API.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Set Content-Type based on request data
    if (config.data instanceof FormData) {
      // Let browser set Content-Type for FormData (includes boundary)
      // Don't manually set it - browser will add the boundary parameter
      delete config.headers['Content-Type'];
    } else {
      // For regular JSON requests
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
