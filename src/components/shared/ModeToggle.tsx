// src/components/shared/ModeToggle.tsx
'use client';

import { Icons } from '@/components/icons/Icons';
import { useTheme } from '@/store/theme-store';
import { useLocaleStore } from '@/store/locale-store';
import * as React from 'react';
import { cn } from '@/lib/utils';

interface ModeToggleProps {
    className?: string;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({ className }) => {
    const { resolvedTheme, toggleTheme } = useTheme();
    const { direction } = useLocaleStore();
    const [isMounted, setIsMounted] = React.useState(false);
    const [isTransitioning, setIsTransitioning] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const isRTL = direction === 'rtl';

    const handleThemeToggle = React.useCallback(
        async (e?: React.MouseEvent) => {
            if (isTransitioning) return;

            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(1);
            }

            setIsTransitioning(true);

            // Enhanced view transition with better performance
            if (!document.startViewTransition) {
                toggleTheme();
                setTimeout(() => setIsTransitioning(false), 300);
                return;
            }

            const root = document.documentElement;
            if (e) {
                const iconRect = e.currentTarget.getBoundingClientRect();
                const x = iconRect.left + iconRect.width / 2;
                const y = iconRect.top + iconRect.height / 2;

                root.style.setProperty('--x', `${x}px`);
                root.style.setProperty('--y', `${y}px`);
            }

            try {
                await document.startViewTransition(() => {
                    root.classList.remove('transition-colors');
                    toggleTheme();

                    // Re-enable transitions after a frame
                    requestAnimationFrame(() => {
                        root.classList.add('transition-colors');
                    });
                }).finished;
            } catch (error) {
                console.warn('Theme transition failed:', error);
                toggleTheme();
            } finally {
                setTimeout(() => setIsTransitioning(false), 100);
            }
        },
        [toggleTheme, isTransitioning]
    );

    const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleThemeToggle();
        }
    }, [handleThemeToggle]);

    if (!isMounted) {
        return (
            <div className="size-8 flex items-center justify-center">
                <div className="h-8 w-8 animate-pulse rounded-full bg-gradient-to-r from-foreground/20 to-foreground/10"/>
                <span className="sr-only">Theme Toggle</span>
            </div>
        );
    }

    const isDarkMode = resolvedTheme === 'dark';

    return (
        <div
            className={cn(
                "size-8 bg-muted/60 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden touch-manipulation select-none",
                "hover:bg-accent/80 hover:shadow-lg hover:scale-105",
                isTransitioning && "opacity-80 cursor-not-allowed",
                // Enhanced gradient background effect - adjusted for RTL
                isRTL
                    ? "before:absolute before:inset-0 before:bg-gradient-to-l before:from-yellow-500/20 before:to-blue-500/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
                    : "before:absolute before:inset-0 before:bg-gradient-to-r before:from-yellow-500/20 before:to-blue-500/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
                className
            )}
            onClick={handleThemeToggle}
            role="button"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode${isTransitioning ? ', switching themes' : ''}`}
            disabled={isTransitioning}
        >
            <div className="relative z-10">
                {isTransitioning ? (
                    <div className="animate-spin">
                        <Icons.Spinner size={16} className="text-primary" />
                    </div>
                ) : isDarkMode ? (
                    <Icons.ThemeLight
                        size={20}
                        weight="duotone"
                        className={cn(
                            "text-yellow-500 transition-all duration-300",
                            "hover:scale-110 hover:drop-shadow-md",
                            // RTL-aware rotation
                            isRTL ? "hover:-rotate-12" : "hover:rotate-12",
                            isHovered && "animate-pulse"
                        )}
                    />
                ) : (
                    <Icons.ThemeDark
                        size={20}
                        weight="duotone"
                        className={cn(
                            "text-slate-600 dark:text-slate-400 transition-all duration-300",
                            "hover:scale-110 hover:drop-shadow-md",
                            // RTL-aware rotation
                            isRTL ? "hover:-rotate-12" : "hover:rotate-12",
                            isHovered && "animate-pulse"
                        )}
                    />
                )}
            </div>

            {/* Theme indicator - RTL positioning */}
            <span
                className={cn(
                    "absolute w-2 h-2 rounded-full border border-background transition-all duration-300",
                    isRTL ? "-top-0.5 -left-0.5" : "-top-0.5 -right-0.5",
                    isHovered && "scale-110"
                )}
                aria-hidden="true"
            />

            <span className="sr-only">
                Toggle theme - Currently {isDarkMode ? 'dark' : 'light'} mode
            </span>
        </div>
    );
};