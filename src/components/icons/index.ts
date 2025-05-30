
// =============================================================================
// 📁 src/components/icons/index.ts
// Core component exports
export { Icon } from './components/Icon';
export { IconButton } from './components/IconButton';

// Utility components
export {
    LoadingIcon,
    ErrorIcon,
    SuccessIcon,
    WarningIcon,
    InfoIcon,
} from './components/utility-icons';

// Types
export type {
    IconSize,
    IconWeight,
    IconProps,
    EnhancedIconProps,
    IconCategory,
    IconMetadata,
    IconSearchResult,
    IconButtonProps,
} from './types';

// Constants and utilities
export {
    iconSizes,
    RTL_FLIP_ICONS,
    ICON_ALIASES,
    getIconSize,
    shouldFlipInRTL,
    resolveIconAlias,
} from './constants';

// Utilities
export {
    loadIcon,
    preloadIcons,
    getIconSync,
    clearIconCache,
} from './utils/icon-registry';

export {
    searchIcons,
    getIconsByCategory,
    getAvailableCategories,
} from './utils/search';

// Category exports for tree-shaking
export * as Categories from './categories';

// Re-export Phosphor types for convenience
export type { Icon as PhosphorIcon } from '@phosphor-icons/react';