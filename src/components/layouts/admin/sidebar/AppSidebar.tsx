// src/components/layouts/admin/sidebar/AppSidebar.tsx
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/useMobile';
import { user as staticUser } from '@/data/user';
import { NavigationMenu } from './NavigationMenu';
import { UserSidebar } from './UserSidebar';
import { OrgProfile } from './OrgProfile';
import { useLocaleStore } from '@/store/locale-store';
import type { User } from '@/types';

interface AppSidebarProps {
    serverDirection?: 'ltr' | 'rtl';
    className?: string;
}

interface OrgData {
    name: string;
    academic_year: string;
}

const user: User = staticUser;

export default function AppSidebar({
                                       serverDirection = 'ltr',
                                       className
                                   }: AppSidebarProps) {
    const isMobile = useIsMobile();
    const { direction, syncWithCookie, locale } = useLocaleStore();
    const [isHydrated, setIsHydrated] = useState(false);

    // Sync locale state from cookie on mount
    useEffect(() => {
        syncWithCookie();
        setIsHydrated(true);
    }, [syncWithCookie]);

    // Memoize org profile data to avoid re-renders
    const orgData: OrgData = useMemo(() => ({
        name: 'Ecole Ennour',
        academic_year: '2023-2024',
    }), []);

    // Determine sidebar side based on locale direction and hydration state
    const sidebarSide = useMemo(() => {
        const effectiveDirection = isHydrated ? direction : serverDirection;
        return effectiveDirection === 'rtl' ? 'right' : 'left';
    }, [direction, serverDirection, isHydrated]);

    // Add smooth transition effect on locale direction change
    useEffect(() => {
        if (!isHydrated) return;

        const handleLocaleChange = (event: Event) => {
            const sidebarEl = document.querySelector('[data-sidebar="sidebar"]');
            if (!sidebarEl) return;

            sidebarEl.classList.add('sidebar-transitioning');
            setTimeout(() => sidebarEl.classList.remove('sidebar-transitioning'), 300);
        };

        window.addEventListener('localeChange', handleLocaleChange);
        return () => window.removeEventListener('localeChange', handleLocaleChange);
    }, [isHydrated]);

    return (
        <Sidebar
            variant="floating"
            collapsible="icon"
            side={sidebarSide}
            className={`transition-all duration-300 ease-in-out ${className || ''}`}
            data-sidebar="sidebar"
        >
            <SidebarHeader>
                <OrgProfile org={orgData} />
            </SidebarHeader>

            <SidebarContent className="overflow-x-hidden">
                <NavigationMenu />
            </SidebarContent>

            <SidebarFooter>
                <UserSidebar user={user} triggerVariant="sidebar" />
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}