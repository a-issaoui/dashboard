// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, STORAGE_KEYS } from '@/lib/constants';

// Static file extensions for better performance
const staticFileExtensions = [
    '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico',
    '.css', '.js', '.woff', '.woff2', '.ttf', '.eot',
    '.pdf', '.zip', '.xml', '.txt', '.webp', '.avif'
];

// Enhanced static file detection
function isStaticFile(pathname: string): boolean {
    return staticFileExtensions.some(ext => pathname.endsWith(ext)) ||
        pathname.includes('.');
}

// Environment-aware logging
const isDev = process.env.NODE_ENV === 'development';
const log = (message: string): void => {
    if (isDev) {
        console.log(message);
    }
};

// Simple rate limiting for production (optional)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT = 50; // max 50 requests per minute per IP
const RATE_WINDOW = 60000; // 1 minute

function checkRateLimit(request: NextRequest): boolean {
    if (isDev) return true; // Skip rate limiting in development

    const ip = request.ip ||
        request.headers.get('x-forwarded-for')?.split(',')[0] ||
        request.headers.get('x-real-ip') ||
        'unknown';

    const now = Date.now();
    const windowStart = now - RATE_WINDOW;

    // Cleanup old entries
    const requests = rateLimitMap.get(ip) || [];
    const recentRequests = requests.filter(timestamp => timestamp > windowStart);

    if (recentRequests.length >= RATE_LIMIT) {
        return false;
    }

    recentRequests.push(now);
    rateLimitMap.set(ip, recentRequests);

    // Cleanup old IPs periodically
    if (Math.random() < 0.01) { // 1% chance
        for (const [key, timestamps] of rateLimitMap.entries()) {
            if (timestamps.every(t => t <= windowStart)) {
                rateLimitMap.delete(key);
            }
        }
    }

    return true;
}

export function middleware(request: NextRequest): NextResponse {
    const startTime = isDev ? Date.now() : null;
    const { pathname } = request.nextUrl;

    // Skip middleware for Next.js internals, API routes, and static files
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/_vercel') ||
        pathname.startsWith('/monitoring') ||
        isStaticFile(pathname)
    ) {
        return NextResponse.next();
    }

    // Rate limiting check (production only)
    if (!checkRateLimit(request)) {
        log(`🚫 [Middleware] Rate limit exceeded for ${pathname}`);
        return new Response('Too Many Requests', {
            status: 429,
            headers: {
                'Retry-After': '60',
                'Content-Type': 'text/plain',
            }
        });
    }

    const currentLocaleCookie = request.cookies.get(STORAGE_KEYS.LOCALE)?.value;
    const response = NextResponse.next();
    let finalDeterminedLocale = currentLocaleCookie;
    let cookieLogAction = "no-action";

    const supportedLocaleCodes = SUPPORTED_LOCALES.map(l => l.code);

    if (!currentLocaleCookie || !supportedLocaleCodes.includes(currentLocaleCookie)) {
        // Cookie is missing, empty, or invalid
        if (currentLocaleCookie) {
            log(`🔍 [Middleware] Invalid '${STORAGE_KEYS.LOCALE}' cookie found: '${currentLocaleCookie}'. Setting to default: '${DEFAULT_LOCALE}'.`);
        } else {
            log(`🔍 [Middleware] '${STORAGE_KEYS.LOCALE}' cookie not found. Setting to default: '${DEFAULT_LOCALE}'.`);
        }

        finalDeterminedLocale = DEFAULT_LOCALE;
        response.cookies.set(STORAGE_KEYS.LOCALE, DEFAULT_LOCALE, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365, // 1 year
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: false, // Client needs to read it
        });
        cookieLogAction = `set-to-default (${DEFAULT_LOCALE})`;
    } else {
        // Valid cookie already exists
        cookieLogAction = `valid-existing (${currentLocaleCookie})`;
    }

    // Performance logging
    if (isDev && startTime) {
        const duration = Date.now() - startTime;
        log(`🔍 [Middleware] Path: '${pathname}', Cookie Status: ${cookieLogAction}, Final Locale: '${finalDeterminedLocale}', Processed in: ${duration}ms`);
    } else {
        log(`🔍 [Middleware] Path: '${pathname}', Cookie Status: ${cookieLogAction}, Final Locale: '${finalDeterminedLocale}'`);
    }

    // Add locale headers for debugging (development only)
    if (isDev) {
        response.headers.set('X-Locale-Determined', finalDeterminedLocale || '');
        response.headers.set('X-Locale-Source', currentLocaleCookie ? 'cookie' : 'default');
    }

    // Security headers for admin routes
    if (pathname.startsWith('/admin')) {
        response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
        response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - _vercel (Vercel internals)
         * - assets (public assets)
         * - favicon.ico, sitemap.xml, robots.txt (SEO files)
         * - sw.js (service worker)
         * - monitoring (health checks)
         */
        '/((?!api|_next/static|_next/image|_vercel|assets|favicon.ico|sitemap.xml|robots.txt|sw.js|monitoring).*)',
    ],
};