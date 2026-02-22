/**
 * API Client Configuration
 * Base axios instance with interceptors for all API calls
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
export const isMockMode = () => import.meta.env.VITE_USE_MOCKS === 'true' || !import.meta.env.VITE_API_BASE_URL;

/**
 * Create and configure the API client
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor
 * Add auth token and handle request formatting
 */
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor
 * Handle responses and normalize errors
 */
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const normalizedError = {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'An error occurred',
      status: error.response?.status || 500,
      details: error.response?.data || {},
    };

    // Handle specific error codes
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }

    return Promise.reject(normalizedError);
  }
);

export default apiClient;
