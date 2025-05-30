// src/components/layouts/admin/sidebar/UserSidebar.tsx
"use client"

import * as React from "react";
import { useTranslations } from 'next-intl';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Icons } from "@/components/icons/Icons";
import { UserMenu } from "../UserMenu";
import type { User } from "@/types";

// RTL detection hook
const useIsRTL = (): boolean => {
    const [isRTL, setIsRTL] = React.useState(false);

    React.useEffect(() => {
        const updateDirection = () => {
            const dir = document.documentElement.dir;
            setIsRTL(dir === 'rtl');
        };

        updateDirection();

        // Listen for direction changes
        const observer = new MutationObserver(updateDirection);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['dir']
        });

        return () => observer.disconnect();
    }, []);

    return isRTL;
};

interface UserSidebarProps {
    user: User;
    triggerVariant?: 'sidebar' | 'navbar';
    className?: string;
}

export function UserSidebar({ user, triggerVariant = 'sidebar', className }: UserSidebarProps) {
    const t = useTranslations('UserDropdown');
    const isRTL = useIsRTL();

    if (!user) return null;

    const nameForInitials = user.name || t('guestNamePlaceholder');
    const initials = nameForInitials
        ?.split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(word => word[0].toUpperCase())
        .join('');

    // Fallback if even the guestNamePlaceholder results in empty initials
    const displayInitials = initials || (t('guestNamePlaceholder').substring(0, 2).toUpperCase());

    // Determine dropdown side based on LTR/RTL
    const dropdownSide = isRTL ? "left" : "right";

    return (
        <SidebarMenu className={className}>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            {/* Avatar with online dot */}
                            {/* Avatar with online dot */}
                            <div className="relative">
                                <Avatar className="h-8 w-8 rounded-full border-2 border-green-500 grayscale">
                                    <AvatarImage
                                        src={user.imageUrl}
                                        alt={user.name || t('guestNamePlaceholder')}
                                    />
                                    <AvatarFallback className="rounded-full bg-gray-200">
                                        {displayInitials}
                                    </AvatarFallback>
                                </Avatar>
                                {/* 'end-0' is a logical property, correct for LTR/RTL */}
                                <span className="absolute bottom-0 end-0 h-2 w-2 rounded-full bg-green-500 border-2 border-white" />
                            </div>

                            {/* 'text-start' and 'ms-2' are logical properties, correct for LTR/RTL */}
                            <div className="grid flex-1 text-start text-sm leading-tight ms-2">
                                <span className="truncate font-medium">{user.name || t('guestNamePlaceholder')}</span>
                                <span className="truncate text-xs text-muted-foreground">
                                    {user.email}
                                </span>
                            </div>
                            {/* 'ms-auto' is a logical property, correct for LTR/RTL */}
                            <Icons.CaretSort className="ms-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <UserMenu
                        user={user}
                        side={dropdownSide}
                        align="end"
                        sideOffset={12}
                        alignOffset={2}
                        collisionPadding={{ top: 10, bottom: 10 }}
                    />
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}