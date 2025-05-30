import { NextResponse, type NextRequest } from 'next/server';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, STORAGE_KEYS, isValidLocale } from '@/lib/constants';

const staticFileExtensions = [
    '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico',
    '.css', '.js', '.woff', '.woff2', '.ttf', '.eot',
    '.pdf', '.zip', '.xml', '.txt', '.webp', '.avif'
];

function isStaticFile(pathname: string): boolean {
    return staticFileExtensions.some(ext => pathname.endsWith(ext)) ||
        pathname.includes('.');
}

const isDev = process.env.NODE_ENV === 'development';
const log = (message: string): void => {
    if (isDev) {
        console.log(message);
    }
};

const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT = 50;
const RATE_WINDOW = 60000;

function checkRateLimit(request: NextRequest): boolean {
    if (isDev) return true;

    // ✅ Fix IP extraction for NextRequest
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
        request.headers.get('x-real-ip') ||
        'unknown';

    const now = Date.now();
    const windowStart = now - RATE_WINDOW;

    const requests = rateLimitMap.get(ip) || [];
    const recentRequests = requests.filter(timestamp => timestamp > windowStart);

    if (recentRequests.length >= RATE_LIMIT) {
        return false;
    }

    recentRequests.push(now);
    rateLimitMap.set(ip, recentRequests);

    if (Math.random() < 0.01) {
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

    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/_vercel') ||
        pathname.startsWith('/monitoring') ||
        isStaticFile(pathname)
    ) {
        return NextResponse.next();
    }

    if (!checkRateLimit(request)) {
        log(`🚫 [Middleware] Rate limit exceeded for ${pathname}`);
        // ✅ Return NextResponse instead of Response
        return NextResponse.json(
            { error: 'Too Many Requests' },
            {
                status: 429,
                headers: {
                    'Retry-After': '60',
                }
            }
        );
    }

    const currentLocaleCookie = request.cookies.get(STORAGE_KEYS.LOCALE)?.value;
    const response = NextResponse.next();
    let finalDeterminedLocale = currentLocaleCookie;
    let cookieLogAction = "no-action";

    // ✅ Use type guard for validation
    if (!currentLocaleCookie || !isValidLocale(currentLocaleCookie)) {
        if (currentLocaleCookie) {
            log(`🔍 [Middleware] Invalid '${STORAGE_KEYS.LOCALE}' cookie found: '${currentLocaleCookie}'. Setting to default: '${DEFAULT_LOCALE}'.`);
        } else {
            log(`🔍 [Middleware] '${STORAGE_KEYS.LOCALE}' cookie not found. Setting to default: '${DEFAULT_LOCALE}'.`);
        }

        finalDeterminedLocale = DEFAULT_LOCALE;
        response.cookies.set(STORAGE_KEYS.LOCALE, DEFAULT_LOCALE, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: false,
        });
        cookieLogAction = `set-to-default (${DEFAULT_LOCALE})`;
    } else {
        cookieLogAction = `valid-existing (${currentLocaleCookie})`;
    }

    if (isDev && startTime) {
        const duration = Date.now() - startTime;
        log(`🔍 [Middleware] Path: '${pathname}', Cookie Status: ${cookieLogAction}, Final Locale: '${finalDeterminedLocale}', Processed in: ${duration}ms`);
    } else {
        log(`🔍 [Middleware] Path: '${pathname}', Cookie Status: ${cookieLogAction}, Final Locale: '${finalDeterminedLocale}'`);
    }

    if (isDev) {
        response.headers.set('X-Locale-Determined', finalDeterminedLocale || '');
        response.headers.set('X-Locale-Source', currentLocaleCookie ? 'cookie' : 'default');
    }

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
        '/((?!api|_next/static|_next/image|_vercel|assets|favicon.ico|sitemap.xml|robots.txt|sw.js|monitoring).*)',
    ],
};