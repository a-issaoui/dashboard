// src/i18n/request.js
import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers'; //

const allAppLocales = ['en', 'fr', 'ar']; //
const defaultAppLocale = 'en'; //

export default getRequestConfig(async ({ locale: resolvedLocaleByNextIntl_UNUSED }) => {
    // We are explicitly ignoring resolvedLocaleByNextIntl_UNUSED to ensure
    // we ONLY rely on the cookie or the hardcoded default.
    // next-intl will still resolve a locale and pass it, but our logic below overrides it.
    console.log(`[i18n/request.js] Locale that next-intl would have resolved (e.g. from header if no cookie, or cookie): '${resolvedLocaleByNextIntl_UNUSED}' - This value will be IGNORED in favor of direct cookie check or default.`);

    let finalLocale;
    let cookieLocaleValue;
    let sourceOfLocaleDetermination = "unknown";

    try {
        const cookieStore = await cookies(); //
        cookieLocaleValue = cookieStore.get('NEXT_LOCALE')?.value;

        if (cookieLocaleValue && allAppLocales.includes(cookieLocaleValue)) {
            console.log(`[i18n/request.js] Using valid NEXT_LOCALE cookie: '${cookieLocaleValue}'`);
            finalLocale = cookieLocaleValue;
            sourceOfLocaleDetermination = "cookie";
        } else {
            if (cookieLocaleValue) { // Cookie was present but invalid
                console.warn(`[i18n/request.js] Invalid NEXT_LOCALE cookie value: '${cookieLocaleValue}'. Falling back to default: '${defaultAppLocale}'.`);
            } else { // Cookie not found
                console.log(`[i18n/request.js] NEXT_LOCALE cookie not found. Falling back to default: '${defaultAppLocale}'.`);
            }
            finalLocale = defaultAppLocale; // Fallback to default if no valid cookie
            sourceOfLocaleDetermination = "application-default (no-valid-cookie)";
        }
    } catch (e) {
        console.warn(`[i18n/request.js] Error during cookie access: ${e.message}. Falling back to default: '${defaultAppLocale}'.`);
        finalLocale = defaultAppLocale; // Fallback to default on error
        sourceOfLocaleDetermination = "application-default (cookie-access-error)";
    }

    console.log(`[i18n/request.js] Final locale for messages: '${finalLocale}' (Source: ${sourceOfLocaleDetermination})`);

    try {
        const messages = (await import(`./${finalLocale}.json`)).default;
        return {
            locale: finalLocale,
            messages,
        };
    } catch (error) {
        console.error(`[i18n/request.js] CRITICAL: Failed to load messages for locale "${finalLocale}". Error: ${error.message}`);
        // Robust fallback to defaultAppLocale's messages if the selected locale's messages fail to load
        if (finalLocale !== defaultAppLocale) {
            try {
                console.warn(`[i18n/request.js] Attempting to load '${defaultAppLocale}.json' as fallback.`);
                const fallbackMessages = (await import(`./${defaultAppLocale}.json`)).default;
                return { locale: defaultAppLocale, messages: fallbackMessages };
            } catch (fallbackError) {
                console.error(`[i18n/request.js] CRITICAL: Failed to load fallback '${defaultAppLocale}.json'. Error: ${fallbackError.message}`);
            }
        }
        return { locale: defaultAppLocale, messages: {} }; // Ultimate fallback
    }
});