import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { availableLocales, setLocaleCookie } from '@/lib/locale';

let ssrInitialLocale = null;
let ssrInitialDirection = null;

// Called during SSR to inject initial locale and direction
export const setSsrInitialState = (locale, direction) => {
    ssrInitialLocale = locale;
    ssrInitialDirection = direction;
};

export const useLocaleStore = create(
    subscribeWithSelector((set, get) => {
        const getInitialState = () => {
            if (typeof window === 'undefined') {
                // SSR: return injected initial state or fallback
                if (ssrInitialLocale && ssrInitialDirection) {
                    return { locale: ssrInitialLocale, direction: ssrInitialDirection };
                }
                return { locale: 'en', direction: 'ltr' };
            }

            // CSR: read from injected globals or fallback to DOM attributes
            const clientLocale = window.__INITIAL_LOCALE__ || document.documentElement.lang || 'en';
            const clientDir = window.__INITIAL_DIRECTION__ || document.documentElement.dir || 'ltr';

            return {
                locale: clientLocale,
                direction: clientDir.toLowerCase() === 'rtl' ? 'rtl' : 'ltr',
            };
        };

        const initialState = getInitialState();

        if (typeof window === 'undefined') {
            // Clear SSR globals after usage to prevent leaks
            ssrInitialLocale = null;
            ssrInitialDirection = null;
        }

        return {
            locale: initialState.locale,
            direction: initialState.direction,
            isChanging: false,
            error: null,

            setLocale: async (newLocale) => {
                const localeData = availableLocales.find((l) => l.code === newLocale);
                if (!localeData) {
                    const error = `Unknown locale: ${newLocale}`;
                    console.warn(`[LocaleStore] ${error}`);
                    set({ error });
                    return Promise.reject(new Error(error));
                }

                const { locale: currentLocale } = get();
                if (currentLocale === newLocale) return Promise.resolve();

                set({ isChanging: true, error: null });

                try {
                    await setLocaleCookie(newLocale);

                    set({
                        locale: newLocale,
                        direction: localeData.dir,
                        isChanging: false,
                    });

                    if (typeof window !== 'undefined') {
                        document.documentElement.lang = newLocale;
                        document.documentElement.dir = localeData.dir;

                        document.body.classList.remove('ltr', 'rtl');
                        document.body.classList.add(localeData.dir);

                        // Dispatch custom event for other components to listen
                        window.dispatchEvent(new CustomEvent('localeChanged', {
                            detail: {
                                locale: newLocale,
                                direction: localeData.dir,
                                previousLocale: currentLocale
                            }
                        }));
                    }

                    return Promise.resolve();
                } catch (error) {
                    console.error('[LocaleStore] Failed to set locale:', error);
                    set({
                        isChanging: false,
                        error: error.message || 'Failed to change locale'
                    });
                    return Promise.reject(error);
                }
            },

            syncWithCookie: () => {
                if (typeof window === 'undefined') return;

                try {
                    const cookieLocale = document.cookie
                        .split('; ')
                        .find(row => row.startsWith('NEXT_LOCALE='))
                        ?.split('=')[1];

                    if (!cookieLocale || cookieLocale === get().locale) return;

                    const localeData = availableLocales.find(l => l.code === cookieLocale);
                    if (!localeData) return;

                    set({
                        locale: localeData.code,
                        direction: localeData.dir,
                        error: null,
                    });

                    document.documentElement.lang = localeData.code;
                    document.documentElement.dir = localeData.dir;

                    document.body.classList.remove('ltr', 'rtl');
                    document.body.classList.add(localeData.dir);
                } catch (error) {
                    console.error('[LocaleStore] Failed to sync with cookie:', error);
                    set({ error: error.message });
                }
            },

            clearError: () => set({ error: null }),

            getAvailableLocales: () => availableLocales,

            getCurrentLocaleData: () => {
                const localeCode = get().locale;
                return availableLocales.find(l => l.code === localeCode);
            },

            // Helper to check if locale is RTL
            isRTL: () => get().direction === 'rtl',

            // Helper to get opposite direction class
            getDirectionClass: () => get().direction,
        };
    })
);