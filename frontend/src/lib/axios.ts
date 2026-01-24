/**
 * Axios HTTP Client Configuration
 * Central configuration for all HTTP requests with JWT authentication
 */

import axios from 'axios';

// Base URL from environment variables (fallback to localhost)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// LocalStorage key for JWT token
const TOKEN_KEY = 'auth_token';

// Create axios instance with default configuration
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30 seconds timeout (PHP-FPM can be slow under load)
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Helper functions for token management
export const setAuthToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const getAuthToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
};

export const removeAuthToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

// Request Interceptor - automatically add JWT token to all requests
apiClient.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        
        // Add Authorization header if token exists
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        console.log('📤 API Request:', config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Response Interceptor - handle responses and errors
apiClient.interceptors.response.use(
    (response) => {
        console.log('📥 API Response:', response.status, response.config.url);
        return response;
    },
    (error) => {
        if (error.response) {
            console.error('❌ Response Error:', error.response.status, error.response.data);
            
            // Handle 401 Unauthorized - redirect to login
            // BUT: Skip redirect if user is already on login page (failed login attempt)
            if (error.response.status === 401) {
                const isLoginEndpoint = error.config?.url?.includes('/login');
                const isAlreadyOnLoginPage = window.location.pathname === '/login';
                
                // Only redirect if:
                // - NOT a login attempt (user is authenticated but token expired)
                // - User is NOT already on login page
                if (!isLoginEndpoint && !isAlreadyOnLoginPage) {
                    removeAuthToken();
                    
                    // Save current URL to return after login
                    const currentPath = window.location.pathname + window.location.search;
                    sessionStorage.setItem('returnUrl', currentPath);
                    
                    window.location.href = '/login';
                    console.warn('⚠️ Unauthorized - redirecting to login');
                }
            }
        }
        else if (error.request) {
            console.error('❌ Network Error: No response received');
        }
        else {
            console.error('❌ Request Setup Error:', error.message);
        }
        
        return Promise.reject(error);
    }
);

export default apiClient;
