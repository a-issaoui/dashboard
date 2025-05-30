// src/store/locale-store.ts - Locale and RTL management
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import type { Locale } from '@/types';
import type { LocaleState } from './interfaces';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, STORAGE_KEYS } from '@/lib/constants';

interface LocaleActions {
    setLocale: (locale: string) => Promise<void>;
    syncWithCookie: () => void;
    clearError: () => void;
    getAvailableLocales: () => readonly Locale[];
    getCurrentLocaleData: () => Locale | undefined;
    isRTL: () => boolean;
    getDirectionClass: () => string;
}



// SSR state management
let ssrInitialLocale: string | null = null;
let ssrInitialDirection: 'ltr' | 'rtl' | null = null;

export const setSsrInitialState = (locale: string, direction: 'ltr' | 'rtl') => {
    ssrInitialLocale = locale;
    ssrInitialDirection = direction;
};

// Utility functions
const getLocaleData = (locale: string): Locale | undefined => {
    return SUPPORTED_LOCALES.find(l => l.code === locale);
};

const isValidLocale = (locale: string): boolean => {
    return SUPPORTED_LOCALES.some(l => l.code === locale);
};

const setLocaleCookie = async (locale: string): Promise<void> => {
    if (!isValidLocale(locale)) {
        throw new Error(`Invalid locale: ${locale}`);
    }

    try {
        const { setCookie } = await import('cookies-next');

        setCookie(STORAGE_KEYS.LOCALE, locale, {
            maxAge: 60 * 60 * 24 * 365, // 1 year
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

const getInitialState = (): Pick<LocaleState, 'locale' | 'direction'> => {
    // SSR: Use injected state or fallback
    if (typeof window === 'undefined') {
        if (ssrInitialLocale && ssrInitialDirection) {
            return {
                locale: ssrInitialLocale,
                direction: ssrInitialDirection
            };
        }
        return { locale: DEFAULT_LOCALE, direction: 'ltr' };
    }

    // CSR: Read from window globals or DOM
    const clientLocale =
        (window as { __INITIAL_LOCALE__?: string }).__INITIAL_LOCALE__ ||
        document.documentElement.lang ||
        DEFAULT_LOCALE;

    const clientDir =
        (window as { __INITIAL_DIRECTION__?: string }).__INITIAL_DIRECTION__ ||
        document.documentElement.dir ||
        'ltr';

    return {
        locale: clientLocale,
        direction: clientDir === 'rtl' ? 'rtl' : 'ltr',
    };
};

// Create the store
export const useLocaleStore = create<LocaleStore>()(
    devtools(
        subscribeWithSelector((set, get) => {
            const initialState = getInitialState();

            // Clear SSR globals after usage
            if (typeof window === 'undefined') {
                ssrInitialLocale = null;
                ssrInitialDirection = null;
            }

            return {
                // State
                locale: initialState.locale,
                direction: initialState.direction,
                isChanging: false,
                error: null,

                // Actions
                setLocale: async (newLocale: string) => {
                    const localeData = getLocaleData(newLocale);
                    if (!localeData) {
                        const error = `Unknown locale: ${newLocale}`;
                        console.warn(`[LocaleStore] ${error}`);
                        set({ error });
                        throw new Error(error);
                    }

                    const { locale: currentLocale } = get();
                    if (currentLocale === newLocale) {
                        return Promise.resolve();
                    }

                    set({ isChanging: true, error: null });

                    try {
                        await setLocaleCookie(newLocale);

                        set({
                            locale: newLocale,
                            direction: localeData.dir,
                            isChanging: false,
                        });

                        // Update DOM only on client
                        if (typeof window !== 'undefined') {
                            document.documentElement.lang = newLocale;
                            document.documentElement.dir = localeData.dir;

                            // Update body classes for styling
                            document.body.classList.remove('ltr', 'rtl');
                            document.body.classList.add(localeData.dir);

                            // Dispatch event for other components
                            window.dispatchEvent(new CustomEvent('localeChanged', {
                                detail: {
                                    locale: newLocale,
                                    direction: localeData.dir,
                                    previousLocale: currentLocale,
                                }
                            }));

                            // Update CSS custom properties
                            document.documentElement.style.setProperty(
                                '--text-direction',
                                localeData.dir
                            );
                        }

                        console.log(`[LocaleStore] Locale changed to: ${newLocale}`);
                    } catch (error) {
                        console.error('[LocaleStore] Failed to set locale:', error);
                        const errorMessage = error instanceof Error ? error.message : 'Failed to change locale';
                        set({
                            isChanging: false,
                            error: errorMessage,
                        });
                        throw error;
                    }
                },

                syncWithCookie: () => {
                    if (typeof window === 'undefined') return;

                    try {
                        const cookieLocale = document.cookie
                            .split('; ')
                            .find(row => row.startsWith(`${STORAGE_KEYS.LOCALE}=`))
                            ?.split('=')[1];

                        if (!cookieLocale || cookieLocale === get().locale) {
                            return;
                        }

                        const localeData = getLocaleData(cookieLocale);
                        if (!localeData) {
                            console.warn(`[LocaleStore] Invalid cookie locale: ${cookieLocale}`);
                            return;
                        }

                        set({
                            locale: localeData.code,
                            direction: localeData.dir,
                            error: null,
                        });

                        // Update DOM
                        document.documentElement.lang = localeData.code;
                        document.documentElement.dir = localeData.dir;
                        document.body.classList.remove('ltr', 'rtl');
                        document.body.classList.add(localeData.dir);

                        console.log(`[LocaleStore] Synced with cookie: ${cookieLocale}`);
                    } catch (error) {
                        console.error('[LocaleStore] Failed to sync with cookie:', error);
                        const errorMessage = error instanceof Error ? error.message : 'Failed to sync';
                        set({ error: errorMessage });
                    }
                },

                clearError: () => set({ error: null }),

                getAvailableLocales: () => SUPPORTED_LOCALES,

                getCurrentLocaleData: () => {
                    const { locale } = get();
                    return getLocaleData(locale);
                },

                isRTL: () => get().direction === 'rtl',

                getDirectionClass: () => get().direction,
            };
        }),
        {
            name: 'locale-store',
        }
    )
);

export type LocaleStore = LocaleState & LocaleActions;

// Selectors for better performance
export const useCurrentLocale = () => useLocaleStore(state => state.locale);
export const useDirection = () => useLocaleStore(state => state.direction);
export const useIsRTL = () => useLocaleStore(state => state.isRTL());
export const useLocaleError = () => useLocaleStore(state => state.error);
export const useIsChangingLocale = () => useLocaleStore(state => state.isChanging);

// Initialize on client
if (typeof window !== 'undefined') {
    useLocaleStore.getState().syncWithCookie();
}