// src/store/authStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import api from '@/lib/api';

const AUTH_TOKEN_COOKIE = 'auth-token';

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: getCookie(AUTH_TOKEN_COOKIE) || null, // Initialize token from cookie
            isLoading: false,
            isAuthenticated: !!getCookie(AUTH_TOKEN_COOKIE), // Initial auth state from cookie

            login: async (credentials) => {
                set({ isLoading: true });
                try {
                    const response = await api.post('/auth/login', credentials); // Adjust endpoint as needed
                    const { user, token } = response.data; // Assuming API returns user and token

                    setCookie(AUTH_TOKEN_COOKIE, token, {
                        path: '/',
                        maxAge: credentials.rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 1, // 30 days or 1 day
                        sameSite: 'lax',
                        // secure: process.env.NODE_ENV === 'production',
                    });

                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Update axios default header
                    set({ user, token, isLoading: false, isAuthenticated: true });
                    return { success: true, user };
                } catch (error) {
                    console.error('Login failed:', error.response?.data || error.message);
                    set({ isLoading: false });
                    return {
                        success: false,
                        error: error.response?.data?.message || 'Login failed. Please check your credentials.',
                    };
                }
            },

            register: async (userData) => {
                set({ isLoading: true });
                try {
                    const response = await api.post('/auth/register', userData); // Adjust endpoint
                    const { user, token } = response.data;

                    setCookie(AUTH_TOKEN_COOKIE, token, {
                        path: '/',
                        maxAge: 60 * 60 * 24 * 1, // 1 day
                        sameSite: 'lax',
                        // secure: process.env.NODE_ENV === 'production',
                    });
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    set({ user, token, isLoading: false, isAuthenticated: true });
                    return { success: true, user };
                } catch (error) {
                    console.error('Registration failed:', error.response?.data || error.message);
                    set({ isLoading: false });
                    return {
                        success: false,
                        error: error.response?.data?.message || 'Registration failed.',
                    };
                }
            },

            logout: () => {
                deleteCookie(AUTH_TOKEN_COOKIE, { path: '/' });
                delete api.defaults.headers.common['Authorization'];
                set({ user: null, token: null, isAuthenticated: false, isLoading: false });
                // Optionally redirect: window.location.href = '/auth/login';
            },

            fetchUserProfile: async () => {
                if (!get().isAuthenticated) return; // Don't fetch if not authenticated
                set({ isLoading: true });
                try {
                    const response = await api.get('/auth/me'); // Endpoint to get current user
                    set({ user: response.data.user, isLoading: false });
                    return { success: true, user: response.data.user };
                } catch (error) {
                    console.error('Failed to fetch user profile:', error);
                    // If fetching profile fails (e.g. token expired server-side), log out
                    if (error.response?.status === 401) {
                        get().logout();
                    } else {
                        set({ isLoading: false });
                    }
                    return { success: false, error: 'Failed to fetch profile.' };
                }
            },

            updateProfile: async (profileData) => {
                set({ isLoading: true });
                try {
                    const response = await api.put('/auth/profile', profileData); // Adjust endpoint
                    set({ user: response.data.user, isLoading: false });
                    return { success: true, user: response.data.user };
                } catch (error) {
                    console.error('Profile update failed:', error.response?.data || error.message);
                    set({ isLoading: false });
                    return {
                        success: false,
                        error: error.response?.data?.message || 'Profile update failed.',
                    };
                }
            },
            // Action to initialize state from cookies, useful for SSR/initial load
            initializeAuth: () => {
                const token = getCookie(AUTH_TOKEN_COOKIE);
                if (token) {
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    set({ token, isAuthenticated: true });
                    // Fetch user profile to get user data
                    get().fetchUserProfile();
                }
            }
        }),
        {
            name: 'auth-storage', // Name for localStorage persistence
            storage: createJSONStorage(() => localStorage), // Use localStorage
            partialize: (state) => ({ token: state.token, isAuthenticated: state.isAuthenticated, user: state.user }), // Persist only token and auth status, user if needed
            onRehydrate: (state) => {
                // This function is called when the store is rehydrated from localStorage
                // We need to ensure the axios header is set correctly on rehydration
                if (state.token) {
                    api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
                }
            },
        }
    )
);

// Call initializeAuth when the store is created/loaded in the client
if (typeof window !== 'undefined') {
    useAuthStore.getState().initializeAuth();
}