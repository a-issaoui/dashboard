// src/components/layouts/admin/Breadcrumbs.tsx
'use client';

import React, { Fragment, memo, useMemo, useEffect, useState } from 'react';
import { Icons, getIcon } from '@/components/icons/Icons';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { useBreadcrumbs } from '@/lib/hooks/useBreadcrumbs';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

// Simplified RTL detection hook
const useRTLDetection = () => {
    const [isRTL, setIsRTL] = useState(false);

    useEffect(() => {
        const updateRTL = () => {
            const dir = document.documentElement.dir || 'ltr';
            setIsRTL(dir === 'rtl');
        };

        updateRTL();

        const observer = new MutationObserver(updateRTL);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['dir']
        });

        const handleLocaleChange = () => updateRTL();
        window.addEventListener('localeChange', handleLocaleChange);

        return () => {
            observer.disconnect();
            window.removeEventListener('localeChange', handleLocaleChange);
        };
    }, []);

    return isRTL;
};

// RTL-aware separator component
const BreadcrumbSeparatorIcon = memo(() => {
    const isRTL = useRTLDetection();

    const IconComponent = useMemo(() => {
        return isRTL ? Icons.CaretLeft : Icons.CaretRight;
    }, [isRTL]);

    return (
        <IconComponent
            className={cn(
                "h-3.5 w-3.5 text-muted-foreground/60 transition-colors",
                isRTL && "transform rotate-180"
            )}
            aria-hidden="true"
        />
    );
});
BreadcrumbSeparatorIcon.displayName = 'BreadcrumbSeparatorIcon';

// Icon component - only shows for home item
interface BreadcrumbIconProps {
    iconName?: string | null;
    isHome?: boolean;
    className?: string;
}

const BreadcrumbIcon = memo<BreadcrumbIconProps>(({
                                                      iconName,
                                                      isHome = false,
                                                      className = "h-3.5 w-3.5"
                                                  }) => {
    if (!isHome || !iconName) return null;

    const IconComponent = useMemo(() => {
        const icon = getIcon(iconName as any);
        if (icon) return icon;
        return getIcon('Home') || null;
    }, [iconName]);

    if (!IconComponent) return null;

    return (
        <IconComponent
            className={cn(className, "shrink-0")}
            aria-hidden="true"
        />
    );
});
BreadcrumbIcon.displayName = 'BreadcrumbIcon';

// Enhanced breadcrumb item renderer with proper RTL support
interface BreadcrumbItemRendererProps {
    item: BreadcrumbItemType;
    index: number;
    isRTL: boolean;
}

const BreadcrumbItemRenderer = memo<BreadcrumbItemRendererProps>(({ item, index, isRTL }) => {
    const { title, link, icon, isLast, isGroup, isHome } = item;
    const t = useTranslations();

    // Only show icon for home items
    const shouldShowIcon = isHome && icon;

    const baseClasses = cn(
        "flex items-center text-xs font-normal max-w-[150px] truncate",
        isRTL ? "flex-row-reverse" : "flex-row"
    );

    const iconSpacing = shouldShowIcon ? (isRTL ? "gap-1.5 " : "gap-1.5") : "";

    // Get translated title
    const translatedTitle = useMemo(() => {
        if (isHome && link === '/') return t('common.home');
        if (isHome && link === '/admin/dashboard') return t('navigation.dashboard');
        if (isGroup) return t(title) || title || t('common.group');
        return t(title) || title || (isLast ? t('common.currentPage') : t('common.link'));
    }, [title, link, isHome, isGroup, isLast, t]);

    if (isLast) {
        return (
            <BreadcrumbPage
                className={cn(
                    baseClasses,
                    "font-medium text-foreground max-w-[200px]",
                    iconSpacing
                )}
            >
                {shouldShowIcon && (
                    <BreadcrumbIcon
                        iconName={icon}
                        isHome={isHome}
                    />
                )}
                <span className="truncate" title={translatedTitle}>
                    {translatedTitle}
                </span>
            </BreadcrumbPage>
        );
    }

    if (isGroup || !link) {
        return (
            <span className={cn(
                baseClasses,
                "text-muted-foreground",
                iconSpacing
            )}>
                {shouldShowIcon && (
                    <BreadcrumbIcon
                        iconName={icon}
                        isHome={isHome}
                    />
                )}
                <span className="truncate" title={translatedTitle}>
                    {translatedTitle}
                </span>
            </span>
        );
    }

    return (
        <BreadcrumbLink
            href={link}
            className={cn(
                baseClasses,
                "text-muted-foreground hover:text-foreground",
                "transition-colors duration-200 ease-in-out",
                "hover:bg-muted/50 rounded-md",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                iconSpacing,
            )}
        >
            {shouldShowIcon && (
                <BreadcrumbIcon
                    iconName={icon}
                    isHome={isHome}
                />
            )}
            <span className="truncate" title={translatedTitle}>
                {translatedTitle}
            </span>
        </BreadcrumbLink>
    );
});
BreadcrumbItemRenderer.displayName = 'BreadcrumbItemRenderer';

// Main breadcrumbs component with enhanced RTL support
interface BreadcrumbsProps {
    mobileVisibleCount?: number;
    className?: string;
    showOnMobile?: boolean;
}

export const Breadcrumbs = memo<BreadcrumbsProps>(({
                                                       mobileVisibleCount = 2,
                                                       className,
                                                       showOnMobile = false,
                                                   }) => {
    const items = useBreadcrumbs();
    const isRTL = useRTLDetection();
    const t = useTranslations();

    // Don't render if no items
    if (!items || items.length === 0) {
        return null;
    }

    // Mobile optimization - show only last N items on mobile
    const visibleItems = useMemo(() => {
        if (showOnMobile && items.length > mobileVisibleCount) {
            return items.slice(-mobileVisibleCount);
        }
        return items;
    }, [items, showOnMobile, mobileVisibleCount]);

    return (
        <nav
            aria-label={t('common.breadcrumb') || 'Breadcrumb'}
            dir={isRTL ? "rtl" : "ltr"}
            className={cn(
                "flex items-center",
                !showOnMobile && "hidden md:flex",
                className
            )}
        >
            <Breadcrumb>
                <BreadcrumbList className={cn(
                    "flex items-center gap-1",
                    isRTL ? "flex-row-reverse" : "flex-row"
                )}>
                    {visibleItems.map((item, index) => (
                        <Fragment key={item.link || `${item.title}-${index}`}>
                            <BreadcrumbItem className={cn(
                                "flex items-center",
                                isRTL ? "flex-row-reverse" : "flex-row"
                            )}>
                                <BreadcrumbItemRenderer
                                    item={item}
                                    index={index}
                                    isRTL={isRTL}
                                />
                            </BreadcrumbItem>
                            {!item.isLast && (
                                <BreadcrumbSeparator className="flex items-center">
                                    <BreadcrumbSeparatorIcon />
                                </BreadcrumbSeparator>
                            )}
                        </Fragment>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
        </nav>
    );
});
Breadcrumbs.displayName = 'Breadcrumbs';