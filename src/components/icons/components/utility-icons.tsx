// =============================================================================
// 📁 src/components/icons/components/utility-icons.tsx
import React from 'react';
import { Icon } from './Icon';
import type { EnhancedIconProps } from '../types';

export const LoadingIcon = React.forwardRef<SVGSVGElement, Omit<EnhancedIconProps, 'name'>>(
    (props, ref) => (
        <Icon ref={ref} name="Spinner" className="animate-spin" {...props} />
    )
);

LoadingIcon.displayName = 'LoadingIcon';

export const ErrorIcon = React.forwardRef<SVGSVGElement, Omit<EnhancedIconProps, 'name'>>(
    (props, ref) => (
        <Icon ref={ref} name="XCircle" className="text-destructive" {...props} />
    )
);

ErrorIcon.displayName = 'ErrorIcon';

export const SuccessIcon = React.forwardRef<SVGSVGElement, Omit<EnhancedIconProps, 'name'>>(
    (props, ref) => (
        <Icon ref={ref} name="CheckCircle" className="text-green-500" {...props} />
    )
);

SuccessIcon.displayName = 'SuccessIcon';

export const WarningIcon = React.forwardRef<SVGSVGElement, Omit<EnhancedIconProps, 'name'>>(
    (props, ref) => (
        <Icon ref={ref} name="Warning" className="text-yellow-500" {...props} />
    )
);

WarningIcon.displayName = 'WarningIcon';

export const InfoIcon = React.forwardRef<SVGSVGElement, Omit<EnhancedIconProps, 'name'>>(
    (props, ref) => (
        <Icon ref={ref} name="Info" className="text-blue-500" {...props} />
    )
);

InfoIcon.displayName = 'InfoIcon';