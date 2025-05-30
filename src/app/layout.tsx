// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import { getDirection, SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/lib/constants';
import { setSsrInitialState } from '@/store/locale-store';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import "./globals.css";
import { cn } from '@/lib/utils';
import NextTopLoader from 'nextjs-toploader';

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "Admin Dashboard",
        template: "%s | Admin Dashboard"
    },
    description: "Modern multilingual admin dashboard built with Next.js 15",
    keywords: ["admin", "dashboard", "next.js", "multilingual", "rtl"],
    authors: [{ name: "Your Name" }],
    creator: "Your Company",
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3180'),
    openGraph: {
        type: 'website',
        title: 'Admin Dashboard',
        description: 'Modern multilingual admin dashboard',
        siteName: 'Admin Dashboard',
    },
    robots: {
        index: false, // Admin dashboard shouldn't be indexed
        follow: false,
    },
};

const getDirection = (locale: string): 'ltr' | 'rtl' => {
    const localeData = SUPPORTED_LOCALES.find(l => l.code === locale);
    return localeData?.dir || 'ltr';
};

export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {
    let locale: string;

    try {
        locale = await getLocale();
    } catch (error) {
        console.error('[RootLayout] Failed to get locale:', error);
        locale = DEFAULT_LOCALE;
    }

    // Validate and fallback locale
    const supportedLocaleCodes = SUPPORTED_LOCALES.map(l => l.code);
    if (!locale || !supportedLocaleCodes.includes(locale)) {
        console.warn(
            `[RootLayout] Invalid locale "${locale}", falling back to default "${DEFAULT_LOCALE}"`
        );
        locale = DEFAULT_LOCALE;
    }

    let messages = {};
    const dir = getDirection(locale);

    try {
        messages = await getMessages({ locale });
    } catch (error) {
        console.error(`[RootLayout] Failed to load messages for locale "${locale}":`, error);
        // Try to load default locale messages as fallback
        try {
            messages = await getMessages({ locale: DEFAULT_LOCALE });
        } catch (fallbackError) {
            console.error('[RootLayout] Failed to load fallback messages:', fallbackError);
        }
    }

    // Inject SSR locale state for Zustand
    setSsrInitialState(locale, dir);

    return (
        <html
            lang={locale}
            dir={dir}
            suppressHydrationWarning
            className={cn('h-full scroll-smooth antialiased', geistSans.variable, geistMono.variable)}
        >
        <head>
            <script
                dangerouslySetInnerHTML={{
                    __html: `
              window.__INITIAL_LOCALE__ = ${JSON.stringify(locale)};
              window.__INITIAL_DIRECTION__ = ${JSON.stringify(dir)};
              window.__SUPPORTED_LOCALES__ = ${JSON.stringify(supportedLocaleCodes)};
            `,
                }}
            />
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
            <meta name="color-scheme" content="dark light" />
            <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
            <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />

            {/* Preconnect to external domains for performance */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

            {/* DNS prefetch for potential external resources */}
            <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />
        </head>
        <body
            className={cn(
                "h-full bg-background text-foreground antialiased overflow-hidden",
                dir === 'rtl' ? 'rtl' : 'ltr',
                // Add direction-specific classes for Tailwind v4
                dir === 'rtl' ? 'dir-rtl' : 'dir-ltr'
            )}
            data-locale={locale}
            data-direction={dir}
        >
        <NextTopLoader
            color="#2563eb"
            showSpinner={false}
            height={2}
            shadow={false}
        />

        <NextIntlClientProvider
            locale={locale}
            messages={messages}
            key={locale}
            onError={(error) => {
                console.error('[NextIntl] Translation error:', error);
            }}
        >
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
                storageKey="admin-theme"
            >
                <div className="flex flex-col h-full">
                    {children}
                </div>
            </ThemeProvider>
        </NextIntlClientProvider>
        </body>
        </html>
    );
}