
// =============================================================================
// 📁 src/components/icons/constants.ts
import type { IconCategory, IconSize } from './types';

// RTL-aware icons that should flip
export const RTL_FLIP_ICONS = new Set([
    'ArrowLeft', 'ArrowRight', 'ArrowLineLeft', 'ArrowLineRight',
    'CaretLeft', 'CaretRight', 'CaretLineLeft', 'CaretLineRight',
    'CaretDoubleLeft', 'CaretDoubleRight',
    'ArrowElbowLeft', 'ArrowElbowRight', 'ArrowBendLeft', 'ArrowBendRight',
    'ArrowCircleLeft', 'ArrowCircleRight', 'ArrowSquareLeft', 'ArrowSquareRight',
    'SkipBack', 'SkipForward', 'FastForward', 'Rewind',
    'SignIn', 'SignOut', 'Export', 'Share', 'ShareNetwork',
    'Download', 'Upload', 'Sidebar', 'SidebarSimple',
    'AlignLeft', 'AlignRight', 'TextAlignLeft', 'TextAlignRight',
    'TextIndent', 'TextOutdent', 'PaperPlane', 'PaperPlaneRight',
    'ToggleLeft', 'ToggleRight', 'ThumbsUp', 'ThumbsDown'
]);

// Common icon aliases for easier usage
export const ICON_ALIASES = {
    // Navigation
    'menu': 'List',
    'hamburger': 'List',
    'close': 'X',
    'back': 'ArrowLeft',
    'forward': 'ArrowRight',
    'up': 'ArrowUp',
    'down': 'ArrowDown',

    // Interface
    'add': 'Plus',
    'remove': 'Minus',
    'delete': 'Trash',
    'edit': 'PencilSimple',
    'save': 'FloppyDisk',
    'copy': 'Copy',
    'paste': 'Clipboard',
    'cut': 'Scissors',

    // Media
    'play': 'Play',
    'pause': 'Pause',
    'stop': 'Stop',
    'volume': 'SpeakerHigh',
    'mute': 'SpeakerSlash',

    // Status
    'success': 'CheckCircle',
    'error': 'XCircle',
    'warning': 'Warning',
    'info': 'Info',
    'loading': 'Spinner',

    // Communication
    'email': 'Envelope',
    'phone': 'Phone',
    'message': 'Chat',
    'notification': 'Bell',

    // File types
    'file': 'File',
    'folder': 'Folder',
    'image': 'Image',
    'video': 'Video',
    'audio': 'MusicNote',
    'document': 'FileText',

    // Common UI
    'home': 'House',
    'dashboard': 'SquaresFour',
    'settings': 'Gear',
    'profile': 'UserCircle',
    'users': 'Users',
    'search': 'MagnifyingGlass',
    'filter': 'Funnel',
    'sort': 'SortAscending',

    // Theme
    'light': 'Sun',
    'dark': 'Moon',
    'auto': 'CircleHalf',
} as const;

export const iconSizes = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
    '2xl': 40,
    '3xl': 48,
} as const;

// Icon size utilities
export const getIconSize = (size: IconSize): number => {
    if (typeof size === 'number') return size;
    if (typeof size === 'string' && size in iconSizes) {
        return iconSizes[size as keyof typeof iconSizes];
    }
    return iconSizes.md; // default
};

// Check if icon should flip in RTL
export const shouldFlipInRTL = (iconName: string): boolean => {
    return RTL_FLIP_ICONS.has(iconName);
};

// Resolve icon alias to actual icon name
export const resolveIconAlias = (name: string): string => {
    return ICON_ALIASES[name as keyof typeof ICON_ALIASES] || name;
};