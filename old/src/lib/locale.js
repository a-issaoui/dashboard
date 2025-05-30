// src/lib/locale.js
import { getCookie as getCookieClient, setCookie as setCookieClient } from 'cookies-next';

export const availableLocales = [
    { code: 'en', name: 'English', flag: '🇬🇧', dir: 'ltr' },
    { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr' },
    { code: 'ar', name: 'العربية', flag: '🇹🇳', dir: 'rtl' },
];

export const DEFAULT_LOCALE = 'en';
export const SUPPORTED_LOCALES = availableLocales.map(l => l.code);
export const COOKIE_NAME = 'NEXT_LOCALE';

export function getDirection(locale) {
    const localeData = availableLocales.find(l => l.code === locale);
    return localeData?.dir || 'ltr';
}

export function isValidLocale(locale) {
    return SUPPORTED_LOCALES.includes(locale);
}

export function getLocaleData(locale) {
    return availableLocales.find(l => l.code === locale) || availableLocales[0];
}

// Client & server compatible function to get locale from cookie
export const getLocaleFromCookie = (options) => {
    try {
        const cookieLocale = getCookieClient(COOKIE_NAME, options);
        return isValidLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;
    } catch (error) {
        console.warn('[Locale] Failed to read cookie:', error);
        return DEFAULT_LOCALE;
    }
};

export const setLocaleCookie = async (locale, options = {}) => {
    if (!isValidLocale(locale)) {
        throw new Error(`Invalid locale: ${locale}`);
    }

    try {
        setCookieClient(COOKIE_NAME, locale, {
            ...options,
            maxAge: 60 * 60 * 24 * 365, // 1 year
            path: '/',
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: false, // Client needs to read it
        });

        return Promise.resolve();
    } catch (error) {
        console.error('[Locale] Failed to set cookie:', error);
        return Promise.reject(error);
    }
};

// Helper for server components (Next.js 13+/14+/15+), given cookieStore
export function getLocaleAndDirectionFromCookie(cookieStore) {
    try {
        const cookieLocale = cookieStore.get(COOKIE_NAME)?.value || DEFAULT_LOCALE;
        const localeData = getLocaleData(cookieLocale);

        return {
            locale: localeData.code,
            direction: localeData.dir,
            localeData,
        };
    } catch (error) {
        console.warn('[Locale] Failed to read server cookie:', error);
        const fallback = getLocaleData(DEFAULT_LOCALE);
        return {
            locale: fallback.code,
            direction: fallback.dir,
            localeData: fallback,
        };
    }
}

// RTL Helper functions
export function isRTLLocale(locale) {
    return getDirection(locale) === 'rtl';
}

export function getDirectionClass(locale) {
    return isRTLLocale(locale) ? 'rtl' : 'ltr';
}

// Preload next likely locales (for performance)
export function getAlternativeLocales(currentLocale) {
    return availableLocales.filter(l => l.code !== currentLocale);
}