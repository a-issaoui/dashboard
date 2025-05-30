// src/store/auth-store.ts - Authentication management
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import type { User, LoginCredentials, RegisterData, AuthResult } from '@/types';
import type { AuthState } from './interfaces';
import { STORAGE_KEYS } from '@/lib/constants';

interface AuthActions {
    login: (credentials: LoginCredentials) => Promise<AuthResult>;
    register: (userData: RegisterData) => Promise<AuthResult>;
    logout: () => void;
    refreshSession: () => Promise<void>;
    updateProfile: (profileData: Partial<User>) => Promise<AuthResult>;
    checkSession: () => boolean;
    updateLastActivity: () => void;
    initializeAuth: () => void;
}



// Constants
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes before expiry

// Utility functions
const getCookie = async (name: string): Promise<string | null> => {
    try {
        const { getCookie: getCookieUtil } = await import('cookies-next');
        const value = getCookieUtil(name);
        return typeof value === 'string' ? value : null;
    } catch (error) {
        console.error(`Failed to get cookie ${name}:`, error);
        return null;
    }
};

const setCookie = async (name: string, value: string, options: Record<string, unknown> = {}) => {
    try {
        const { setCookie: setCookieUtil } = await import('cookies-next');
        setCookieUtil(name, value, {
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            httpOnly: false,
            ...options,
        });
    } catch (error) {
        console.error(`Failed to set cookie ${name}:`, error);
    }
};

const deleteCookie = async (name: string) => {
    try {
        const { deleteCookie: deleteCookieUtil } = await import('cookies-next');
        deleteCookieUtil(name, { path: '/' });
    } catch (error) {
        console.error(`Failed to delete cookie ${name}:`, error);
    }
};

// Create API client
const createApiClient = () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const axios = require('axios');
    return axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
        headers: {
            'Content-Type': 'application/json',
        },
        timeout: 10000,
    });
};

