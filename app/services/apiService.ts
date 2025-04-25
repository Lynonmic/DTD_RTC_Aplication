import axios from 'axios';
import { auth } from '../config/firebase';

// Use the production API URL with the /v1 prefix included
 const API_BASE_URL = 'https://xdpmweb.onrender.com/v1';
// const API_BASE_URL = 'https://testing-64cp.onrender.com/v1';

console.log('API Base URL:', API_BASE_URL); // Log the API URL for debugging

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercept requests to add auth token
api.interceptors.request.use(async (config) => {
  if (auth.currentUser) {
    const token = await auth.currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      console.warn('Authentication token expired or invalid');
      
      // Clear token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// Check if the token is expired - using Firebase's built-in token management
export const isTokenExpired = async (): Promise<boolean> => {
  if (!auth.currentUser) {
    return true;
  }
  
  try {
    // Force refresh will return true if token is still valid
    await auth.currentUser.getIdToken(true);
    return false;
  } catch (error) {
    console.error('Token refresh error:', error);
    return true;
  }
};

// Get the auth token from Firebase
export const getAuthToken = async (): Promise<string | null> => {
  if (!auth.currentUser) {
    return null;
  }
  
  try {
    return await auth.currentUser.getIdToken();
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

export default api;
