import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.js');

const nextConfig = {
    experimental: {
        optimizePackageImports: ['@phosphor-icons/react']
    }
};

export default withNextIntl(nextConfig);