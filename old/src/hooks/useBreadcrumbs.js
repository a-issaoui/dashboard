// dashboard/src/hooks/useBreadcrumbs.js
'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { ROUTES, ROUTES_BY_PATH } from '@/config/admin/routes';
import { sidebarList } from '@/config/admin/navigations';

// Constants
const HOME_CONFIG = ROUTES_BY_PATH[ROUTES.HOME.path] || { title: 'Home', path: ROUTES.HOME.path, icon: 'Home' };
const DASHBOARD_CONFIG = ROUTES_BY_PATH[ROUTES.DASHBOARD.path] || { title: 'Dashboard Overview', path: ROUTES.DASHBOARD.path, icon: 'Dashboard' };
const DASHBOARD_PATH = ROUTES.DASHBOARD.path;
const SEGMENTS_TO_SKIP_IN_DYNAMIC_GENERATION = ['admin'];

// Helper: Format title for display if it's not a translation key
const formatTitle = (segment) => {
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
const flattenSidebarItems = (items, parentPath = []) => {
    const flattened = [];
    if (!Array.isArray(items)) return flattened;

    items.forEach(item => {
        if (!item) return;
        const currentItemPath = [...parentPath, item];

        let itemTitleDetermination; // Used for logging/debugging if needed, not directly for breadcrumb title here
        const keyForTitle = item.titleKey || item.labelKey;
        if (keyForTitle) {
            itemTitleDetermination = keyForTitle;
        } else {
            const routeConfigForTitle = item.url ? ROUTES_BY_PATH[item.url] : {};
            const literalTitleForDetermination = item.title ||
                item.label ||
                (routeConfigForTitle && routeConfigForTitle.title) ||
                (item.url ? item.url.split('/').pop() : 'Unnamed');
            itemTitleDetermination = formatTitle(literalTitleForDetermination);
        }

        // We push items that have URLs, or groups that have children,
        // as they form part of the potential navigation structure.
        // The `fullPath` is the critical piece of information for breadcrumbs.
        if (item.url || (item.items && item.items.length > 0)) {
            flattened.push({
                ...item, // Spread all original item properties
                fullPath: currentItemPath,
                // The 'title' here is more for debugging the flattened list;
                // buildBreadcrumbsFromSidebarPath will re-evaluate title logic carefully.
                _debugTitle: itemTitleDetermination
            });
        }

        if (item.items?.length > 0) {
            // Important: ensure that the items pushed from recursion are also added
            // to the main 'flattened' list, not just returned from a sub-call.
            const childItems = flattenSidebarItems(item.items, currentItemPath);
            flattened.push(...childItems);
        }
    });
    // Deduplicate based on a unique aspect like item.id if items might be processed multiple times
    // For this structure, direct push and recursion without separate group push might be cleaner.
    // Let's simplify flattenSidebarItems to focus on items with URLs,
    // as buildBreadcrumbsFromSidebarPath iterates the fullPath of the *matched navigable item*.
    const cleanFlattened = [];
    const addedIds = new Set(); // To avoid duplicates if structure is complex

    function _flattenRecursive(currentItems, currentParentPath) {
        if (!Array.isArray(currentItems)) return;
        currentItems.forEach(i => {
            if (!i || addedIds.has(i.id)) return;

            const itemFullPath = [...currentParentPath, i];
            if (i.url) { // Only directly add items with URLs to the list for findBestSidebarMatch
                cleanFlattened.push({
                    ...i,
                    fullPath: itemFullPath,
                });
                addedIds.add(i.id);
            }
            if (i.items && i.items.length > 0) {
                _flattenRecursive(i.items, itemFullPath);
            }
        });
    }
    _flattenRecursive(items, parentPath);
    return cleanFlattened;
};


// Helper: Find the best (longest) matching sidebar item for the current pathname
const findBestSidebarMatch = (pathname, flattenedItems) => {
    if (!Array.isArray(flattenedItems)) return null;
    return flattenedItems
        .filter(item => item.url && pathname.startsWith(item.url)) // Match only items with URLs
        .sort((a, b) => b.url.length - a.url.length)[0] || null;
};

// Helper: Build breadcrumbs from the sidebar item's full hierarchical path
const buildBreadcrumbsFromSidebarPath = (sidebarMatch) => {
    const breadcrumbs = [];
    if (!sidebarMatch?.fullPath) return breadcrumbs;

    sidebarMatch.fullPath.forEach((pathItem) => {
        const routeConfig = pathItem.url ? ROUTES_BY_PATH[pathItem.url] : {};

        // Identify if it's a group that should be displayed in breadcrumbs:
        // A group has no URL, typically has child 'items', and has title information.
        const hasTitleInformation = pathItem.titleKey || pathItem.labelKey || pathItem.title || pathItem.label;
        const isDisplayableGroup = !pathItem.url && pathItem.items && pathItem.items.length > 0 && hasTitleInformation;

        if (pathItem.url || isDisplayableGroup) { // Add if it's a navigable link or a displayable group
            let breadcrumbTitle;
            const keyToUse = pathItem.titleKey || pathItem.labelKey;

            if (keyToUse) {
                breadcrumbTitle = keyToUse; // Use the translation key directly
            } else {
                // No key, construct a display title and format it
                const literalTitle = pathItem.title ||
                    pathItem.label ||
                    (routeConfig && routeConfig.title) ||
                    (pathItem.url ? pathItem.url.split('/').pop() : 'Unnamed');
                breadcrumbTitle = formatTitle(literalTitle);
            }

            breadcrumbs.push({
                title: breadcrumbTitle,
                link: pathItem.url || null, // Groups have null links
                icon: pathItem.icon || (routeConfig && routeConfig.icon) || null,
                isGroup: isDisplayableGroup, // Mark if it's a group
                id: pathItem.id,
            });
        }
    });
    return breadcrumbs;
};

// Helper: Generate dynamic breadcrumbs for path segments not covered by sidebar
const generateDynamicBreadcrumbs = (pathname, lastKnownPath = '') => {
    const breadcrumbs = [];
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
const deduplicateBreadcrumbs = (breadcrumbs) => {
    const seen = new Map();
    const result = [];
    breadcrumbs.forEach((crumb, index) => {
        const key = crumb.link || `group-${crumb.title}-${index}`;
        if (!seen.has(key)) {
            seen.set(key, true);
            result.push(crumb);
        }
    });
    return result;
};

export function useBreadcrumbs() {
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

        let workingBreadcrumbs = [];
        let pathCoveredBySidebar = '';

        // Step 2: Prepend "Home" breadcrumb.
        // Ensure titleKey is preferred if defined directly on ROUTES.HOME object.
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
                    icon: null, isLast: true, isHome: false,
                });
            } else {
                const pathSegments = pathname.split('/').filter(Boolean);
                const lastSegment = pathSegments.pop();
                if (lastSegment && !SEGMENTS_TO_SKIP_IN_DYNAMIC_GENERATION.includes(lastSegment.toLowerCase())) {
                    finalBreadcrumbs.push({
                        title: formatTitle(lastSegment),
                        link: pathname,
                        icon: null, isDynamic: true, isLast: true, isHome: false,
                    });
                } else if (finalBreadcrumbs.length > 0) {
                    finalBreadcrumbs[finalBreadcrumbs.length - 1].isLast = true;
                }
            }
        }
        return finalBreadcrumbs;
    }, [pathname, flattenedSidebarItems]);
}