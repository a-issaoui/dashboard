// src/components/layouts/admin/sidebar/OrgProfile.tsx
'use client';

import * as React from 'react';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Organization {
    name: string;
    academic_year?: string;
    imageUrl?: string;
}

interface OrgProfileProps {
    org: Organization;
    className?: string;
}

export function OrgProfile({ org, className }: OrgProfileProps) {
    if (!org) return null;

    // Extract initials: first letter of first 2 words
    const initials = React.useMemo(() => {
        return org.name
            ?.split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map(word => word[0].toUpperCase())
            .join('') || 'CN';
    }, [org.name]);

    return (
        <SidebarMenu className={className}>
            <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                    <div className='bg-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md'>
                        <Avatar className="h-8 w-8 text-md">
                            {org.imageUrl ? (
                                <AvatarImage
                                    src={org.imageUrl}
                                    alt={org.name}
                                    className="object-cover"
                                />
                            ) : null}
                            <AvatarFallback className="font-semibold bg-primary text-primary-foreground">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    <div className="flex flex-col leading-none">
                        <span className="font-semibold text-base" title={org.name}>
                            {org.name}
                        </span>
                        {org.academic_year && (
                            <span className="text-muted-foreground text-sm" title={org.academic_year}>
                                {org.academic_year}
                            </span>
                        )}
                    </div>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}