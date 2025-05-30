// src/config/admin/navigation-items.ts
import type { NavigationItem } from '@/types';

export const navigationItems: NavigationItem[] = [
    {
        id: 'dashboard',
        titleKey: 'navigation.dashboard',
        title: 'Dashboard',
        url: '/admin/dashboard',
        icon: 'Dashboard',
        order: 1
    },
    {
        id: 'users',
        titleKey: 'navigation.users',
        title: 'Users',
        url: '/admin/users',
        icon: 'Users',
        order: 2
    },
    {
        id: 'roles',
        titleKey: 'navigation.roles',
        title: 'Roles',
        url: '/admin/roles',
        icon: 'Shield',
        order: 3
    },
    {
        id: 'permissions',
        titleKey: 'navigation.permissions',
        title: 'Permissions',
        url: '/admin/permissions',
        icon: 'Permission',
        order: 4
    },
    {
        id: 'settings',
        titleKey: 'navigation.settings',
        title: 'Settings',
        url: '/admin/settings',
        icon: 'Settings',
        order: 5
    },
];

export const getNavigationByPath = (path: string): NavigationItem | undefined => {
    return navigationItems.find(item => item.url === path);
};

export const getNavigationById = (id: string): NavigationItem | undefined => {
    return navigationItems.find(item => item.id === id);
};