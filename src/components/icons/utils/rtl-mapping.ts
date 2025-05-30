
// =============================================================================
// 📁 src/components/icons/utils/rtl-mapping.ts
import { RTL_FLIP_ICONS } from '../constants';

// Enhanced RTL mapping for complex icon transformations
export const RTL_ICON_MAPPING = {
    // Direct opposites
    'ArrowLeft': 'ArrowRight',
    'ArrowRight': 'ArrowLeft',
    'CaretLeft': 'CaretRight',
    'CaretRight': 'CaretLeft',
    'ArrowCircleLeft': 'ArrowCircleRight',
    'ArrowCircleRight': 'ArrowCircleLeft',
    'ChevronLeft': 'ChevronRight',
    'ChevronRight': 'ChevronLeft',

    // Alignment
    'AlignLeft': 'AlignRight',
    'AlignRight': 'AlignLeft',
    'TextAlignLeft': 'TextAlignRight',
    'TextAlignRight': 'TextAlignLeft',

    // Navigation
    'SkipBack': 'SkipForward',
    'SkipForward': 'SkipBack',
    'SignIn': 'SignOut',
    'SignOut': 'SignIn',

    // Layout
    'SidebarSimple': 'SidebarSimple', // Same icon, just flipped
    'Sidebar': 'Sidebar', // Same icon, just flipped
} as const;

// Get RTL equivalent of an icon
export const getRTLIcon = (iconName: string, forceFlip: boolean = false): string => {
    // If forcing flip or icon is in RTL flip list
    if (forceFlip || RTL_FLIP_ICONS.has(iconName)) {
        // Check if we have a direct mapping
        const mapping = RTL_ICON_MAPPING[iconName as keyof typeof RTL_ICON_MAPPING];
        if (mapping) {
            return mapping;
        }
        // Otherwise return the same icon (will be CSS flipped)
        return iconName;
    }

    return iconName;
};

// Check if current environment is RTL
export const isRTLEnvironment = (): boolean => {
    if (typeof document === 'undefined') return false;
    return document.documentElement.dir === 'rtl' ||
        document.documentElement.getAttribute('data-direction') === 'rtl';
};
