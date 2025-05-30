"use client"

import * as React from "react";
import { useTranslations } from 'next-intl'; // For translations
// Assuming a hook like this exists or you implement a robust one:
// import { useIsRTL } from "@/hooks/use-is-rtl"; // Example import
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
import { UserMenu } from "@/components/layouts/admin/UserMenu"; // Assuming UserMenu is already RTL/i18n friendly

// A placeholder for a robust RTL detection hook.
// Replace with your actual implementation.
const useIsRTL = () => {
    const [isRTL, setIsRTL] = React.useState(false);
    React.useEffect(() => {
        const dir = document.documentElement.dir;
        setIsRTL(dir === 'rtl');
        // For a production hook, observe document.documentElement.dir for changes.
    }, []);
    return isRTL;
};


export function UserSidebar({ user }) {
    const t = useTranslations('UserDropdown'); // Using the same namespace as UserMenu for consistency
    const isRTL = useIsRTL();

    if (!user) return null;

    const nameForInitials = user.name || t('guestNamePlaceholder');
    const initials = nameForInitials
        ?.split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(word => word[0].toUpperCase())
        .join('');
    // Fallback if even the guestNamePlaceholder results in empty initials (though unlikely)
    // Or handle this directly in AvatarFallback if preferred
    const displayInitials = initials || (t('guestNamePlaceholder').substring(0,2).toUpperCase());


    // Determine dropdown side based on LTR/RTL
    // If sidebar is on the physical left (LTR) or physical right (RTL default for sidebars),
    // we want the menu to open towards the main content area.
    const dropdownSide = isRTL ? "left" : "right";

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            {/* Avatar with online dot */}
                            <div className="relative">
                                <Avatar className="h-8 w-8 rounded-full border-2 border-green-500 grayscale">
                                    <AvatarImage src={user.imageUrl} alt={user.name || t('guestNamePlaceholder')} />
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
                        user={user} // UserMenu already handles missing user.name internally with translations
                        side={dropdownSide} // Dynamically set side
                        align="end" // 'end' is a logical alignment, typically works well
                        sideOffset={12}
                        alignOffset={2}
                        collisionPadding={{ top: 10, bottom: 10 }}
                    />
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}