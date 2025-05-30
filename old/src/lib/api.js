// src/lib/api.js
import axios from 'axios';
import { getCookie, deleteCookie } from 'cookies-next';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api', // Ensure this is in your .env.local
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
});

// Request interceptor to add auth token and locale
api.interceptors.request.use(
    (config) => {
        const token = getCookie('auth-token'); // Ensure 'auth-token' is used consistently
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        const locale = getCookie('NEXT_LOCALE') || 'en'; // Use 'NEXT_LOCALE'
        config.headers['Accept-Language'] = locale;

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            // Potential: Implement token refresh logic here if your API supports it.
            // For now, we'll redirect to login.
            console.error("Authentication error: ", error.response.data);
            deleteCookie('auth-token');
            // Avoid redirecting if already on a public page like /auth/login
            if (window.location.pathname !== '/auth/login' && !window.location.pathname.startsWith('/auth')) {
                window.location.href = '/auth/login'; // Or your login route
            }
        }
        return Promise.reject(error);
    }
);

export default api;