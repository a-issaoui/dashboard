// UserNavbar.jsx - Enhanced with image optimization and better UX
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { UserMenu } from "@/components/layouts/admin/UserMenu";
import { Icons } from "@/components/icons/Icons";
import * as React from "react";
import { cn } from '@/lib/utils';
import { useNavbar } from '@/components/layouts/admin/navbar/Navbar';

export function UserNavbar({ user }) {
    const { activeDropdown, setActiveDropdown } = useNavbar();
    const [imageLoaded, setImageLoaded] = React.useState(false);
    const [imageError, setImageError] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);

    const isMenuOpen = activeDropdown === 'user';

    React.useEffect(() => {
        if (user?.imageUrl) {
            // Preload the image
            const img = new Image();
            img.onload = () => setImageLoaded(true);
            img.onerror = () => setImageError(true);
            img.src = user.imageUrl;
        }
    }, [user?.imageUrl]);

    const handleOpenChange = React.useCallback((open) => {
        setActiveDropdown(open ? 'user' : null);
    }, [setActiveDropdown]);

    const handleInteraction = React.useCallback(() => {
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(1);
        }
    }, []);

    if (!user) {
        return null;
    }

    const initials = user.name
        ?.split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(word => word[0].toUpperCase())
        .join('') || 'CN';

    return (
        <DropdownMenu open={isMenuOpen} onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger
                className={cn(
                    "rounded-full cursor-pointer ms-4 min-w-[44px] min-h-[44px] touch-manipulation select-none",
                    // Remove default focus outline and add custom focus styles
                    "outline-none focus:outline-none focus-visible:outline-none",
                    // Add custom focus ring that matches your design
                    "focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    // Ensure no browser default focus styles
                    "[&:focus]:outline-none [&:focus-visible]:outline-none"
                )}
                onClick={handleInteraction}
                aria-label={`User menu for ${user.name || 'User'}, ${isMenuOpen ? 'close' : 'open'} menu`}
            >
                <div
                    className={cn(
                        "group flex items-center gap-2",
                        "transition-all duration-300 ease-in-out",
                        "hover:opacity-90",
                        // Remove any focus outlines from this div
                        "outline-none focus:outline-none [&:focus]:outline-none"
                    )}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className="relative">
                        <div className={cn(
                            "size-10 bg-muted rounded-full border-2 border-green-500 flex items-center justify-center transition-all duration-300 overflow-hidden",
                            "hover:bg-accent/80 hover:shadow-lg hover:shadow-green-500/20",
                            "hover:border-green-400 hover:scale-105",
                            // Add focus states to the avatar container instead
                            "group-focus-visible:shadow-lg group-focus-visible:shadow-green-500/30 group-focus-visible:border-green-400"
                        )}>
                            <Avatar className={cn(
                                "size-8 rounded-full transition-all duration-300",
                                "hover:scale-110"
                            )}>
                                <AvatarImage
                                    src={user.imageUrl}
                                    alt={user.name || 'User Avatar'}
                                    loading="lazy"
                                    onLoad={() => setImageLoaded(true)}
                                    onError={() => setImageError(true)}
                                    className={cn(
                                        "transition-all duration-300 object-cover",
                                        !imageLoaded && "opacity-0 scale-95",
                                        imageLoaded && "opacity-100 scale-100"
                                    )}
                                />
                                <AvatarFallback
                                    className={cn(
                                        "rounded-full bg-gradient-to-br from-primary/10 to-primary/5 font-medium text-primary text-xs transition-all duration-300",
                                        "hover:from-primary/20 hover:to-primary/10 hover:scale-110"
                                    )}
                                >
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        {/* Enhanced online status indicator */}
                        <span
                            className={cn(
                                "absolute bottom-0 end-0 block h-3 w-3 rounded-full border-2 border-white dark:border-gray-800",
                                "bg-gradient-to-r from-green-600 to-green-500 shadow-lg shadow-green-500/50",
                                "transition-all duration-300 ease-in-out",
                                "group-hover:shadow-green-500/70 group-hover:scale-110",
                                isHovered && "animate-pulse"
                            )}
                            title="Online"
                            aria-label="Online status"
                        >
                        </span>
                    </div>

                    {/* Caret with better positioning and animation */}
                    <Icons.CaretDown
                        size={16}
                        className={cn(
                            "text-muted-foreground transition-all duration-300 ease-in-out",
                            "group-hover:text-foreground group-hover:scale-110",
                            isMenuOpen && "rotate-180 text-primary",
                            isHovered && "drop-shadow-sm"
                        )}
                    />
                </div>
            </DropdownMenuTrigger>

            <UserMenu
                user={user}
                side="bottom"
                align="end"
                sideOffset={12}
                alignOffset={-2}
                collisionPadding={{ top: 10, bottom: 10, left: 10, right: 10 }}
            />
        </DropdownMenu>
    );
}