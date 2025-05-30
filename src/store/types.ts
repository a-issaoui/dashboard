// src/store/types.ts - Shared store types (optional file for better organization)

// Re-export commonly used store types
export type { LocaleStore, AuthStore, ThemeStore, NotificationStore } from './index';

// Utility types for store actions
export type StoreActions<T> = {
    [K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? T[K] : never;
};

export type StoreState<T> = {
    [K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? never : T[K];
};

// Common store patterns
export interface BaseStoreState {
    isLoading?: boolean;
    error?: string | null;
}

export interface AsyncStoreActions {
    clearError: () => void;
}

// Store initialization helpers
export interface StoreInitializer {
    initializeStore: () => void | Promise<void>;
}