// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getMessages, getLocale } from 'next-intl/server'; // For fetching messages and locale on the server
import { getDirection, SUPPORTED_LOCALES, DEFAULT_LOCALE, isValidLocale, STORAGE_KEYS } from '@/lib/constants';
import { setSsrInitialState } from '@/store/locale-store';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import IntlProviderWrapper from '@/components/shared/IntlProviderWrapper'; // Import the new wrapper
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
    authors: [{ name: "Your Name" }], // Consider making this configurable or removing if generic
    creator: "Your Company", // Consider making this configurable
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3180'),
    openGraph: {
        type: 'website',
        title: 'Admin Dashboard',
        description: 'Modern multilingual admin dashboard',
        siteName: 'Admin Dashboard',
    },
    robots: {
        index: false, // Good for an admin dashboard
        follow: false,
    },
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
        console.error('[RootLayout] Failed to get locale, falling back to default:', error);
        locale = DEFAULT_LOCALE;
    }

    if (!isValidLocale(locale)) {
        console.warn(
            `[RootLayout] Invalid locale "${locale}" received, falling back to default "${DEFAULT_LOCALE}"`
        );
        locale = DEFAULT_LOCALE;
    }

    let messages;
    try {
        messages = await getMessages({ locale });
    } catch (error) {
        console.error(`[RootLayout] Failed to load messages for locale "${locale}", attempting fallback to "${DEFAULT_LOCALE}":`, error);
        try {
            // Fallback to default locale messages if current locale's messages fail
            messages = await getMessages({ locale: DEFAULT_LOCALE });
            // If you fall back messages, you might also want to consider falling back the locale itself,
            // or ensure the UI clearly indicates that content might not be in the selected language.
            // For now, we'll use the determined locale with potentially fallback messages.
        } catch (fallbackError) {
            console.error(`[RootLayout] CRITICAL: Failed to load messages for fallback locale "${DEFAULT_LOCALE}":`, fallbackError);
            messages = {}; // Provide empty messages as a last resort
        }
    }

    const dir = getDirection(locale);
    setSsrInitialState(locale, dir);

    const supportedLocaleCodes = SUPPORTED_LOCALES.map(l => l.code);

    return (
        <html
            lang={locale}
            dir={dir}
            suppressHydrationWarning // Recommended when using next-themes and server-side rendering
            className={cn('h-full scroll-smooth antialiased', geistSans.variable, geistMono.variable)}
        >
        <head>
            {/* Script for immediate client-side access to locale info, helps prevent hydration mismatches for locale-dependent UI */}
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
            <meta name="color-scheme" content="dark light" /> {/* Supports OS-level theme preferences */}
            <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
            <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />

            {/* Preconnect to font origins and other critical domains */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" /> {/* Example for a common CDN */}
        </head>
        <body
            className={cn(
                "h-full bg-background text-foreground antialiased overflow-hidden", // overflow-hidden on body if the layout is truly fixed
                dir === 'rtl' ? 'rtl' : 'ltr', // For CSS attribute selectors if needed
                dir === 'rtl' ? 'dir-rtl' : 'dir-ltr' // Another common pattern for targeting direction
            )}
            data-locale={locale} // Useful for CSS or JS
            data-direction={dir} // Useful for CSS or JS
        >
        <NextTopLoader
            color="#2563eb" // Primary color, ensure it matches your theme if possible
            initialPosition={0.08}
            crawlSpeed={200}
            height={2} // Slimmer loader
            crawl={true}
            showSpinner={false} // Spinner is often distracting
            easing="ease"
            speed={200}
            shadow={false} // cleaner look without shadow
        />

        <IntlProviderWrapper locale={locale} messages={messages}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system" // Respect user's OS preference
                enableSystem
                disableTransitionOnChange // Set to false if you want smooth transitions, true if you see flashes
                storageKey={STORAGE_KEYS.THEME} // Consistent storage key with Zustand store
                themes={['light', 'dark', 'system']} // Explicitly list supported themes by next-themes
            >
                <div className="flex flex-col h-full">
                    {children}
                </div>
            </ThemeProvider>
        </IntlProviderWrapper>
        </body>
        </html>
    );
}