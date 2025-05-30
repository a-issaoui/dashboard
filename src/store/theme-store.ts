// src/store/theme-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/lib/constants';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
    mode: ThemeMode;
    resolvedTheme: 'light' | 'dark';
}

interface ThemeActions {
    setTheme: (theme: ThemeMode) => void;
    toggleTheme: () => void;
}

type ThemeStore = ThemeState & ThemeActions;

const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const updateDOM = (theme: 'light' | 'dark') => {
    if (typeof window === 'undefined') return;

    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    document.documentElement.setAttribute('data-theme', theme);
};

export const useThemeStore = create<ThemeStore>()(
    persist(
        (set, get) => ({
            mode: 'system',
            resolvedTheme: 'light',

            setTheme: (mode: ThemeMode) => {
                const resolvedTheme = mode === 'system' ? getSystemTheme() : mode;

                set({ mode, resolvedTheme });
                updateDOM(resolvedTheme);

                // Dispatch custom event
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('themeChanged', {
                        detail: { mode, resolvedTheme }
                    }));
                }
            },

            toggleTheme: () => {
                const { mode } = get();
                const newMode = mode === 'light' ? 'dark' : 'light';
                get().setTheme(newMode);
            },
        }),
        {
            name: STORAGE_KEYS.THEME,
            partialize: (state) => ({ mode: state.mode }),
        }
    )
);

// Convenience selector
export const useTheme = () => useThemeStore(state => ({
    mode: state.mode,
    resolvedTheme: state.resolvedTheme,
    setTheme: state.setTheme,
    toggleTheme: state.toggleTheme,
}));