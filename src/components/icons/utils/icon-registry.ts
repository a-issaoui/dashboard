// =============================================================================
// 📁 src/components/icons/utils/icon-registry.ts
import type { Icon } from '../types';

// Dynamic import cache
const iconCache = new Map<string, Icon>();
const importPromises = new Map<string, Promise<Icon>>();

// Dynamically import icon by name
export const loadIcon = async (iconName: string): Promise<Icon | null> => {
    // Check cache first
    if (iconCache.has(iconName)) {
        return iconCache.get(iconName)!;
    }

    // Check if already importing
    if (importPromises.has(iconName)) {
        return await importPromises.get(iconName)!;
    }

    // Create import promise
    const importPromise = (async (): Promise<Icon> => {
        try {
            // Dynamic import from Phosphor
            const module = await import('@phosphor-icons/react');
            const IconComponent = module[iconName as keyof typeof module] as Icon;

            if (!IconComponent) {
                throw new Error(`Icon "${iconName}" not found`);
            }

            iconCache.set(iconName, IconComponent);
            return IconComponent;
        } catch (error) {
            console.warn(`Failed to load icon "${iconName}":`, error);
            throw error;
        } finally {
            importPromises.delete(iconName);
        }
    })();

    importPromises.set(iconName, importPromise);
    return await importPromise;
};

// Preload commonly used icons
export const preloadIcons = async (iconNames: string[]): Promise<void> => {
    const promises = iconNames.map(name => loadIcon(name));
    await Promise.allSettled(promises);
};

// Get icon synchronously (returns null if not cached)
export const getIconSync = (iconName: string): Icon | null => {
    return iconCache.get(iconName) || null;
};

// Clear cache (useful for testing)
export const clearIconCache = (): void => {
    iconCache.clear();
    importPromises.clear();
};