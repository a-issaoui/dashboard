
// =============================================================================
// 📁 src/components/icons/components/Icon.tsx
import React, { Suspense } from 'react';
import type { EnhancedIconProps } from '../types';
import { getIconSize, shouldFlipInRTL, resolveIconAlias } from '../constants';
import { loadIcon, getIconSync } from '../utils/icon-registry';

// Fallback component for loading states
const IconFallback: React.FC<{ size: number; className?: string }> = ({ size, className }) => (
    <div
        className={`inline-block animate-pulse bg-muted rounded ${className || ''}`}
        style={{ width: size, height: size }}
        aria-hidden="true"
    />
);

// Error fallback component
const IconError: React.FC<{ size: number; className?: string }> = ({ size, className }) => (
    <div
        className={`inline-flex items-center justify-center bg-destructive/10 text-destructive text-xs rounded ${className || ''}`}
        style={{ width: size, height: size }}
        title="Icon not found"
    >
        ?
    </div>
);

// Async icon loader component
const AsyncIcon: React.FC<{
    iconName: string;
    size: number;
    weight: any;
    mirrored: boolean;
    className?: string;
    style?: React.CSSProperties;
    fallbackName?: string;
    [key: string]: any;
}> = ({ iconName, size, weight, mirrored, className, style, fallbackName, ...props }) => {
    const [IconComponent, setIconComponent] = React.useState<React.ComponentType<any> | null>(
        () => getIconSync(iconName)
    );
    const [isLoading, setIsLoading] = React.useState(!IconComponent);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (IconComponent) return;

        let isCancelled = false;

        const loadIconAsync = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const LoadedIcon = await loadIcon(iconName);

                if (!isCancelled && LoadedIcon) {
                    setIconComponent(() => LoadedIcon);
                }
            } catch (err) {
                if (!isCancelled) {
                    setError(err instanceof Error ? err.message : 'Failed to load icon');

                    // Try fallback icon if available
                    if (fallbackName && fallbackName !== iconName) {
                        try {
                            const FallbackIcon = await loadIcon(fallbackName);
                            if (FallbackIcon) {
                                setIconComponent(() => FallbackIcon);
                                setError(null);
                            }
                        } catch {
                            // Fallback also failed
                        }
                    }
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        };

        loadIconAsync();

        return () => {
            isCancelled = true;
        };
    }, [iconName, fallbackName]);

    if (isLoading) {
        return <IconFallback size={size} className={className} />;
    }

    if (error || !IconComponent) {
        return <IconError size={size} className={className} />;
    }

    return (
        <IconComponent
            size={size}
            weight={weight}
            mirrored={mirrored}
            className={className}
            style={style}
            {...props}
        />
    );
};

// Main Icon component
export const Icon = React.forwardRef<SVGSVGElement, EnhancedIconProps>(
    ({
         name,
         size = 'md',
         weight = 'regular',
         rtlFlip = false,
         semantic = true,
         fallback,
         className,
         style,
         mirrored,
         ...props
     }, ref) => {
        // Resolve size to number
        const actualSize = React.useMemo(() => getIconSize(size), [size]);

        // Resolve icon name (handle aliases)
        const resolvedName = React.useMemo(() => {
            if (!name) return null;
            return resolveIconAlias(name);
        }, [name]);

        // Determine if icon should be flipped for RTL
        const shouldFlip = React.useMemo(() => {
            if (mirrored !== undefined) return mirrored;
            if (!resolvedName) return false;

            // Auto-flip certain icons in RTL mode
            if (rtlFlip && shouldFlipInRTL(resolvedName)) {
                // Check if we're in RTL mode
                if (typeof document !== 'undefined') {
                    return document.documentElement.dir === 'rtl';
                }
            }

            return false;
        }, [resolvedName, rtlFlip, mirrored]);

        // Enhanced className with RTL support
        const enhancedClassName = React.useMemo(() => {
            const classes = [className];

            if (shouldFlip) {
                classes.push('rtl:scale-x-[-1]');
            }

            if (semantic) {
                classes.push('shrink-0');
            }

            return classes.filter(Boolean).join(' ');
        }, [className, shouldFlip, semantic]);

        if (!resolvedName) {
            if (process.env.NODE_ENV === 'development') {
                console.warn('Icon component requires a "name" prop');
            }
            return null;
        }

        return (
            <Suspense fallback={<IconFallback size={actualSize} className={enhancedClassName} />}>
                <AsyncIcon
                    ref={ref}
                    iconName={resolvedName}
                    size={actualSize}
                    weight={weight}
                    mirrored={shouldFlip}
                    className={enhancedClassName}
                    style={style}
                    fallbackName={fallback}
                    {...props}
                />
            </Suspense>
        );
    }
);

Icon.displayName = 'Icon';