// =============================================================================
// 📁 src/components/icons/components/IconButton.tsx
import React from 'react';
import { Icon } from './Icon';
import type { IconButtonProps } from '../types';

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
    ({
         icon,
         iconSize = 'md',
         iconWeight = 'regular',
         loading = false,
         rtlFlip = false,
         className,
         disabled,
         children,
         ...props
     }, ref) => {
        return (
            <button
                ref={ref}
                className={`inline-flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${className || ''}`}
                disabled={disabled || loading}
                {...props}
            >
                {loading ? (
                    <Icon name="Spinner" size={iconSize} className="animate-spin" />
                ) : (
                    <Icon
                        name={icon}
                        size={iconSize}
                        weight={iconWeight}
                        rtlFlip={rtlFlip}
                    />
                )}
                {children}
            </button>
        );
    }
);

IconButton.displayName = 'IconButton';