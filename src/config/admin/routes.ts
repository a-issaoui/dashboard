// src/config/admin/routes.ts
import { type IconName } from '@/components/icons'; // Or your actual path

export interface RouteConfig {
    path: string;
    title: string;
    titleKey?: string;
    description?: string;
    icon?: IconName;
    requiresAuth?: boolean;
    roles?: readonly string[]; // Changed to readonly string[]
}

export const ROUTES = {
    HOME: {
        path: '/',
        title: 'Home',
        titleKey: 'common.home',
        description: 'Main application landing page.',
        icon: 'HouseLineIcon' as IconName,
    },
    LOGIN: {
        path: '/auth/login',
        title: 'Login',
        titleKey: 'auth.signIn',
        description: 'Access your account.',
        icon: 'SignInIcon' as IconName,
    },
    DASHBOARD: {
        path: '/admin/dashboard',
        title: 'Dashboard Overview',
        titleKey: 'navigation.dashboard',
        description: 'Comprehensive overview of activities and key metrics.',
        icon: 'WindowsLogoIcon' as IconName, // Ensure this and other icon names are correct per Phosphor exports
        requiresAuth: true,
    },
    PROFILE: {
        path: '/admin/profile',
        title: 'My Profile',
        titleKey: 'navigation.profile',
        description: 'View and manage your personal profile information.',
        icon: 'UserIcon' as IconName,
        requiresAuth: true,
    },
    USERS: {
        path: '/admin/users',
        title: 'User Management',
        titleKey: 'navigation.users',
        description: 'Administer user accounts, roles, and permissions.',
        icon: 'UsersIcon' as IconName,
        requiresAuth: true,
        roles: ['Admin', 'Editor'], // This will now correctly be inferred as readonly string[]
    },
    ROLES: {
        path: '/admin/roles',
        title: 'Role Management',
        titleKey: 'navigation.roles',
        description: 'Define and manage user roles within the application.',
        icon: 'ShieldIcon' as IconName,
        requiresAuth: true,
        roles: ['Admin'],
    },
    PERMISSIONS: {
        path: '/admin/permissions',
        title: 'Permission Management',
        titleKey: 'navigation.permissions',
        description: 'Configure permissions associated with different roles.',
        icon: 'ShieldStarIcon' as IconName,
        requiresAuth: true,
        roles: ['Admin'],
    },
    SETTINGS: {
        path: '/admin/settings',
        title: 'Application Settings',
        titleKey: 'navigation.settings',
        description: 'Adjust and configure global application settings.',
        icon: 'GearIcon' as IconName,
        requiresAuth: true,
        roles: ['Admin'],
    },
} as const;

// Create a map for quick lookups
export const ROUTES_BY_PATH: Record<string, RouteConfig> = Object.fromEntries(
    Object.values(ROUTES).map(route => [route.path, route])
);

// Type helpers
export type RoutePath = typeof ROUTES[keyof typeof ROUTES]['path'];
export type RouteKey = keyof typeof ROUTES;