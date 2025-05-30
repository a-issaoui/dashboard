// src/app/admin/layout.tsx
import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { getLocale, getMessages } from 'next-intl/server';
import { getDirection, SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/lib/constants';
import { setSsrInitialState } from '@/store/locale-store';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
// import AppSidebar from '@/components/layouts/admin/sidebar/AppSidebar';
// import Navbar from '@/components/layouts/admin/navbar/Navbar';

// Temporary placeholders until we migrate the components
const AppSidebar = ({ serverDirection }: { serverDirection: string }) => (
    <div className="w-64 bg-sidebar border-r">
        <div className="p-4">
            <h2 className="text-lg font-semibold">Dashboard</h2>
        </div>
    </div>
);

const Navbar = () => (
    <div className="h-14 border-b bg-background px-6 flex items-center">
        <h1 className="text-lg font-semibold">Admin Dashboard</h1>
    </div>
);
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
    title: 'Admin Dashboard | Your App Name',
    description: 'Modern multilingual admin dashboard built with Next.js, Tailwind CSS, and shadcn/ui',
    robots: {
        index: false,
        follow: false,
        noarchive: true,
        nosnippet: true,
    },
};

const getDirection = (locale: string): 'ltr' | 'rtl' => {
    const localeData = SUPPORTED_LOCALES.find(l => l.code === locale);
    return localeData?.dir || 'ltr';
};

const SidebarSkeleton = () => (
    <div className="flex h-screen w-64 flex-col border-r bg-sidebar">
        <div className="flex h-16 items-center border-b px-4">
            <Skeleton className="h-8 w-32" />
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
            ))}
        </div>
        <div className="border-t p-4">
            <Skeleton className="h-10 w-full" />
        </div>
    </div>
);

const MainContentSkeleton = () => (
    <div className="flex flex-1 flex-col">
        <div className="flex h-14 items-center border-b px-6">
            <Skeleton className="h-8 w-48" />
        </div>
        <div className="flex-1 p-6 space-y-4">
            <Skeleton className="mb-2 h-8 w-64" />
            <Skeleton className="mb-6 h-4 w-96" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                ))}
            </div>
        </div>
    </div>
);

const ErrorBoundary = ({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }) => {
    return <>{children}</>; // In a real app, implement proper error boundary
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    let cookieStore;
    let defaultOpen = false;

    try {
        cookieStore = await cookies();
        defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
    } catch (error) {
        console.error('[AdminLayout] Failed to read cookies:', error);
    }

    let locale: string;
    let messages = {};

    try {
        locale = await getLocale();
    } catch (error) {
        console.error('[AdminLayout] Failed to get locale:', error);
        locale = DEFAULT_LOCALE;
    }

    // Validate and fallback locale
    const supportedLocaleCodes = SUPPORTED_LOCALES.map(l => l.code);
    if (!locale || !supportedLocaleCodes.includes(locale)) {
        console.warn(`[AdminLayout] Invalid locale "${locale}", falling back to "${DEFAULT_LOCALE}"`);
        locale = DEFAULT_LOCALE;
    }

    const dir = getDirection(locale);

    try {
        messages = await getMessages({ locale });
    } catch (error) {
        console.error(`[AdminLayout] Failed to load messages for locale "${locale}":`, error);
        // Try to load default locale messages as fallback
        try {
            messages = await getMessages({ locale: DEFAULT_LOCALE });
        } catch (fallbackError) {
            console.error('[AdminLayout] Failed to load fallback messages:', fallbackError);
        }
    }

    // Inject SSR locale state for Zustand
    setSsrInitialState(locale, dir);

    return (
        <ErrorBoundary
            fallback={
                <div className="flex h-screen items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-lg font-semibold">Something went wrong</h2>
                        <p className="text-muted-foreground">Please refresh the page</p>
                    </div>
                </div>
            }
        >
            <NextIntlClientProvider
                locale={locale}
                messages={messages}
                key={locale}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                    storageKey="admin-theme"
                >
                    <SidebarProvider defaultOpen={defaultOpen}>
                        <div
                            className={`flex h-full w-full bg-background text-foreground ${dir}`}
                            data-locale={locale}
                            data-direction={dir}
                        >
                            <Suspense fallback={<SidebarSkeleton />}>
                                <AppSidebar serverDirection={dir} />
                            </Suspense>

                            <SidebarInset className="flex min-w-0 flex-1 flex-col">
                                <Suspense fallback={<Skeleton className="h-14 w-full" />}>
                                    <Navbar />
                                </Suspense>

                                <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
                                    <Suspense fallback={<MainContentSkeleton />}>
                                        <ErrorBoundary fallback={
                                            <div className="flex flex-1 items-center justify-center p-6">
                                                <div className="text-center">
                                                    <h3 className="text-lg font-semibold">Content Error</h3>
                                                    <p className="text-muted-foreground">Failed to load page content</p>
                                                </div>
                                            </div>
                                        }>
                                            {children}
                                        </ErrorBoundary>
                                    </Suspense>
                                </div>
                            </SidebarInset>
                        </div>
                    </SidebarProvider>
                </ThemeProvider>
            </NextIntlClientProvider>
        </ErrorBoundary>
    );
}