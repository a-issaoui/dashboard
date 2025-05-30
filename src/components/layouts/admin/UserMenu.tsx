// src/components/layouts/admin/UserMenu.tsx
"use client"

import * as React from "react";
import { useTranslations } from 'next-intl';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons/Icons";
import { useIsMobile } from "@/hooks/useMobile";
import type { User } from "@/types";

interface UserInfoProps {
    user: User;
    initials: string;
}

const UserInfo = React.memo<UserInfoProps>(({ user, initials }) => (
    <div className="flex items-center rtl:flex-row-reverse gap-2 px-1 py-1.5 text-left rtl:text-right text-sm">
        <Avatar className="h-8 w-8 rounded-lg shrink-0">
            <AvatarImage src={user.imageUrl} alt={user.name || ''} />
            <AvatarFallback className="rounded-lg bg-gray-200">
                {initials}
            </AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left rtl:text-right text-sm leading-tight min-w-0">
            <span className="truncate font-medium" title={user.name || ''}>
                {user.name || ''}
            </span>
            <span className="truncate text-xs text-muted-foreground" title={user.email || ''}>
                {user.email || ''}
            </span>
        </div>
    </div>
));

UserInfo.displayName = 'UserInfo';

const MenuItems = React.memo(() => {
    const t = useTranslations('UserDropdown');

    // Base classes for menu items to ensure flex behavior and RTL ordering
    const menuItemClasses = "flex items-center gap-2 rtl:flex-row-reverse";

    return (
        <>
            <DropdownMenuGroup>
                <DropdownMenuItem className={menuItemClasses}>
                    <Icons.Profile className="h-4 w-4 shrink-0" />
                    <span>{t('account')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className={menuItemClasses}>
                    <Icons.Billing className="h-4 w-4 shrink-0" />
                    <span>{t('billing')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className={menuItemClasses}>
                    <Icons.Notification className="h-4 w-4 shrink-0" />
                    <span>{t('notifications')}</span>
                </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* For the "Log out" item, text-destructive and focus:text-destructive are specific styling */}
            <DropdownMenuItem className={`${menuItemClasses} text-destructive focus:text-destructive`}>
                <Icons.SignOut className="h-4 w-4 shrink-0" />
                <span>{t('logout')}</span>
            </DropdownMenuItem>
        </>
    );
});

MenuItems.displayName = 'MenuItems';

export interface UserMenuProps {
    user: User;
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
    sideOffset?: number;
    alignOffset?: number;
    collisionPadding?: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    };
}

export function UserMenu({
                             user,
                             side,
                             align,
                             sideOffset = 4,
                             alignOffset,
                             collisionPadding,
                         }: UserMenuProps) {
    const isMobile = useIsMobile();
    const t = useTranslations('UserDropdown');

    const initials = React.useMemo(() => {
        const nameForInitials = user?.name || t('guestNamePlaceholder');
        return nameForInitials
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map(word => word[0].toUpperCase())
            .join('');
    }, [user?.name, t]);

    if (!user) return null;

    const userNameToDisplay = user.name || t('guestNamePlaceholder');

    return (
        <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={side ?? (isMobile ? "bottom" : "right")}
            align={align ?? "end"}
            sideOffset={sideOffset}
            alignOffset={alignOffset}
            collisionPadding={collisionPadding}
        >
            <DropdownMenuLabel className="p-0 font-normal">
                <UserInfo user={{ ...user, name: userNameToDisplay }} initials={initials} />
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <MenuItems />
        </DropdownMenuContent>
    );
}