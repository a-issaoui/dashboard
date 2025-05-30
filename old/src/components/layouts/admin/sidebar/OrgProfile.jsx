'use client';

import * as React from 'react';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function OrgProfile({ org }) {
    if (!org) return null;

    // Extract initials: first letter of first 2 words
    const initials = org.name
        ?.split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(word => word[0].toUpperCase())
        .join('') || 'CN';

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    size="lg"
                >
                    <div
                        className='bg-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md'>
                        <Avatar className="h-8 w-8 text-md">
                            <AvatarFallback className="font-semibold bg-primary">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    <div className="flex flex-col leading-none">
                        <span className="font-semibold text-base">{org.name}</span>
                        <span className="text-muted-foreground text-sm">
                            {org.academic_year}
                        </span>
                    </div>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
