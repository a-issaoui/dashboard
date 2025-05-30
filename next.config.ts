// next.config.ts
import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
    experimental: {
        optimizePackageImports: ['@phosphor-icons/react']
    },
    // Add any other Next.js config options here
};

export default withNextIntl(nextConfig);