// src/api/axiosClient.ts

import axios from 'axios';

// Determine the Base URL: Use environment variable for production/deployment, 
// defaulting to local development port 5000.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create the Axios instance
const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach the Authorization Header
axiosClient.interceptors.request.use(async (config) => {
    // Retrieve the user object from local storage (where AuthContext stores the token)
    const storedUser = localStorage.getItem('mystere-meal-user');

    if (storedUser) {
        try {
            const user = JSON.parse(storedUser);
            // If token exists, format and attach it as a Bearer token
            if (user?.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
        } catch (error) {
            console.error("Error parsing auth token:", error);
        }
    }

    return config;
});

export default axiosClient;