import { type IconName } from '@/components/icons';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    subrole?: string;
    status: UserStatus;
    imageUrl?: string;
    avatar?: string;
    joinDate?: string;
    lastLogin?: string;
    permissions?: string[];
}

export type UserRole = 'Admin' | 'Editor' | 'User' | 'Viewer';
export type UserStatus = 'Active' | 'Inactive' | 'Pending' | 'Suspended';

export interface NavigationItem {
    id: string;
    titleKey?: string;
    title?: string;
    labelKey?: string;
    label?: string;
    url?: string;
    icon?: IconName; // Changed from string to IconName
    order?: number;
    items?: NavigationItem[];
    badge?: string | number;
    disabled?: boolean;
}

export interface Locale {
    code: string;
    name: string;
    flag: string;
    dir: 'ltr' | 'rtl';
    enabled?: boolean;
}

export interface BreadcrumbItem {
    title: string;
    link?: string | null;
    icon?: string | null;
    isGroup?: boolean;
    isLast?: boolean;
    isHome?: boolean;
    isDynamic?: boolean;
}

export interface NotificationItem {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    icon: string;
    priority: 'high' | 'normal' | 'low';
    type: 'security' | 'system' | 'general' | 'comment';
    actionUrl?: string;
    actions?: NotificationAction[];
}

export interface NotificationAction {
    label: string;
    action: string;
    variant?: 'default' | 'destructive';
}

// API Types - Fixed: replaced any with unknown
export interface ApiResponse<T = unknown> {
    data: T;
    message?: string;
    success: boolean;
    meta?: {
        total?: number;
        page?: number;
        limit?: number;
        hasNext?: boolean;
        hasPrev?: boolean;
    };
}

export interface ApiError {
    message: string;
    status: number;
    code?: string;
    details?: unknown; // ✅ Fixed: unknown instead of any
    field?: string;
}

// Auth Types
export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface AuthResult {
    success: boolean;
    user?: User;
    token?: string;
    refreshToken?: string;
    error?: string;
    message?: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    lastActivity: number | null;
    sessionExpiry: number | null;
}

// Locale Store Types
export interface LocaleState {
    locale: string;
    direction: 'ltr' | 'rtl';
    isChanging: boolean;
    error: string | null;
}

// Theme Types
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeState {
    mode: ThemeMode;
    resolvedTheme: 'light' | 'dark';
}

// Component Props Types
export interface BaseComponentProps {
    className?: string;
    children?: React.ReactNode;
}

export interface WithLoading {
    isLoading?: boolean;
}

export interface WithError {
    error?: string | null;
}

// Form Types
export interface FormFieldProps {
    name: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    description?: string;
}