// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, STORAGE_KEYS } from '@/lib/constants';

export default getRequestConfig(async ({ locale: resolvedLocaleByNextIntl_UNUSED }) => {
    // We are explicitly ignoring resolvedLocaleByNextIntl_UNUSED to ensure
    // we ONLY rely on the cookie or the hardcoded default.
    console.log(`[i18n/request.ts] Locale that next-intl would have resolved: '${resolvedLocaleByNextIntl_UNUSED}' - This value will be IGNORED in favor of direct cookie check or default.`);

    let finalLocale: string;
    let cookieLocaleValue: string | undefined;
    let sourceOfLocaleDetermination = "unknown";

    try {
        const cookieStore = await cookies();
        cookieLocaleValue = cookieStore.get(STORAGE_KEYS.LOCALE)?.value;

        const supportedLocaleCodes = SUPPORTED_LOCALES.map(l => l.code);

        if (cookieLocaleValue && supportedLocaleCodes.includes(cookieLocaleValue)) {
            console.log(`[i18n/request.ts] Using valid NEXT_LOCALE cookie: '${cookieLocaleValue}'`);
            finalLocale = cookieLocaleValue;
            sourceOfLocaleDetermination = "cookie";
        } else {
            if (cookieLocaleValue) {
                console.warn(`[i18n/request.ts] Invalid NEXT_LOCALE cookie value: '${cookieLocaleValue}'. Falling back to default: '${DEFAULT_LOCALE}'.`);
            } else {
                console.log(`[i18n/request.ts] NEXT_LOCALE cookie not found. Falling back to default: '${DEFAULT_LOCALE}'.`);
            }
            finalLocale = DEFAULT_LOCALE;
            sourceOfLocaleDetermination = "application-default (no-valid-cookie)";
        }
    } catch (e) {
        const error = e as Error;
        console.warn(`[i18n/request.ts] Error during cookie access: ${error.message}. Falling back to default: '${DEFAULT_LOCALE}'.`);
        finalLocale = DEFAULT_LOCALE;
        sourceOfLocaleDetermination = "application-default (cookie-access-error)";
    }

    console.log(`[i18n/request.ts] Final locale for messages: '${finalLocale}' (Source: ${sourceOfLocaleDetermination})`);

    try {
        const messages = (await import(`./${finalLocale}.json`)).default;
        return {
            locale: finalLocale,
            messages,
        };
    } catch (error) {
        const err = error as Error;
        console.error(`[i18n/request.ts] CRITICAL: Failed to load messages for locale "${finalLocale}". Error: ${err.message}`);

        // Robust fallback to DEFAULT_LOCALE's messages if the selected locale's messages fail to load
        if (finalLocale !== DEFAULT_LOCALE) {
            try {
                console.warn(`[i18n/request.ts] Attempting to load '${DEFAULT_LOCALE}.json' as fallback.`);
                const fallbackMessages = (await import(`./${DEFAULT_LOCALE}.json`)).default;
                return { locale: DEFAULT_LOCALE, messages: fallbackMessages };
            } catch (fallbackError) {
                const fallbackErr = fallbackError as Error;
                console.error(`[i18n/request.ts] CRITICAL: Failed to load fallback '${DEFAULT_LOCALE}.json'. Error: ${fallbackErr.message}`);
            }
        }
        return { locale: DEFAULT_LOCALE, messages: {} };
    }
});