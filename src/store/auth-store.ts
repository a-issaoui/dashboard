// src/store/auth-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/lib/services/auth';
import { STORAGE_KEYS } from '@/lib/constants';
import type { User, LoginCredentials, RegisterData, AuthResult } from '@/types';

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
}

interface AuthActions {
    login: (credentials: LoginCredentials) => Promise<AuthResult>;
    register: (userData: RegisterData) => Promise<AuthResult>;
    logout: () => void;
    clearError: () => void;
    initializeAuth: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isLoading: false,
            isAuthenticated: false,
            error: null,

            login: async (credentials) => {
                set({ isLoading: true, error: null });

                const result = await authService.login(credentials);

                if (result.success) {
                    set({
                        user: result.user!,
                        token: result.token!,
                        isAuthenticated: true,
                        isLoading: false,
                    });

                    // Set cookie
                    const { setCookie } = await import('cookies-next');
                    await setCookie(STORAGE_KEYS.AUTH_TOKEN, result.token!, {
                        maxAge: credentials.rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24,
                        path: '/',
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'lax',
                    });
                } else {
                    set({ isLoading: false, error: result.error! });
                }

                return result;
            },

            register: async (userData) => {
                set({ isLoading: true, error: null });

                const result = await authService.register(userData);

                if (result.success) {
                    set({
                        user: result.user!,
                        token: result.token!,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } else {
                    set({ isLoading: false, error: result.error! });
                }

                return result;
            },

            logout: () => {
                authService.logout().catch(console.error);

                // Clear cookie
                import('cookies-next').then(({ deleteCookie }) => {
                    deleteCookie(STORAGE_KEYS.AUTH_TOKEN);
                });

                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    error: null,
                });
            },

            clearError: () => set({ error: null }),

            initializeAuth: async () => {
                const { getCookie } = await import('cookies-next');
                const token = getCookie(STORAGE_KEYS.AUTH_TOKEN);

                if (!token) return;

                try {
                    const user = await authService.getProfile();
                    set({ user, token, isAuthenticated: true });
                } catch (error) {
                    get().logout();
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                user: state.user,
            }),
        }
    )
);

// Convenience selector
export const useAuth = () => useAuthStore(state => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login: state.login,
    logout: state.logout,
    register: state.register,
    clearError: state.clearError,
}));