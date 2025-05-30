// 📁 src/components/icons/types.ts
import type { Icon as PhosphorIcon, IconProps as PhosphorIconProps, IconWeight } from '@phosphor-icons/react';

// Re-export Phosphor types
export type { IconWeight, IconProps } from '@phosphor-icons/react';
export type Icon = PhosphorIcon;

// Icon categories based on usage patterns
export type IconCategory =
    | 'navigation' | 'interface' | 'communication' | 'media'
    | 'business' | 'development' | 'social' | 'weather'
    | 'health' | 'transport' | 'shopping' | 'education'
    | 'gaming' | 'security' | 'productivity' | 'design';

// Size system
export const iconSizes = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
    '2xl': 40,
    '3xl': 48,
} as const;

export type IconSize = keyof typeof iconSizes | number | string;

// Enhanced props for our Icon component
export interface EnhancedIconProps extends Omit<PhosphorIconProps, 'weight'> {
    name?: string;
    weight?: IconWeight;
    rtlFlip?: boolean;
    semantic?: boolean;
    fallback?: string;
}

// Icon button props
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: string;
    iconSize?: IconSize;
    iconWeight?: IconWeight;
    loading?: boolean;
    rtlFlip?: boolean;
}

// Icon metadata for search and categorization
export interface IconMetadata {
    name: string;
    category: IconCategory;
    keywords: string[];
    rtlFlip: boolean;
    aliases?: string[];
}

// Search result interface
export interface IconSearchResult {
    name: string;
    category: IconCategory;
    relevance: number;
    metadata: IconMetadata;
}