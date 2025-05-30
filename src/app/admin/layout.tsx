// src/app/admin/layout.tsx
import { Suspense, lazy } from 'react';
import { cookies } from 'next/headers';
import { getLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { DEFAULT_LOCALE, getDirection, isValidLocale } from '@/lib/constants';

// Lazy load heavy components
const AppSidebar = lazy(() => import('@/components/layouts/admin/AppSidebar'));
const Navbar = lazy(() => import('@/components/layouts/admin/Navbar'));

// Loading components
const SidebarSkeleton = () => (
    <div className="w-64 h-screen bg-sidebar border-r animate-pulse">
        <div className="p-4 space-y-4">
            <Skeleton className="h-8 w-32" />
            {Array.from({ length: 8 }, (_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
            ))}
        </div>
    </div>
);

const NavbarSkeleton = () => (
    <div className="h-14 border-b bg-background">
        <div className="flex items-center px-6 h-full">
            <Skeleton className="h-8 w-48" />
        </div>
    </div>
);

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    // Get locale and messages
    let locale = DEFAULT_LOCALE;
    let messages = {};

    try {
        locale = await getLocale();
        if (!isValidLocale(locale)) {
            locale = DEFAULT_LOCALE;
        }
        messages = await getMessages({ locale });
    } catch (error) {
        console.error('Failed to load locale data:', error);
    }

    const direction = getDirection(locale);

    // Get sidebar state
    let sidebarOpen = false;
    try {
        const cookieStore = await cookies();
        sidebarOpen = cookieStore.get('sidebar-state')?.value === 'true';
    } catch (error) {
        console.error('Failed to read sidebar state:', error);
    }

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <ThemeProvider>
                <SidebarProvider defaultOpen={sidebarOpen}>
                    <div className={cn("flex h-full w-full", direction)} data-locale={locale}>
                        <Suspense fallback={<SidebarSkeleton />}>
                            <AppSidebar />
                        </Suspense>

                        <SidebarInset className="flex min-w-0 flex-1 flex-col">
                            <Suspense fallback={<NavbarSkeleton />}>
                                <Navbar />
                            </Suspense>

                            <main className="flex-1 overflow-hidden">
                                {children}
                            </main>
                        </SidebarInset>
                    </div>
                </SidebarProvider>
            </ThemeProvider>
        </NextIntlClientProvider>
    );
}