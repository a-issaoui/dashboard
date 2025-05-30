'use client';

import React, { useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons/Icons';
import { useSidebar } from '@/components/ui/sidebar';
import { useLocaleStore } from '@/store/localeStore';

export default function SidebarTrigger({ className, onClick, ...props }) {
    const { toggleSidebar, open, isMobile } = useSidebar();
    const { direction, isRTL } = useLocaleStore((state) => ({
        direction: state.direction,
        isRTL: state.isRTL()
    }));

    // Fixed RTL/LTR arrow direction logic
    const getArrowRotation = useCallback(() => {
        // For LTR: closed = arrow points right (0deg), open = arrow points left (180deg)
        // For RTL: closed = arrow points left (180deg), open = arrow points right (0deg)

        if (isRTL) {
            return open ? 'rotate-0' : 'rotate-180';
        } else {
            return open ? 'rotate-180' : 'rotate-0';
        }
    }, [open, isRTL]);

    // Get the correct arrow icon based on current state and direction
    const getArrowIcon = useCallback(() => {
        // Always use ArrowRight as base, then rotate appropriately
        // This ensures consistent visual behavior across directions
        return Icons.ArrowRight;
    }, []);

    const handleClick = useCallback(
        (e) => {
            // Haptic feedback for supported devices
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(1);
            }

            onClick?.(e);
            toggleSidebar();
        },
        [onClick, toggleSidebar]
    );

    const ariaLabel = useMemo(() => {
        const action = open ? 'Close' : 'Open';
        const context = isMobile ? ' (mobile)' : '';
        return `${action} sidebar${context}`;
    }, [open, isMobile]);

    const ArrowIcon = getArrowIcon();

    return (
        <Button
            data-sidebar="trigger"
            data-slot="sidebar-trigger"
            variant="outline"
            size="icon"
            className={cn(
                'size-8 relative overflow-hidden group cursor-pointer touch-manipulation select-none',
                'hover:bg-accent/80 hover:text-accent-foreground hover:scale-105',
                'active:scale-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'transition-all duration-200 ease-out',
                // RTL-specific positioning adjustments
                isRTL && 'rtl:rotate-y-180',
                className
            )}
            onClick={handleClick}
            aria-label={ariaLabel}
            aria-expanded={open}
            data-state={open ? 'open' : 'closed'}
            data-direction={direction}
            {...props}
        >
            <ArrowIcon
                className={cn(
                    'transition-transform duration-200 ease-out',
                    'group-hover:scale-110',
                    getArrowRotation()
                )}
                size={16}
                aria-hidden="true"
            />

            {/* Visual indicator for screen readers */}
            <span className="sr-only">
                {open ? 'Collapse' : 'Expand'} navigation sidebar
            </span>
        </Button>
    );
}