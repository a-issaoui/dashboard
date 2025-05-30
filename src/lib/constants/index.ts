// src/lib/constants/index.ts
export const APP_CONFIG = {
    NAME: 'Admin Dashboard',
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

export const getDirection = (locale: string): 'ltr' | 'rtl' => {
    const localeData = SUPPORTED_LOCALES.find(l => l.code === locale);
    return localeData?.dir || 'ltr';
};

export const isValidLocale = (locale: string): locale is typeof SUPPORTED_LOCALES[number]['code'] => {
    return SUPPORTED_LOCALES.some(l => l.code === locale);
};

export const ROUTES = {
    HOME: { path: '/', titleKey: 'common.home', icon: 'Home' as const },
    DASHBOARD: { path: '/admin/dashboard', titleKey: 'navigation.dashboard', icon: 'Dashboard' as const },
    USERS: { path: '/admin/users', titleKey: 'navigation.users', icon: 'Users' as const },
    ROLES: { path: '/admin/roles', titleKey: 'navigation.roles', icon: 'Shield' as const },
    PERMISSIONS: { path: '/admin/permissions', titleKey: 'navigation.permissions', icon: 'Permission' as const },
    SETTINGS: { path: '/admin/settings', titleKey: 'navigation.settings', icon: 'Settings' as const },
    LOGIN: { path: '/auth/login', titleKey: 'auth.signIn', icon: 'SignIn' as const },
} as const;

export const ROUTES_BY_PATH = Object.fromEntries(
    Object.values(ROUTES).map(route => [route.path, route])
);

export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth-token',
    REFRESH_TOKEN: 'refresh-token',
    LOCALE: 'NEXT_LOCALE',
    THEME: 'dashboard-theme',
    SIDEBAR_STATE: 'sidebar-state',
} as const;

export const BREAKPOINTS = {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1280,
    WIDE: 1536,
} as const;