// dashboard/src/components/layouts/admin/sidebar/NavigationMenu.jsx
'use client';

import React, { memo, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { sidebarList } from '@/config/admin/navigations';
import { Icons, getIcon } from '@/components/icons/Icons';

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from '@/components/ui/sidebar';

// Optimized Memoized Icon Component
const MenuIcon = memo(({ iconName, size = 32, className = '' }) => {
    const IconComponent = useMemo(() => {
        if (typeof iconName !== 'string' || !iconName.trim()) {
            return null;
        }
        const icon = getIcon(iconName);
        if (icon) {
            return icon;
        }
        return Icons.Menu; // Fallback
    }, [iconName]);

    if (!IconComponent) {
        return null;
    }
    return <IconComponent size={size} className={className} />;
});
MenuIcon.displayName = 'MenuIcon';

// RTL-Ready Chevron Icon - Hidden when sidebar is collapsed
const ChevronIcon = memo(({ className = '' }) => {
    const { state } = useSidebar();
    const isCollapsed = state === 'collapsed';

    if (isCollapsed) return null;

    return (
        <Icons.CaretRight
            className={`
                ms-auto 
                transition-transform 
                duration-200 
                group-data-[state=open]/collapsible:rotate-90 
                rtl:rotate-180 
                rtl:group-data-[state=open]/collapsible:rotate-[90deg]
                ${className}
            `.trim()}
        />
    );
});
ChevronIcon.displayName = 'ChevronIcon';

// Helper to calculate active state
const calculateIsActiveTree = (item, pathname) => {
    if (!item) return false;
    if (item.url && pathname === item.url) return true;
    if (item.items && Array.isArray(item.items) && item.items.length > 0) {
        return item.items.some(sub => calculateIsActiveTree(sub, pathname));
    }
    return false;
};

// RTL-Ready MenuItemRenderer
const MenuItemRenderer = memo(({ item, pathname, level = 0, isActiveTree = false }) => {
    const t = useTranslations();
    const { state } = useSidebar();
    const isCollapsed = state === 'collapsed';

    if (!item) return null;

    const itemTitle = item.titleKey ? t(item.titleKey) : (item.labelKey ? t(item.labelKey) : `Untitled Item ${level}`);
    const itemIcon = typeof item.icon === 'string' ? item.icon : undefined;
    const hasSubItems = item.items && Array.isArray(item.items) && item.items.length > 0;
    const isNestedLevel = level > 0;
    const iconSize = isNestedLevel ? 16 : 20;

    if (hasSubItems) {
        return (
            <>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                        tooltip={isCollapsed ? itemTitle : undefined}
                        isActive={isActiveTree}
                        className={`group flex items-center w-full ${
                            isCollapsed ? 'justify-center' : 'justify-between'
                        }`}
                    >
                        {isCollapsed ? (
                            <MenuIcon iconName={itemIcon} size={iconSize} />
                        ) : (
                            <>
                                <div className="flex items-center gap-2">
                                    <MenuIcon iconName={itemIcon} size={iconSize} />
                                    <span>{itemTitle}</span>
                                </div>
                                <ChevronIcon />
                            </>
                        )}
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                {!isCollapsed && (
                    <CollapsibleContent>
                        <SidebarMenuSub>
                            {item.items.map((subItem, index) => {
                                const subItemKey = subItem.id || subItem.titleKey || subItem.url || `sub-${level}-${index}`;
                                const subIsActiveTree = calculateIsActiveTree(subItem, pathname);

                                if (subItem.items && subItem.items.length > 0) {
                                    return (
                                        <Collapsible
                                            key={subItemKey}
                                            asChild
                                            defaultOpen={subIsActiveTree}
                                            className="group/collapsible"
                                        >
                                            <SidebarMenuSubItem>
                                                <MenuItemRenderer
                                                    item={subItem}
                                                    pathname={pathname}
                                                    level={level + 1}
                                                    isActiveTree={subIsActiveTree}
                                                />
                                            </SidebarMenuSubItem>
                                        </Collapsible>
                                    );
                                } else if (subItem.url) {
                                    return (
                                        <SidebarMenuSubItem key={subItemKey}>
                                            <MenuItemRenderer
                                                item={subItem}
                                                pathname={pathname}
                                                level={level + 1}
                                                isActiveTree={subIsActiveTree}
                                            />
                                        </SidebarMenuSubItem>
                                    );
                                }
                                return null;
                            })}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                )}
            </>
        );
    }

    if (item.url) {
        const ButtonComponent = isNestedLevel ? SidebarMenuSubButton : SidebarMenuButton;
        return (
            <ButtonComponent
                asChild
                tooltip={isCollapsed ? itemTitle : undefined}
                isActive={isActiveTree}
            >
                <Link
                    href={item.url}
                    className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'}`}
                >
                    <MenuIcon iconName={itemIcon} size={iconSize} />
                    {!isCollapsed && <span>{itemTitle}</span>}
                </Link>
            </ButtonComponent>
        );
    }

    // RTL-ready disabled state with logical properties
    return (
        <SidebarMenuButton
            tooltip={isCollapsed ? itemTitle : undefined}
            isActive={false}
            disabled
            className={`opacity-50 ${isNestedLevel && !isCollapsed ? 'ms-4' : ''} ${
                isCollapsed ? 'justify-center' : ''
            }`}
        >
            {isCollapsed ? (
                <MenuIcon iconName={itemIcon} size={iconSize} />
            ) : (
                <div className="flex items-center gap-2">
                    <MenuIcon iconName={itemIcon} size={iconSize} />
                    <span>{itemTitle}</span>
                </div>
            )}
        </SidebarMenuButton>
    );
});
MenuItemRenderer.displayName = 'MenuItemRenderer';

// RTL-Ready NavigationGroup component
const NavigationGroup = memo(({ group, pathname }) => {
    const t = useTranslations();
    const { state } = useSidebar();
    const isCollapsed = state === 'collapsed';

    if (!group) return null;

    const groupLabel = group.labelKey ? t(group.labelKey) : (group.titleKey ? t(group.titleKey) : 'Untitled Group');
    const groupId = group.id || groupLabel;

    if (group.url && group.titleKey && (!group.items || group.items.length === 0)) {
        const isActive = calculateIsActiveTree(group, pathname);
        return (
            <SidebarGroup key={groupId}>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <MenuItemRenderer
                            item={group}
                            pathname={pathname}
                            level={0}
                            isActiveTree={isActive}
                        />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>
        );
    }

    if (group.items && Array.isArray(group.items) && group.items.length > 0) {
        return (
            <SidebarGroup key={groupId}>
                {group.labelKey && !isCollapsed && (
                    <SidebarGroupLabel className="text-start">
                        {groupLabel}
                    </SidebarGroupLabel>
                )}
                <SidebarMenu>
                    {group.items.map((item, index) => {
                        const itemKey = item.id || item.titleKey || item.url || `item-${groupId}-${index}`;
                        const isActiveTree = calculateIsActiveTree(item, pathname);

                        if (item.items && item.items.length > 0) {
                            return (
                                <Collapsible
                                    key={itemKey}
                                    asChild
                                    defaultOpen={isActiveTree && !isCollapsed}
                                    className="group/collapsible"
                                >
                                    <SidebarMenuItem>
                                        <MenuItemRenderer
                                            item={item}
                                            pathname={pathname}
                                            level={0}
                                            isActiveTree={isActiveTree}
                                        />
                                    </SidebarMenuItem>
                                </Collapsible>
                            );
                        } else if (item.url) {
                            return (
                                <SidebarMenuItem key={itemKey}>
                                    <MenuItemRenderer
                                        item={item}
                                        pathname={pathname}
                                        level={0}
                                        isActiveTree={isActiveTree}
                                    />
                                </SidebarMenuItem>
                            );
                        }
                        return null;
                    })}
                </SidebarMenu>
            </SidebarGroup>
        );
    }
    return null;
});
NavigationGroup.displayName = 'NavigationGroup';

// Main NavigationMenu component
export const NavigationMenu = memo(() => {
    const pathname = usePathname();
    const t = useTranslations();

    const validGroups = useMemo(() => {
        return sidebarList.filter(group => {
            if (!group) return false;
            return (
                (group.url && group.titleKey) ||
                (group.labelKey && group.items && group.items.length > 0) ||
                (group.items && group.items.length > 0 && !group.labelKey && !group.titleKey)
            );
        });
    }, []);

    if (!validGroups.length) {
        return (
            <SidebarGroup>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton disabled className="flex items-center gap-2 justify-center">
                            <MenuIcon iconName="Menu" />
                            <span>{t('navigation.noItems')}</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>
        );
    }

    return (
        <>
            {validGroups.map((group) => (
                <NavigationGroup
                    key={group.id || group.labelKey || group.titleKey}
                    group={group}
                    pathname={pathname}
                />
            ))}
        </>
    );
});
NavigationMenu.displayName = 'NavigationMenu';