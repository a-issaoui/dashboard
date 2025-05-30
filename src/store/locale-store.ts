// src/store/locale-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, STORAGE_KEYS, getDirection } from '@/lib/constants';

interface LocaleState {
    locale: string;
    direction: 'ltr' | 'rtl';
    isChanging: boolean;
    error: string | null;
}

interface LocaleActions {
    setLocale: (locale: string) => Promise<void>;
    clearError: () => void;
    isRTL: () => boolean;
    getCurrentLocaleData: () => typeof SUPPORTED_LOCALES[number] | undefined;
}

type LocaleStore = LocaleState & LocaleActions;

// SSR state management
let ssrInitialLocale: string | null = null;
let ssrInitialDirection: 'ltr' | 'rtl' | null = null;

export const setSsrInitialState = (locale: string, direction: 'ltr' | 'rtl') => {
    ssrInitialLocale = locale;
    ssrInitialDirection = direction;
};

const setLocaleCookie = async (locale: string): Promise<void> => {
    if (typeof window === 'undefined') return;

    try {
        const { setCookie } = await import('cookies-next');
        setCookie(STORAGE_KEYS.LOCALE, locale, {
            maxAge: 60 * 60 * 24 * 365,
            path: '/',
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: false,
        });
    } catch (error) {
        console.error('[LocaleStore] Failed to set cookie:', error);
        throw error;
    }
};

export const useLocaleStore = create<LocaleStore>()(
    persist(
        (set, get) => {
            // Get initial state from SSR or defaults
            const getInitialState = () => {
                if (typeof window === 'undefined') {
                    return {
                        locale: ssrInitialLocale || DEFAULT_LOCALE,
                        direction: ssrInitialDirection || 'ltr',
                    };
                }

                const clientLocale = (window as any).__INITIAL_LOCALE__ || DEFAULT_LOCALE;
                const clientDir = (window as any).__INITIAL_DIRECTION__ || 'ltr';

                return { locale: clientLocale, direction: clientDir };
            };

            const initialState = getInitialState();

            return {
                ...initialState,
                isChanging: false,
                error: null,

                setLocale: async (newLocale: string) => {
                    const localeData = SUPPORTED_LOCALES.find(l => l.code === newLocale);
                    if (!localeData) {
                        const error = `Invalid locale: ${newLocale}`;
                        set({ error });
                        throw new Error(error);
                    }

                    if (get().locale === newLocale) return;

                    set({ isChanging: true, error: null });

                    try {
                        await setLocaleCookie(newLocale);

                        set({
                            locale: newLocale,
                            direction: localeData.dir,
                            isChanging: false,
                        });

                        // Update DOM
                        if (typeof window !== 'undefined') {
                            document.documentElement.lang = newLocale;
                            document.documentElement.dir = localeData.dir;
                            document.body.classList.remove('ltr', 'rtl');
                            document.body.classList.add(localeData.dir);
                        }
                    } catch (error) {
                        set({ isChanging: false, error: 'Failed to change locale' });
                        throw error;
                    }
                },

                clearError: () => set({ error: null }),

                isRTL: () => get().direction === 'rtl',

                getCurrentLocaleData: () => {
                    const { locale } = get();
                    return SUPPORTED_LOCALES.find(l => l.code === locale);
                },
            };
        },
        {
            name: 'locale-storage',
            partialize: (state) => ({ locale: state.locale, direction: state.direction }),
        }
    )
);

// Convenience selectors
export const useCurrentLocale = () => useLocaleStore(state => state.locale);
export const useDirection = () => useLocaleStore(state => state.direction);
export const useIsRTL = () => useLocaleStore(state => state.isRTL());
