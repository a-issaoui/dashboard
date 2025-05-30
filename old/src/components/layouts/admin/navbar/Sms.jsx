// SMS.jsx - Enhanced with better performance and UX
'use client';

import React, { useState, useCallback, useEffect, memo } from 'react';
import { cn } from '@/lib/utils';
import { useNavbar } from '@/components/layouts/admin/navbar/Navbar';

const SMS = memo(() => {
    const [isAvailable, setIsAvailable] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleClick = useCallback(async (e) => {
        if (isLoading) return; // Prevent multiple simultaneous changes

        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(1);
        }

        setIsLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 200));

            setIsAvailable(prevState => {
                const newState = !prevState;
                console.log(`SMS notifications ${newState ? 'enabled' : 'disabled'}`);

                // Announce to screen readers
                const announcement = `SMS notifications ${newState ? 'enabled' : 'disabled'}`;
                const announcer = document.createElement('div');
                announcer.setAttribute('aria-live', 'polite');
                announcer.className = 'sr-only';
                announcer.textContent = announcement;
                document.body.appendChild(announcer);
                setTimeout(() => document.body.removeChild(announcer), 1000);

                return newState;
            });
        } catch (error) {
            console.error('Failed to toggle SMS notifications:', error);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick(e);
        }
    }, [handleClick]);

    if (!isMounted) {
        return (
            <div className="size-8 flex items-center justify-center">
                <div className="h-8 w-8 animate-pulse rounded-full bg-gradient-to-r from-foreground/20 to-foreground/10"/>
                <span className="sr-only">SMS</span>
            </div>
        );
    }

    return (
        <div
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            aria-pressed={!isAvailable}
            aria-label={`${isAvailable ? 'Disable' : 'Enable'} SMS notifications${isLoading ? ', processing' : ''}`}
            disabled={isLoading}
            className={cn(
                "size-8 bg-muted/60 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 relative touch-manipulation select-none",
                "hover:bg-accent/80 hover:shadow-lg hover:scale-105",
                isLoading && "opacity-60 cursor-not-allowed"
            )}
        >
            {isLoading ? (
                <div className="animate-spin">
                    <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full"/>
                </div>
            ) : (
                <>
                    {/* SMS Text - Enhanced centering */}
                    <span
                        className={cn(
                            "text-[10px] transition-all duration-300 font-semibold leading-none",
                            "flex items-center justify-center",
                            isAvailable ? "text-green-500" : "text-red-500",
                            "hover:scale-105"
                        )}
                        style={{lineHeight: '1'}}
                    >
                SMS
            </span>

                    {/* Disabled overlay */}
                    {!isAvailable && (
                        <svg
                            className="absolute inset-0 w-full h-full text-red-500 opacity-70 transition-opacity duration-300"
                            viewBox="0 0 32 32"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            aria-hidden="true"
                        >
                            <line x1="7" y1="7" x2="25" y2="25"/>
                        </svg>
                    )}
                </>
            )}

            <span className="sr-only">
        {isAvailable ? "SMS Available" : "SMS Unavailable"}
    </span>
        </div>
    );
});

SMS.displayName = 'SMS';

export default SMS;