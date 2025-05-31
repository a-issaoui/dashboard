// src/components/shared/IntlProviderWrapper.tsx
"use client";

// Assuming IntlErrorCode is imported or available globally as per your declaration
// If it's from 'next-intl', it would be:
import { NextIntlClientProvider, type IntlError, IntlErrorCode } from 'next-intl';
import type { AbstractIntlMessages } from 'next-intl';

type Props = {
    messages: AbstractIntlMessages | undefined;
    locale: string;
    children: React.ReactNode;
};

export default function IntlProviderWrapper({
                                                messages,
                                                locale,
                                                children,
                                            }: Props) {
    const handleError = (error: IntlError) => { // IntlError is correct
        // Use the error codes from the IntlErrorCode enum you provided
        switch (error.code) {
            case IntlErrorCode.MISSING_MESSAGE:
                console.warn(`[NextIntl] Missing translation for locale "${locale}". Key: ${error.message}`);
                break;
            case IntlErrorCode.INVALID_MESSAGE: // Changed from INVALID_MESSAGE_FORMAT
                console.error(`[NextIntl] Invalid message format for locale "${locale}". Message: ${error.message}`);
                break;
            case IntlErrorCode.FORMATTING_ERROR:
                console.error(`[NextIntl] Formatting error for locale "${locale}". Message: ${error.message}`);
                break;
            // Add other cases as needed based on how you want to handle them
            // case IntlErrorCode.MISSING_FORMAT:
            // case IntlErrorCode.ENVIRONMENT_FALLBACK:
            // case IntlErrorCode.INSUFFICIENT_PATH:
            // case IntlErrorCode.INVALID_KEY:
            default:
                console.error(`[NextIntl] Translation error - Code: ${error.code}, Message: ${error.message}`);
                break;
        }
    };

    return (
        <NextIntlClientProvider
            locale={locale}
            messages={messages || null}
            onError={handleError}
            now={new Date()}
            timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}
        >
            {children}
        </NextIntlClientProvider>
    );
}