// src/store/index.ts - Central store exports and re-exports
export {
    useLocaleStore,
    setSsrInitialState,
    useCurrentLocale,
    useDirection,
    useIsRTL,
    useLocaleError,
    useIsChangingLocale,
} from './locale-store';

export {
    useAuthStore,
    useAuth,
} from './auth-store';

export {
    useThemeStore,
    useTheme,
} from './theme-store';

export {
    useNotificationStore,
    useNotifications,
} from './notification-store';

// Export store types for external use
export type { LocaleStore } from './locale-store';
export type { AuthStore } from './auth-store';
export type { ThemeStore } from './theme-store';
export type { NotificationStore } from './notification-store';