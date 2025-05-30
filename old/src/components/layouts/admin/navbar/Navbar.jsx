"use client";
// Navbar.jsx - Enhanced with better responsive design and semantic structure
import React, { createContext, useContext, useState } from 'react';
import SidebarTrigger from '@/components/layouts/admin/navbar/SidebarTrigger';
import { Separator } from '@/components/ui/separator';
import SearchInput from '@/components/layouts/admin/navbar/SearchInput';
import { UserNavbar } from '@/components/layouts/admin/navbar/UserNavbar';
import { ModeToggle } from '@/components/shared/ModeToggle';
import SMS from '@/components/layouts/admin/navbar/Sms';
import Notification from '@/components/layouts/admin/navbar/Notification';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import { user } from '@/data/user';

// Navbar Context for managing dropdown states
const NavbarContext = createContext({
    isSearchOpen: false,
    activeDropdown: null,
    setActiveDropdown: () => {},
    setSearchOpen: () => {},
});

export const useNavbar = () => useContext(NavbarContext);

export default function Navbar() {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isSearchOpen, setSearchOpen] = useState(false);

    return (
        <NavbarContext.Provider
            value={{
                isSearchOpen,
                activeDropdown,
                setActiveDropdown,
                setSearchOpen
            }}
        >
            <nav
                className='flex h-16 shrink-0 items-center justify-between gap-2 transition-all duration-300 ease-in-out group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 backdrop-blur-sm bg-background/95 border-b border-border/40'
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