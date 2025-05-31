// src/config/admin/navigations.ts
import { ROUTES } from './routes';
import type { NavigationItem } from '@/types';
import { type IconName } from '@/components/icons';

// Enhanced navigation structure with better group support and i18n keys
export const sidebarList: NavigationItem[] = [
    {
        id: 'dashboard',
        titleKey: 'navigation.dashboard',
        title: 'Dashboard', // Fallback for non-i18n setups
        url: ROUTES.DASHBOARD.path,
        icon: 'WindowsLogoIcon' as IconName,
        order: 1
    },
    {
        id: 'usersManagement',
        labelKey: 'navigation.usersManagement', // Used for group title key
        label: 'User Management',             // Fallback for group title
        icon: 'UsersIcon' as IconName,
        order: 2,
        items: [
            {
                id: 'usersManagement-usersList',
                titleKey: 'navigation.users',
                title: 'Users',
                url: ROUTES.USERS.path,
                icon: 'UsersIcon' as IconName,
                order: 1
            },
            {
                id: 'usersManagement-rolesPermissions',
                labelKey: 'navigation.rolesAndPermissions', // CHANGED from titleKey for consistency
                label: 'Roles & Permissions',             // CHANGED from title for consistency
                icon: 'ShieldIcon' as IconName,
                order: 2,
                items: [
                    {
                        id: 'usersManagement-rolesPermissions-roles',
                        titleKey: 'navigation.roles',
                        title: 'Roles',
                        url: ROUTES.ROLES.path,
                        order: 1
                    },
                    {
                        id: 'usersManagement-rolesPermissions-permissions',
                        titleKey: 'navigation.permissions',
                        title: 'Permissions',
                        url: ROUTES.PERMISSIONS.path,
                        order: 2
                    },
                ],
            },
        ]
    },
    {
        id: 'settings',
        labelKey: 'navigation.settingsGroup', // Used for group title key
        label: 'Settings',                   // Fallback for group title
        icon: 'GearIcon' as IconName,
        order: 3,
        items: [
            {
                id: 'settings-general',
                titleKey: 'navigation.generalSettings',
                title: 'General Settings',
                icon: 'GearIcon' as IconName,
                url: ROUTES.SETTINGS.path,
                order: 1
            },
        ]
    }
];

// Enhanced utility functions
export const findGroupForUrl = (url: string): NavigationItem | null => {
    const findInGroup = (group: NavigationItem): NavigationItem | null => {
        if (group.url === url) return group;

        if (group.items && group.items.length > 0) {
            for (const item of group.items) {
                if (item.url === url) return group;

                if (item.items && item.items.length > 0) {
                    const found = findInGroup(item);
                    if (found) return group;
                }
            }
        }
        return null;
    };

    for (const group of sidebarList) {
        const found = findInGroup(group);
        if (found) return found;
    }
    return null;
};

export const getItemPath = (url: string): NavigationItem[] | null => {
    const findPath = (items: NavigationItem[], targetUrl: string, currentPath: NavigationItem[] = []): NavigationItem[] | null => {
        for (const item of items) {
            const newPath = [...currentPath, item];

            if (item.url === targetUrl) {
                return newPath;
            }

            if (item.items && item.items.length > 0) {
                const found = findPath(item.items, targetUrl, newPath);
                if (found) return found;
            }
        }
        return null;
    };

    return findPath(sidebarList, url);
};

export interface BreadcrumbNavigation {
    path: NavigationItem[];
    group: NavigationItem | undefined;
    item: NavigationItem;
}

export const getBreadcrumbNavigation = (url: string): BreadcrumbNavigation | null => {
    const path = getItemPath(url);
    if (!path) return null;

    return {
        path,
        // This logic will now consistently find groups if they all use labelKey/label
        group: path.find(item => (item.labelKey || item.label) && !item.url),
        item: path[path.length - 1]
    };
};

export const sortNavigationItems = (items: NavigationItem[]): NavigationItem[] => {
    return items
        .sort((a, b) => (a.order || 999) - (b.order || 999))
        .map(item => ({
            ...item,
            items: item.items ? sortNavigationItems(item.items) : undefined
        }));
};

export interface FlattenedNavigationItem extends NavigationItem {
    level: number;
    isGroup: boolean;
    parentGroup: NavigationItem | null;
    hasChildren: boolean;
}

export const getFlattenedNavigation = (): FlattenedNavigationItem[] => {
    const flattened: FlattenedNavigationItem[] = [];

    const flatten = (items: NavigationItem[], level = 0, parentGroup: NavigationItem | null = null) => {
        items.forEach(item => {
            // This check now consistently identifies groups if they use labelKey/label
            const isGroup = !!(item.labelKey || item.label) && !item.url && item.items?.length > 0;
            const currentGroup = isGroup ? item : parentGroup;

            flattened.push({
                ...item,
                level,
                isGroup,
                parentGroup,
                hasChildren: !!(item.items && item.items.length > 0)
            });

            if (item.items && item.items.length > 0) {
                flatten(item.items, level + 1, currentGroup);
            }
        });
    };

    flatten(sidebarList);
    return flattened;
};