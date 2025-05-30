// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, STORAGE_KEYS } from '@/lib/constants';

const staticExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.ico', '.css', '.js', '.woff', '.pdf'];

const isStaticFile = (pathname: string): boolean => {
    return staticExtensions.some(ext => pathname.endsWith(ext)) || pathname.includes('.');
};

const isValidLocale = (locale: string): boolean => {
    return SUPPORTED_LOCALES.some(l => l.code === locale);
};

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip middleware for Next.js internals and static files
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        isStaticFile(pathname)
    ) {
        return NextResponse.next();
    }

    const response = NextResponse.next();
    const currentLocale = request.cookies.get(STORAGE_KEYS.LOCALE)?.value;

    // Validate and set locale cookie
    if (!currentLocale || !isValidLocale(currentLocale)) {
        response.cookies.set(STORAGE_KEYS.LOCALE, DEFAULT_LOCALE, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365, // 1 year
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: false,
        });
    }

    // Security headers for admin routes
    if (pathname.startsWith('/admin')) {
        response.headers.set('X-Robots-Tag', 'noindex, nofollow');
        response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)',
    ],
};