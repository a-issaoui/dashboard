// src/lib/services/auth.ts
import { api } from './api';
import type { LoginCredentials, RegisterData, User, AuthResult } from '@/types';

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResult> {
        try {
            const response = await api.post('/auth/login', credentials);
            return { success: true, ...response.data };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed',
            };
        }
    },

    async register(userData: RegisterData): Promise<AuthResult> {
        try {
            const response = await api.post('/auth/register', userData);
            return { success: true, ...response.data };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed',
            };
        }
    },

    async getProfile(): Promise<User> {
        const response = await api.get('/auth/me');
        return response.data.user;
    },

    async refreshToken(token: string): Promise<{ token: string; refreshToken: string }> {
        const response = await api.post('/auth/refresh', { token });
        return response.data;
    },

    async logout(): Promise<void> {
        await api.post('/auth/logout');
    },
};