"use client";

import * as Icons from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/utils";

type IconName = keyof typeof Icons;

export interface IconProps extends React.SVGProps<SVGSVGElement> {
    name: IconName;
    size?: number | string;
    weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
    color?: string;
    isRTL?: boolean;
}

export const Icon = ({
                         name,
                         size = 20,
                         weight = "regular",
                         color = "currentColor",
                         isRTL = false,
                         className,
                         ...props
                     }: IconProps) => {
    const Component = Icons[name] as React.FC<React.SVGProps<SVGSVGElement> & {
        size?: number | string;
        weight?: IconProps["weight"];
        color?: string;
        mirrored?: boolean;
    }>;

    if (!Component) {
        console.warn(`Icon "${name}" not found in @phosphor-icons/react/ssr.`);
        return null;
    }

    return (
        <Component
            size={size}
            weight={weight}
            color={color}
            mirrored={isRTL}
            className={cn("inline", className)}
            {...props}
        />
    );
};
