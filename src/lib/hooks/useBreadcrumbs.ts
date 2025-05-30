// src/lib/hooks/useBreadcrumbs.ts
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { ROUTES, ROUTES_BY_PATH } from '@/lib/constants';
import type { BreadcrumbItem } from '@/types';

const formatTitle = (segment: string): string => {
    return segment
        .replace(/([A-Z])/g, ' $1')
        .replace(/[-_]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
        .trim();
};

export const useBreadcrumbs = (): BreadcrumbItem[] => {
    const pathname = usePathname();

    return useMemo(() => {
        const segments = pathname.split('/').filter(Boolean);
        const breadcrumbs: BreadcrumbItem[] = [];

        // Always start with Home
        breadcrumbs.push({
            title: 'common.home',
            link: ROUTES.HOME.path,
            icon: ROUTES.HOME.icon,
            isHome: true,
        });

        // Build breadcrumb trail
        let currentPath = '';
        segments.forEach((segment, index) => {
            currentPath += `/${segment}`;
            const isLast = index === segments.length - 1;

            // Check if we have a defined route
            const routeConfig = ROUTES_BY_PATH[currentPath];

            breadcrumbs.push({
                title: routeConfig?.titleKey || formatTitle(segment),
                link: isLast ? null : currentPath, // Last item is not clickable
                icon: routeConfig?.icon || null,
                isLast,
            });
        });

        return breadcrumbs;
    }, [pathname]);
};