// src/lib/services/api.ts
import axios from 'axios';
import { APP_CONFIG, STORAGE_KEYS } from '@/lib/constants';

const api = axios.create({
    baseURL: APP_CONFIG.API_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
    async (config) => {
        const { getCookie } = await import('cookies-next');
        const token = getCookie(STORAGE_KEYS.AUTH_TOKEN);
        const locale = getCookie(STORAGE_KEYS.LOCALE);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (locale) {
            config.headers['Accept-Language'] = locale;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401 && typeof window !== 'undefined') {
            const { deleteCookie } = await import('cookies-next');
            deleteCookie(STORAGE_KEYS.AUTH_TOKEN);
            window.location.href = '/auth/login';
        }
        return Promise.reject(error);
    }
);

export { api };