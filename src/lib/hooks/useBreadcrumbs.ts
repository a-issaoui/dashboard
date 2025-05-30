// src/lib/hooks/useBreadcrumbs.ts
'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { ROUTES, ROUTES_BY_PATH } from '@/config/admin/routes';
import { sidebarList } from '@/config/admin/navigations';
import type { BreadcrumbItem, NavigationItem } from '@/types';

// Constants
const HOME_CONFIG = ROUTES_BY_PATH[ROUTES.HOME.path] || {
    title: 'Home',
    path: ROUTES.HOME.path,
    icon: 'Home' as const,
    titleKey: 'common.home'
};

const DASHBOARD_CONFIG = ROUTES_BY_PATH[ROUTES.DASHBOARD.path] || {
    title: 'Dashboard Overview',
    path: ROUTES.DASHBOARD.path,
    icon: 'Dashboard' as const,
    titleKey: 'navigation.dashboard'
};

const DASHBOARD_PATH = ROUTES.DASHBOARD.path;
const SEGMENTS_TO_SKIP_IN_DYNAMIC_GENERATION = ['admin'];

// Helper: Format title for display if it's not a translation key
const formatTitle = (segment: string): string => {
    if (!segment || typeof segment !== 'string') return '';
    return segment
        .replace(/([A-Z])(?=[a-z])/g, ' $1')
        .replace(/[-_]/g, ' ')
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

// Helper: Flatten sidebar items to include full path for hierarchy
interface FlattenedSidebarItem extends NavigationItem {
    fullPath: NavigationItem[];
}

const flattenSidebarItems = (items: NavigationItem[], parentPath: NavigationItem[] = []): FlattenedSidebarItem[] => {
    const flattened: FlattenedSidebarItem[] = [];
    if (!Array.isArray(items)) return flattened;

    const addedIds = new Set<string>();

    const flattenRecursive = (currentItems: NavigationItem[], currentParentPath: NavigationItem[]) => {
        if (!Array.isArray(currentItems)) return;

        currentItems.forEach(item => {
            if (!item || addedIds.has(item.id)) return;

            const itemFullPath = [...currentParentPath, item];
            if (item.url) { // Only directly add items with URLs to the list for findBestSidebarMatch
                flattened.push({
                    ...item,
                    fullPath: itemFullPath,
                });
                addedIds.add(item.id);
            }
            if (item.items && item.items.length > 0) {
                flattenRecursive(item.items, itemFullPath);
            }
        });
    };

    flattenRecursive(items, parentPath);
    return flattened;
};

// Helper: Find the best (longest) matching sidebar item for the current pathname
const findBestSidebarMatch = (pathname: string, flattenedItems: FlattenedSidebarItem[]): FlattenedSidebarItem | null => {
    if (!Array.isArray(flattenedItems)) return null;
    return flattenedItems
        .filter(item => item.url && pathname.startsWith(item.url)) // Match only items with URLs
        .sort((a, b) => (b.url?.length || 0) - (a.url?.length || 0))[0] || null;
};

// Helper: Build breadcrumbs from the sidebar item's full hierarchical path
const buildBreadcrumbsFromSidebarPath = (sidebarMatch: FlattenedSidebarItem): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [];
    if (!sidebarMatch?.fullPath) return breadcrumbs;

    sidebarMatch.fullPath.forEach((pathItem) => {
        const routeConfig = pathItem.url ? ROUTES_BY_PATH[pathItem.url] : undefined;

        // Identify if it's a group that should be displayed in breadcrumbs:
        // A group has no URL, typically has child 'items', and has title information.
        const hasTitleInformation = pathItem.titleKey || pathItem.labelKey || pathItem.title || pathItem.label;
        const isDisplayableGroup = !pathItem.url && pathItem.items && pathItem.items.length > 0 && hasTitleInformation;

        if (pathItem.url || isDisplayableGroup) { // Add if it's a navigable link or a displayable group
            let breadcrumbTitle: string;
            const keyToUse = pathItem.titleKey || pathItem.labelKey;

            if (keyToUse) {
                breadcrumbTitle = keyToUse; // Use the translation key directly
            } else {
                // No key, construct a display title and format it
                const literalTitle = pathItem.title ||
                    pathItem.label ||
                    (routeConfig && routeConfig.title) ||
                    (pathItem.url ? pathItem.url.split('/').pop() : 'Unnamed');
                breadcrumbTitle = formatTitle(literalTitle || '');
            }

            breadcrumbs.push({
                title: breadcrumbTitle,
                link: pathItem.url || null, // Groups have null links
                icon: pathItem.icon || (routeConfig && routeConfig.icon) || null,
                isGroup: isDisplayableGroup, // Mark if it's a group
            });
        }
    });
    return breadcrumbs;
};

// Helper: Generate dynamic breadcrumbs for path segments not covered by sidebar
const generateDynamicBreadcrumbs = (pathname: string, lastKnownPath = ''): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [];
    const remainingPath = pathname.substring(lastKnownPath.length);

    if (!remainingPath || remainingPath === '/') return breadcrumbs;

    const segments = remainingPath.split('/').filter(Boolean);
    let currentDynamicPath = lastKnownPath;

    segments.forEach(segment => {
        if (currentDynamicPath === '/' || currentDynamicPath === '') {
            currentDynamicPath = `/${segment}`;
        } else {
            currentDynamicPath = `${currentDynamicPath}/${segment}`;
        }

        if (!SEGMENTS_TO_SKIP_IN_DYNAMIC_GENERATION.includes(segment.toLowerCase())) {
            const routeConfig = ROUTES_BY_PATH[currentDynamicPath];
            breadcrumbs.push({
                title: routeConfig?.title ? formatTitle(routeConfig.title) : formatTitle(segment),
                link: currentDynamicPath,
                icon: routeConfig?.icon || null,
                isDynamic: true,
            });
        }
    });
    return breadcrumbs;
};

