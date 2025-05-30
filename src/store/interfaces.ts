// src/store/interfaces.ts - Store-specific interfaces and types

// Auth Store Types (extend your existing AuthState if it doesn't have error)
export interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    lastActivity: number | null;
    sessionExpiry: number | null;
    error: string | null; // Added missing error property
}

// Locale Store Types
export interface LocaleState {
    locale: string;
    direction: 'ltr' | 'rtl';
    isChanging: boolean;
    error: string | null;
}

// Theme Store Types
export interface ThemeState {
    mode: 'light' | 'dark' | 'system';
    resolvedTheme: 'light' | 'dark';
}

// Notification Store Types
export interface NotificationItem {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    priority?: 'low' | 'medium' | 'high';
    read: boolean;
    time: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

// Common interfaces (if not already defined elsewhere)
export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    // Add other registration fields as needed
}

export interface AuthResult {
    success: boolean;
    user?: User;
    error?: string;
}

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    // Add other user properties as needed
}

export interface Locale {
    code: string;
    name: string;
    dir: 'ltr' | 'rtl';
    flag?: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';