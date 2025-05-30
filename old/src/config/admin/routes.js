// dashboard/src/config/admin/routes.js
export const ROUTES = {
    HOME: {
        path: '/',
        title: 'Home',
        description: 'Main application landing page.',
        icon: 'Home'
    },
    LOGIN: {
        path: '/auth/login',
        title: 'Login',
        description: 'Access your account.',
        icon: 'SignIn'
    },
    DASHBOARD: {
        path: '/admin/dashboard',
        title: 'Dashboard Overview',
        description: 'Comprehensive overview of activities and key metrics.',
        icon: 'Dashboard'
    },
    PROFILE: {
        path: '/admin/profile',
        title: 'My Profile',
        description: 'View and manage your personal profile information.',
        icon: 'Profile'
    },
    USERS: {
        path: '/admin/users',
        title: 'User Management',
        description: 'Administer user accounts, roles, and permissions.',
        icon: 'Users'
    },
    ROLES: {
        path: '/admin/roles',
        title: 'Role Management',
        description: 'Define and manage user roles within the application.',
        icon: 'Shield'
    },
    PERMISSIONS: {
        path: '/admin/permissions',
        title: 'Permission Management',
        description: 'Configure permissions associated with different roles.',
        icon: 'Permission'
    },
    SETTINGS: {
        path: '/admin/settings',
        title: 'Application Settings',
        description: 'Adjust and configure global application settings.',
        icon: 'Settings'
    },
};

// Helper to quickly find a route config by its path
export const ROUTES_BY_PATH = Object.fromEntries(
    Object.values(ROUTES).map(route => [route.path, route])
);