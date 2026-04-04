/**
 * Axios HTTP Client Configuration
 * Central configuration for all HTTP requests with JWT authentication
 */

import axios from 'axios';
import { queueApiMutationFromAxios } from './offlineQueue';

const normalizeApiBaseUrl = (rawUrl?: string): string => {
    const fallback = 'http://localhost:8000/api';
    if (!rawUrl || typeof rawUrl !== 'string') {
        return fallback;
    }

    const trimmed = rawUrl.trim().replace(/\/+$/, '');

    // In local preview mode (/api on :4173/:5173), there is no dev proxy.
    // Route API directly to backend on :8000.
    if (trimmed.startsWith('/')) {
        const isLocalHost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
        const isLocalPreviewPort = ['4173', '4174', '5173', '5174'].includes(window.location.port);
        if (isLocalHost && isLocalPreviewPort) {
            return `http://${window.location.hostname}:8000${trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`}`;
        }

        const sameOriginBase = `${window.location.origin}${trimmed}`;
        return sameOriginBase.endsWith('/api') ? sameOriginBase : `${sameOriginBase}/api`;
    }

    if (trimmed.endsWith('/api')) {
        return trimmed;
    }

    return `${trimmed}/api`;
};

// Base URL from environment variables with safety normalization.
const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);

console.log('🌐 API base URL:', API_BASE_URL);

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
    async (error) => {
        if (error.response) {
            console.error('❌ Response Error:', error.response.status, error.response.data);
            
            // Handle 401 Unauthorized - redirect to login
            // BUT: Skip redirect if user is already on login page (failed login attempt)
            if (error.response.status === 401) {
                const isLoginEndpoint = error.config?.url?.includes('/login');
                const isAlreadyOnLoginPage = window.location.pathname === '/login';
                const isOffline = navigator.onLine === false;
                
                // Only redirect if:
                // - NOT a login attempt (user is authenticated but token expired)
                // - User is NOT already on login page
                // - Browser is online (network glitches while offline must not log out user)
                if (!isLoginEndpoint && !isAlreadyOnLoginPage && !isOffline) {
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

            const method = (error.config?.method || '').toUpperCase();
            const url = error.config?.url || '';
            const data = error.config?.data;
            const isOffline = navigator.onLine === false;
            const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
            const isAuthEndpoint = typeof url === 'string' && (
                url.includes('/login')
                || url.includes('/refresh')
                || url.includes('/me/password')
            );
            const isNetworkCode = error.code === 'ERR_NETWORK';
            const isTimeoutCode = error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT';
            const hasFormDataBody = typeof FormData !== 'undefined' && data instanceof FormData;
            const shouldQueueAsOffline = isOffline || isNetworkCode || isTimeoutCode;

            if (shouldQueueAsOffline && isMutation && !isAuthEndpoint && !hasFormDataBody) {
                try {
                    const authHeader =
                        error.config?.headers?.Authorization
                        || error.config?.headers?.authorization
                        || (getAuthToken() ? `Bearer ${getAuthToken()}` : undefined);

                    await queueApiMutationFromAxios(
                        url,
                        method,
                        data,
                        authHeader,
                    );

                    return Promise.resolve({
                        data: {
                            queued: true,
                            offline: true,
                            message: 'Request queued offline. It will be synced automatically.',
                        },
                        status: 202,
                        statusText: 'Accepted',
                        headers: {},
                        config: error.config,
                        request: error.request,
                    });
                } catch (queueError) {
                    console.error('❌ Failed to enqueue offline request:', queueError);
                }
            }
        }
        else {
            console.error('❌ Request Setup Error:', error.message);
        }
        
        return Promise.reject(error);
    }
);

export default apiClient;
