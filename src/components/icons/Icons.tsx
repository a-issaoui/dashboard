// src/components/icons/Icons.tsx
import { memo, Suspense } from 'react';
import type { Icon as PhosphorIcon } from '@phosphor-icons/react';

// Icon name type for better TypeScript support
export type IconName =
    | 'Dashboard' | 'Users' | 'Settings' | 'Home' | 'Profile'
    | 'Shield' | 'Bell' | 'Search' | 'Menu' | 'Check'
    | 'CaretRight' | 'CaretLeft' | 'CaretDown' | 'CaretUp'
    | 'ThemeLight' | 'ThemeDark' | 'Spinner' | 'SignOut';

// Icon cache for performance
const iconCache = new Map<IconName, PhosphorIcon>();

// Dynamic icon loader with error handling
export const getIcon = async (iconName: IconName): Promise<PhosphorIcon | null> => {
    if (iconCache.has(iconName)) {
        return iconCache.get(iconName)!;
    }

    try {
        // Dynamic import based on icon name
        const iconModule = await import('@phosphor-icons/react').then(mod => ({
            Dashboard: mod.WindowsLogoIcon,
            Users: mod.UsersIcon,
            Settings: mod.GearIcon,
            Home: mod.HouseLineIcon,
            Profile: mod.UserCircleIcon,
            Shield: mod.ShieldIcon,
            Bell: mod.BellIcon,
            Search: mod.ListMagnifyingGlassIcon,
            Menu: mod.SquaresFourIcon,
            Check: mod.CheckIcon,
            CaretRight: mod.CaretRightIcon,
            CaretLeft: mod.CaretLeftIcon,
            CaretDown: mod.CaretDownIcon,
            CaretUp: mod.CaretUpIcon,
            ThemeLight: mod.SunIcon,
            ThemeDark: mod.MoonIcon,
            Spinner: mod.SpinnerIcon,
            SignOut: mod.SignOutIcon,
        }));

        const IconComponent = iconModule[iconName];
        if (IconComponent) {
            iconCache.set(iconName, IconComponent);
            return IconComponent;
        }
    } catch (error) {
        console.warn(`Failed to load icon: ${iconName}`, error);
    }

    return null;
};

// Optimized Icon component with suspense
interface IconProps {
    name: IconName;
    size?: number;
    weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
    className?: string;
}

const IconFallback = ({ size = 24 }: { size?: number }) => (
    <div
        className="bg-gray-200 animate-pulse rounded"
        style={{ width: size, height: size }}
    />
);

export const Icon = memo<IconProps>(({ name, size = 24, weight = 'regular', className }) => {
    const [IconComponent, setIconComponent] = useState<PhosphorIcon | null>(null);

    useEffect(() => {
        getIcon(name).then(setIconComponent);
    }, [name]);

    if (!IconComponent) {
        return <IconFallback size={size} />;
    }

    return (
        <Suspense fallback={<IconFallback size={size} />}>
            <IconComponent size={size} weight={weight} className={className} />
        </Suspense>
    );
});

Icon.displayName = 'Icon';