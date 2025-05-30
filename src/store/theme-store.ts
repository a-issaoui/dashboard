// src/store/theme-store.ts - Theme management
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import type { ThemeMode } from '@/types';
import type { ThemeState } from './interfaces';
import { THEME_CONFIG } from '@/lib/constants';

interface ThemeActions {
    setTheme: (theme: ThemeMode) => void;
    toggleTheme: () => void;
    initializeTheme: () => void;
}



const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const updateDocumentTheme = (theme: 'light' | 'dark') => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.setAttribute('data-theme', theme);
};

export const useThemeStore = create<ThemeStore>()(
    devtools(
        persist(
            (set, get) => ({
                // State
                mode: THEME_CONFIG.DEFAULT,
                resolvedTheme: 'light',

                // Actions
                setTheme: (theme: ThemeMode) => {
                    const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;

                    set({ mode: theme, resolvedTheme });
                    updateDocumentTheme(resolvedTheme);

                    // Dispatch theme change event
                    if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('themeChanged', {
                            detail: { mode: theme, resolvedTheme }
                        }));
                    }
                },

                toggleTheme: () => {
                    const { mode } = get();
                    const newTheme = mode === 'light' ? 'dark' : 'light';
                    get().setTheme(newTheme);
                },

                initializeTheme: () => {
                    const { mode } = get();
                    const resolvedTheme = mode === 'system' ? getSystemTheme() : mode;

                    set({ resolvedTheme });
                    updateDocumentTheme(resolvedTheme);

                    // Listen for system theme changes
                    if (typeof window !== 'undefined') {
                        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                        const handleSystemThemeChange = () => {
                            const { mode } = get();
                            if (mode === 'system') {
                                const newResolvedTheme = getSystemTheme();
                                set({ resolvedTheme: newResolvedTheme });
                                updateDocumentTheme(newResolvedTheme);
                            }
                        };

                        mediaQuery.addEventListener('change', handleSystemThemeChange);
                    }
                },
            }),
            {
                name: THEME_CONFIG.STORAGE_KEY,
                storage: createJSONStorage(() => localStorage),
                partialize: (state) => ({ mode: state.mode }),
            }
        ),
        {
            name: 'theme-store',
        }
    )
);

export type ThemeStore = ThemeState & ThemeActions;

// Convenient theme selector
export const useTheme = () => useThemeStore(state => ({
    mode: state.mode,
    resolvedTheme: state.resolvedTheme,
    setTheme: state.setTheme,
    toggleTheme: state.toggleTheme,
}));

// Initialize on client
if (typeof window !== 'undefined') {
    useThemeStore.getState().initializeTheme();
}