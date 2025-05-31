// src/components/shared/LanguageSwitcher.tsx
'use client';

import React, { useEffect, useRef, useState, memo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLocaleStore } from '@/store/locale-store';
import { Icon } from '@/components/icons';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LanguageSwitcherProps {
    className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = memo(({ className }) => {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isChangingLanguage = useRef(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Zustand selectors with error handling
    const {
        currentLocale,
        setLocale,
        availableLocales,
        currentLocaleData,
        isChanging,
        error,
        clearError,
        isRTL
    } = useLocaleStore((state) => ({
        currentLocale: state.locale,
        setLocale: state.setLocale,
        availableLocales: state.getAvailableLocales(),
        currentLocaleData: state.getCurrentLocaleData(),
        isChanging: state.isChanging,
        error: state.error,
        clearError: state.clearError,
        isRTL: state.isRTL(),
    }));

    useEffect(() => {
        setIsMounted(true);

        // Clear any existing errors on mount
        if (error) {
            clearError();
        }

        // Cleanup timeout on unmount
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [error, clearError]);

    const handleLanguageSelect = useCallback(async (newLocaleCode: string, event?: React.MouseEvent) => {
        event?.preventDefault();
        event?.stopPropagation();

        if (newLocaleCode === currentLocale || isChanging) {
            setIsMenuOpen(false);
            return;
        }

        isChangingLanguage.current = true;
        setIsMenuOpen(false);

        // Small delay to close menu nicely
        await new Promise((resolve) => setTimeout(resolve, 50));

        try {
            await setLocale(newLocaleCode);

            // Refresh the router to apply new locale
            router.refresh();
        } catch (error) {
            console.error('[LanguageSwitcher] Locale change failed:', error);
            // Error is already handled in the store
        } finally {
            // Reset changing flag after a delay
            timeoutRef.current = setTimeout(() => {
                isChangingLanguage.current = false;
            }, 300);
        }
    }, [currentLocale, setLocale, router, isChanging]);

    const handleOpenChange = useCallback((open: boolean) => {
        if (!isChangingLanguage.current && !isChanging) {
            setIsMenuOpen(open);
        }
    }, [isChanging]);

    // Loading state
    if (!isMounted || !currentLocaleData) {
        return (
            <div className="size-8 flex items-center justify-center">
                <div className="h-8 w-8 animate-pulse rounded-full bg-gradient-to-r from-foreground/20 to-foreground/10" />
                <span className="sr-only">Loading language switcher</span>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div
                className="size-8 flex items-center justify-center bg-destructive/10 rounded-full cursor-pointer"
                onClick={() => clearError()}
                title={`Error: ${error}. Click to retry.`}
            >
                <Icon name="InfoIcon"  size={16} className="text-destructive" />
                <span className="sr-only">Language switcher error: {error}</span>
            </div>
        );
    }

    return (
        <DropdownMenu open={isMenuOpen} onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger
                asChild
                aria-label={`Change language, current: ${currentLocaleData.name}`}
                disabled={isChanging}
                className={cn(className)}
            >
                <div
                    className={cn(
                        'size-8 bg-muted/60 rounded-full flex items-center justify-center cursor-pointer',
                        'hover:bg-accent/80 hover:shadow-lg hover:scale-105',
                        'active:scale-95 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                        'transition-all duration-200 ease-out',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        isChanging && 'animate-pulse cursor-wait',
                        isRTL && 'rtl'
                    )}
                >
                    {isChanging ? (
                        <Icon name="SpinnerIcon" size={16} className="animate-spin" />
                    ) : (
                        <span
                            className={cn(
                                "text-[16px] transition-all duration-200",
                                "group-hover:scale-110"
                            )}
                            key={`flag-${currentLocale}`} // Forces re-render on locale change
                            aria-hidden="true"
                        >
                            {currentLocaleData.flag}
                        </span>
                    )}
                </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-[180px] min-w-[180px] rounded-lg"
                side="bottom"
                align={isRTL ? "end" : "start"}
                sideOffset={12}
                alignOffset={isRTL ? 2 : -2}
                collisionPadding={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                {availableLocales.map(({ code, flag, name }) => {
                    const isSelected = code === currentLocale;

                    return (
                        <DropdownMenuItem
                            key={code}
                            onSelect={(event) => handleLanguageSelect(code, event as unknown as React.MouseEvent)}
                            disabled={isChanging}
                            className={cn(
                                'flex items-center justify-between gap-3 cursor-pointer',
                                'focus:bg-accent/50 focus:text-accent-foreground',
                                isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left',
                                isSelected
                                    ? 'bg-gradient-to-r from-primary/10 to-primary/5 text-primary dark:text-primary-foreground font-medium'
                                    : 'hover:bg-gradient-to-r hover:from-accent/50 hover:to-transparent',
                                isChanging && 'opacity-50 cursor-wait'
                            )}
                        >
                            <div className={cn(
                                "flex items-center gap-3",
                                isRTL ? 'flex-row-reverse' : 'flex-row'
                            )}>
                                <span className="text-lg" aria-hidden="true">
                                    {flag}
                                </span>
                                <span className="text-sm font-medium truncate">
                                    {name}
                                </span>
                            </div>

                            {isSelected && (
                                <Icon name="CheckIcon"
                                    size={16}
                                    className="text-primary dark:text-primary-foreground shrink-0"
                                    aria-hidden="true"
                                />
                            )}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
});

LanguageSwitcher.displayName = 'LanguageSwitcher';

export default LanguageSwitcher;