// Helper: Deduplicate breadcrumbs
const deduplicateBreadcrumbs = (breadcrumbs: BreadcrumbItem[]): BreadcrumbItem[] => {
    const seen = new Map<string, boolean>();
    const result: BreadcrumbItem[] = [];
    breadcrumbs.forEach((crumb, index) => {
        const key = crumb.link || `group-${crumb.title}-${index}`;
        if (!seen.has(key)) {
            seen.set(key, true);
            result.push(crumb);
        }
    });
    return result;
};

export function useBreadcrumbs(): BreadcrumbItem[] {
    const pathname = usePathname();
    const flattenedSidebarItems = useMemo(() => flattenSidebarItems(sidebarList), []);

    return useMemo(() => {
        // Step 1: Handle specific root paths.
        if (pathname === HOME_CONFIG.path) {
            return [{
                title: (ROUTES.HOME && ROUTES.HOME.titleKey) || formatTitle(HOME_CONFIG.title),
                link: HOME_CONFIG.path,
                icon: HOME_CONFIG.icon,
                isHome: true,
                isLast: true,
            }];
        }
        if (pathname === DASHBOARD_PATH) {
            return [{
                title: (ROUTES.DASHBOARD && ROUTES.DASHBOARD.titleKey) || formatTitle(DASHBOARD_CONFIG.title),
                link: DASHBOARD_PATH,
                icon: DASHBOARD_CONFIG.icon,
                isHome: true,
                isLast: true,
            }];
        }

        let workingBreadcrumbs: BreadcrumbItem[] = [];
        let pathCoveredBySidebar = '';

        // Step 2: Prepend "Home" breadcrumb.
        const homeTitleKey = ROUTES.HOME && ROUTES.HOME.titleKey;
        workingBreadcrumbs.push({
            title: homeTitleKey || formatTitle(HOME_CONFIG.title),
            link: HOME_CONFIG.path,
            icon: HOME_CONFIG.icon,
            isHome: true,
        });
        pathCoveredBySidebar = HOME_CONFIG.path;

        // Step 3: Match current pathname against sidebar.
        const bestSidebarMatch = findBestSidebarMatch(pathname, flattenedSidebarItems);

        if (bestSidebarMatch) {
            let sidebarGeneratedCrumbs = buildBreadcrumbsFromSidebarPath(bestSidebarMatch);
            sidebarGeneratedCrumbs = sidebarGeneratedCrumbs.filter(crumb => crumb.link !== DASHBOARD_PATH);
            workingBreadcrumbs.push(...sidebarGeneratedCrumbs);

            if (bestSidebarMatch.url && bestSidebarMatch.url.length > pathCoveredBySidebar.length) {
                pathCoveredBySidebar = bestSidebarMatch.url;
            }
        }

        // Step 4: Generate dynamic breadcrumbs.
        if (pathname !== pathCoveredBySidebar) {
            const dynamicCrumbs = generateDynamicBreadcrumbs(pathname, pathCoveredBySidebar);
            workingBreadcrumbs.push(...dynamicCrumbs);
        }

        // Step 5: Deduplicate.
        workingBreadcrumbs = deduplicateBreadcrumbs(workingBreadcrumbs);

        // Step 6: Finalize (isLast, icon logic).
        let finalBreadcrumbs = workingBreadcrumbs.map((crumb, index, arr) => {
            const displayIcon = (index === 0)
                ? (crumb.icon || (crumb.isHome ? HOME_CONFIG.icon : (pathname === DASHBOARD_PATH ? DASHBOARD_CONFIG.icon : null)))
                : null;
            return { ...crumb, icon: displayIcon, isLast: index === arr.length - 1 };
        });

        // Step 7: Special case for unresolved deeper pages.
        if (finalBreadcrumbs.length === 1 && finalBreadcrumbs[0].link === HOME_CONFIG.path && pathname !== HOME_CONFIG.path) {
            finalBreadcrumbs[0].isLast = false;
            const currentPageRouteInfo = ROUTES_BY_PATH[pathname];
            if (currentPageRouteInfo) {
                finalBreadcrumbs.push({
                    title: currentPageRouteInfo.titleKey || formatTitle(currentPageRouteInfo.title),
                    link: currentPageRouteInfo.path,
                    icon: null,
                    isLast: true,
                    isHome: false,
                });
            } else {
                const pathSegments = pathname.split('/').filter(Boolean);
                const lastSegment = pathSegments.pop();
                if (lastSegment && !SEGMENTS_TO_SKIP_IN_DYNAMIC_GENERATION.includes(lastSegment.toLowerCase())) {
                    finalBreadcrumbs.push({
                        title: formatTitle(lastSegment),
                        link: pathname,
                        icon: null,
                        isDynamic: true,
                        isLast: true,
                        isHome: false,
                    });
                } else if (finalBreadcrumbs.length > 0) {
                    finalBreadcrumbs[finalBreadcrumbs.length - 1].isLast = true;
                }
            }
        }
        return finalBreadcrumbs;
    }, [pathname, flattenedSidebarItems]);
}