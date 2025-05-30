export const APP_CONFIG = {
    NAME: 'Dashboard',
    VERSION: '1.0.0',
    DESCRIPTION: 'Modern multilingual admin dashboard built with Next.js 15',
    AUTHOR: 'Your Company',
    URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3180',
    API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
} as const;

export const SUPPORTED_LOCALES = [
    { code: 'en', name: 'English', flag: '🇺🇸', dir: 'ltr', enabled: true },
    { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr', enabled: true },
    { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl', enabled: true },
] as const;

export const DEFAULT_LOCALE = 'en' as const;

// ✅ Add missing getDirection function
export const getDirection = (locale: string): 'ltr' | 'rtl' => {
    const localeData = SUPPORTED_LOCALES.find(l => l.code === locale);
    return localeData?.dir || 'ltr';
};

// ✅ Add helper function for locale validation
export const isValidLocale = (locale: string): locale is typeof SUPPORTED_LOCALES[number]['code'] => {
    return SUPPORTED_LOCALES.some(l => l.code === locale);
};

export const BREAKPOINTS = {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1280,
    WIDE: 1536,
} as const;

export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth-token',
    REFRESH_TOKEN: 'refresh-token',
    LOCALE: 'NEXT_LOCALE',
    THEME: 'dashboard-theme',
    SIDEBAR_STATE: 'sidebar-state',
    USER_PREFERENCES: 'user-preferences',
} as const;

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        ME: '/auth/me',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
    },
    USERS: {
        LIST: '/users',
        CREATE: '/users',
        GET: (id: string) => `/users/${id}`,
        UPDATE: (id: string) => `/users/${id}`,
        DELETE: (id: string) => `/users/${id}`,
        BULK_DELETE: '/users/bulk-delete',
    },
    ROLES: {
        LIST: '/roles',
        CREATE: '/roles',
        GET: (id: string) => `/roles/${id}`,
        UPDATE: (id: string) => `/roles/${id}`,
        DELETE: (id: string) => `/roles/${id}`,
    },
    PERMISSIONS: {
        LIST: '/permissions',
        CREATE: '/permissions',
        GET: (id: string) => `/permissions/${id}`,
        UPDATE: (id: string) => `/permissions/${id}`,
        DELETE: (id: string) => `/permissions/${id}`,
    },
} as const;

export const ROUTES = {
    HOME: '/',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    ROLES: '/admin/roles',
    PERMISSIONS: '/admin/permissions',
    SETTINGS: '/admin/settings',
    PROFILE: '/admin/profile',
} as const;

export const THEME_CONFIG = {
    THEMES: ['light', 'dark', 'system'] as const,
    DEFAULT: 'system' as const,
    STORAGE_KEY: STORAGE_KEYS.THEME,
    ANIMATIONS: {
        FAST: 150,
        NORMAL: 300,
        SLOW: 500,
    },
} as const;

export const VALIDATION_RULES = {
    PASSWORD: {
        MIN_LENGTH: 8,
        MAX_LENGTH: 128,
        REQUIRE_UPPERCASE: true,
        REQUIRE_LOWERCASE: true,
        REQUIRE_NUMBERS: true,
        REQUIRE_SYMBOLS: true,
    },
    EMAIL: {
        MAX_LENGTH: 254,
    },
    NAME: {
        MIN_LENGTH: 2,
        MAX_LENGTH: 50,
    },
} as const;