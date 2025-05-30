// src/components/layouts/admin/navbar/Navbar.tsx
"use client";

import React, { createContext, useContext, useState } from 'react';
import { SidebarTrigger } from './SidebarTrigger';
import { Separator } from '@/components/ui/separator';
import { SearchInput } from './SearchInput';
import { UserNavbar } from './UserNavbar';
import { ModeToggle } from '@/components/shared/ModeToggle';
import { SMS } from './SMS';
import { Notification } from './Notification';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import { user } from '@/data/user';

// Define the dropdown types
type DropdownType = 'user' | 'notifications' | 'search' | null;

// Navbar Context for managing dropdown states
interface NavbarContextType {
    isSearchOpen: boolean;
    activeDropdown: DropdownType;
    setActiveDropdown: (dropdown: DropdownType) => void;
    setSearchOpen: (open: boolean) => void;
}

const NavbarContext = createContext<NavbarContextType>({
    isSearchOpen: false,
    activeDropdown: null,
    setActiveDropdown: () => {},
    setSearchOpen: () => {},
});

export const useNavbar = (): NavbarContextType => useContext(NavbarContext);

interface NavbarProps {
    className?: string;
}

export default function Navbar({ className }: NavbarProps) {
    const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
    const [isSearchOpen, setSearchOpen] = useState(false);

    const contextValue: NavbarContextType = {
        isSearchOpen,
        activeDropdown,
        setActiveDropdown,
        setSearchOpen
    };

    return (
        <NavbarContext.Provider value={contextValue}>
            <nav
                className={`flex h-16 shrink-0 items-center justify-between gap-2 transition-all duration-300 ease-in-out group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 backdrop-blur-sm bg-background/95 border-b border-border/40 ${className || ''}`}
                role="navigation"
                aria-label="Main navigation"
            >
                <div className='flex items-center gap-2 sm:gap-3 px-2'>
                    <SidebarTrigger className='-ms-1'/>
                    <Separator orientation='vertical' className='me-2 h-4 opacity-60'/>
                </div>

                <div className='flex items-center gap-1 sm:gap-1.5 px-2 sm:px-4'>
                    {/* Search - Hidden on mobile, shown in responsive order */}
                    <div className='flex items-center gap-1 order-2 sm:order-1'>
                        <div className='hidden sm:flex'>
                            <SearchInput/>
                        </div>
                    </div>

                    {/* Component controls - Priority order for mobile */}
                    <div className='flex items-center gap-1 sm:gap-1.5 order-1 sm:order-2'>
                        <LanguageSwitcher />
                        <ModeToggle/>
                        <SMS/>
                        <Notification/>
                        <UserNavbar user={user}/>
                    </div>
                </div>
            </nav>
        </NavbarContext.Provider>
    );
}