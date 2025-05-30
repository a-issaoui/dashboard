// =============================================================================
// 📁 src/components/icons/utils/search.ts
import type { IconMetadata, IconSearchResult } from '../types';

// Icon metadata for search (this would be generated or maintained)
const iconMetadata: IconMetadata[] = [
    {
        name: 'House',
        category: 'navigation',
        keywords: ['home', 'main', 'start', 'building', 'residence'],
        rtlFlip: false,
        aliases: ['home'],
    },
    {
        name: 'ArrowLeft',
        category: 'navigation',
        keywords: ['arrow', 'left', 'back', 'previous', 'direction'],
        rtlFlip: true,
        aliases: ['back'],
    },
    {
        name: 'ArrowRight',
        category: 'navigation',
        keywords: ['arrow', 'right', 'forward', 'next', 'direction'],
        rtlFlip: true,
        aliases: ['forward'],
    },
    {
        name: 'SquaresFour',
        category: 'interface',
        keywords: ['dashboard', 'grid', 'squares', 'menu', 'apps'],
        rtlFlip: false,
        aliases: ['dashboard'],
    },
    {
        name: 'User',
        category: 'interface',
        keywords: ['person', 'account', 'profile', 'avatar'],
        rtlFlip: false,
        aliases: ['profile'],
    },
    {
        name: 'Users',
        category: 'interface',
        keywords: ['people', 'group', 'team', 'multiple'],
        rtlFlip: false,
        aliases: ['users'],
    },
    {
        name: 'Gear',
        category: 'interface',
        keywords: ['settings', 'configuration', 'options', 'preferences'],
        rtlFlip: false,
        aliases: ['settings'],
    },
    {
        name: 'Bell',
        category: 'communication',
        keywords: ['notification', 'alert', 'sound', 'ring'],
        rtlFlip: false,
        aliases: ['notification'],
    },
    {
        name: 'MagnifyingGlass',
        category: 'interface',
        keywords: ['search', 'find', 'look', 'magnify'],
        rtlFlip: false,
        aliases: ['search'],
    },
    {
        name: 'Plus',
        category: 'interface',
        keywords: ['add', 'create', 'new', 'insert'],
        rtlFlip: false,
        aliases: ['add'],
    },
    {
        name: 'X',
        category: 'interface',
        keywords: ['close', 'cancel', 'delete', 'remove'],
        rtlFlip: false,
        aliases: ['close'],
    },
    {
        name: 'Check',
        category: 'interface',
        keywords: ['success', 'confirm', 'done', 'complete'],
        rtlFlip: false,
        aliases: ['success'],
    },
    {
        name: 'Spinner',
        category: 'interface',
        keywords: ['loading', 'progress', 'wait', 'spinning'],
        rtlFlip: false,
        aliases: ['loading'],
    },
    {
        name: 'Sun',
        category: 'interface',
        keywords: ['light', 'theme', 'bright', 'day'],
        rtlFlip: false,
        aliases: ['light'],
    },
    {
        name: 'Moon',
        category: 'interface',
        keywords: ['dark', 'theme', 'night', 'sleep'],
        rtlFlip: false,
        aliases: ['dark'],
    },
];

// Search icons by query
export const searchIcons = (
    query: string,
    category?: string,
    limit: number = 50
): IconSearchResult[] => {
    const searchTerm = query.toLowerCase().trim();

    if (!searchTerm) {
        return [];
    }

    const results: IconSearchResult[] = [];

    for (const metadata of iconMetadata) {
        // Skip if category filter doesn't match
        if (category && metadata.category !== category) {
            continue;
        }

        let relevance = 0;

        // Exact name match (highest relevance)
        if (metadata.name.toLowerCase() === searchTerm) {
            relevance = 100;
        }
        // Name starts with search term
        else if (metadata.name.toLowerCase().startsWith(searchTerm)) {
            relevance = 90;
        }
        // Name contains search term
        else if (metadata.name.toLowerCase().includes(searchTerm)) {
            relevance = 70;
        }
        // Alias match
        else if (metadata.aliases?.some(alias =>
            alias.toLowerCase().includes(searchTerm)
        )) {
            relevance = 80;
        }
        // Keyword match
        else if (metadata.keywords.some(keyword =>
            keyword.toLowerCase().includes(searchTerm)
        )) {
            relevance = 60;
        }

        if (relevance > 0) {
            results.push({
                name: metadata.name,
                category: metadata.category,
                relevance,
                metadata,
            });
        }
    }

    // Sort by relevance (highest first) and limit results
    return results
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, limit);
};

// Get icons by category
export const getIconsByCategory = (category: string): string[] => {
    return iconMetadata
        .filter(meta => meta.category === category)
        .map(meta => meta.name);
};

// Get all available categories
export const getAvailableCategories = (): string[] => {
    const categories = new Set(iconMetadata.map(meta => meta.category));
    return Array.from(categories).sort();
};