export const useAuthStore = create<AuthStore>()(
    devtools(
        persist(
            (set, get) => ({
                // State
                user: null,
                token: null,
                refreshToken: null,
                isLoading: false,
                isAuthenticated: false,
                lastActivity: null,
                sessionExpiry: null,
                error: null,

                // Actions
                login: async (credentials: LoginCredentials): Promise<AuthResult> => {
                    set({ isLoading: true, error: null });

                    try {
                        const api = createApiClient();
                        const response = await api.post('/auth/login', credentials);
                        const { user, token, refreshToken } = response.data;

                        // Set cookies
                        const maxAge = credentials.rememberMe ?
                            60 * 60 * 24 * 30 : // 30 days
                            60 * 60 * 24; // 1 day

                        await setCookie(STORAGE_KEYS.AUTH_TOKEN, token, { maxAge });
                        if (refreshToken) {
                            await setCookie(STORAGE_KEYS.REFRESH_TOKEN, refreshToken, { maxAge });
                        }

                        const now = Date.now();
                        set({
                            user,
                            token,
                            refreshToken,
                            isLoading: false,
                            isAuthenticated: true,
                            lastActivity: now,
                            sessionExpiry: now + SESSION_TIMEOUT,
                        });

                        return { success: true, user };
                    } catch (error: unknown) {
                        console.error('Login failed:', error);
                        set({ isLoading: false });
                        const errorMessage = error instanceof Error ?
                            error.message :
                            (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Login failed';
                        return {
                            success: false,
                            error: errorMessage,
                        };
                    }
                },

                register: async (userData: RegisterData): Promise<AuthResult> => {
                    set({ isLoading: true });

                    try {
                        const api = createApiClient();
                        const response = await api.post('/auth/register', userData);
                        const { user, token, refreshToken } = response.data;

                        await setCookie(STORAGE_KEYS.AUTH_TOKEN, token);
                        if (refreshToken) {
                            await setCookie(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
                        }

                        const now = Date.now();
                        set({
                            user,
                            token,
                            refreshToken,
                            isLoading: false,
                            isAuthenticated: true,
                            lastActivity: now,
                            sessionExpiry: now + SESSION_TIMEOUT,
                        });

                        return { success: true, user };
                    } catch (error: unknown) {
                        console.error('Registration failed:', error);
                        set({ isLoading: false });
                        const errorMessage = error instanceof Error ?
                            error.message :
                            (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed';
                        return {
                            success: false,
                            error: errorMessage,
                        };
                    }
                },

                logout: () => {
                    deleteCookie(STORAGE_KEYS.AUTH_TOKEN);
                    deleteCookie(STORAGE_KEYS.REFRESH_TOKEN);

                    set({
                        user: null,
                        token: null,
                        refreshToken: null,
                        isAuthenticated: false,
                        isLoading: false,
                        lastActivity: null,
                        sessionExpiry: null,
                    });
                },

                refreshSession: async (): Promise<void> => {
                    const { refreshToken } = get();
                    if (!refreshToken) {
                        throw new Error('No refresh token available');
                    }

                    try {
                        const api = createApiClient();
                        const response = await api.post('/auth/refresh', { refreshToken });
                        const { token: newToken, refreshToken: newRefreshToken } = response.data;

                        await setCookie(STORAGE_KEYS.AUTH_TOKEN, newToken);
                        if (newRefreshToken) {
                            await setCookie(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
                        }

                        const now = Date.now();
                        set({
                            token: newToken,
                            refreshToken: newRefreshToken,
                            lastActivity: now,
                            sessionExpiry: now + SESSION_TIMEOUT,
                        });
                    } catch (error) {
                        console.error('Session refresh failed:', error);
                        get().logout();
                        throw error;
                    }
                },

                updateProfile: async (profileData: Partial<User>): Promise<AuthResult> => {
                    const { user } = get();
                    if (!user) {
                        return { success: false, error: 'Not authenticated' };
                    }

                    set({ isLoading: true });

                    try {
                        const api = createApiClient();
                        const response = await api.put('/auth/profile', profileData);
                        const updatedUser = response.data.user;

                        set({
                            user: updatedUser,
                            isLoading: false,
                        });

                        return { success: true, user: updatedUser };
                    } catch (error: unknown) {
                        console.error('Profile update failed:', error);
                        set({ isLoading: false });
                        const errorMessage = error instanceof Error ?
                            error.message :
                            (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Profile update failed';
                        return {
                            success: false,
                            error: errorMessage,
                        };
                    }
                },

                checkSession: (): boolean => {
                    const { sessionExpiry, lastActivity } = get();
                    if (!sessionExpiry || !lastActivity) return false;

                    const now = Date.now();
                    const isExpired = now > sessionExpiry;

                    if (isExpired) {
                        get().logout();
                        return false;
                    }

                    // Check if refresh is needed
                    const timeUntilExpiry = sessionExpiry - now;
                    if (timeUntilExpiry < REFRESH_THRESHOLD) {
                        get().refreshSession().catch(() => {
                            // Refresh failed, will be handled in refreshSession
                        });
                    }

                    return true;
                },

                updateLastActivity: () => {
                    const now = Date.now();
                    set({
                        lastActivity: now,
                        sessionExpiry: now + SESSION_TIMEOUT,
                    });
                },

                initializeAuth: async () => {
                    const token = await getCookie(STORAGE_KEYS.AUTH_TOKEN);
                    const refreshToken = await getCookie(STORAGE_KEYS.REFRESH_TOKEN);

                    if (token) {
                        try {
                            const api = createApiClient();
                            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                            const response = await api.get('/auth/me');
                            const user = response.data.user;

                            const now = Date.now();
                            set({
                                user,
                                token,
                                refreshToken,
                                isAuthenticated: true,
                                lastActivity: now,
                                sessionExpiry: now + SESSION_TIMEOUT,
                            });
                        } catch (error) {
                            console.error('Auth initialization failed:', error);
                            get().logout();
                        }
                    }
                },
            }),
            {
                name: 'auth-storage',
                storage: createJSONStorage(() => localStorage),
                partialize: (state) => ({
                    token: state.token,
                    isAuthenticated: state.isAuthenticated,
                    user: state.user,
                }),
            }
        ),
        {
            name: 'auth-store',
        }
    )
);

export type AuthStore = AuthState & AuthActions;

// Convenient auth selector
export const useAuth = () => useAuthStore(state => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    login: state.login,
    logout: state.logout,
    register: state.register,
    updateProfile: state.updateProfile,
}));

// Initialize on client
if (typeof window !== 'undefined') {
    useAuthStore.getState().initializeAuth();
}