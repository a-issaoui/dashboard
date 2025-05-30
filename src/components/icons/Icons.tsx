// src/components/icons/Icons.tsx
'use client';

import {
    WindowsLogoIcon,
    SquaresFourIcon,
    GearIcon,
    UserCircleIcon,
    PlusIcon,
    MinusIcon,
    CaretCircleDownIcon,
    CaretCircleUpIcon,
    MoonIcon,
    SunIcon,
    ArrowLineRightIcon,
    ArrowLineLeftIcon,
    ListMagnifyingGlassIcon,
    SignOutIcon,
    SignInIcon,
    UserSwitchIcon,
    UserListIcon,
    UserCirclePlusIcon,
    BellIcon,
    BellRingingIcon,
    LockIcon,
    LockOpenIcon,
    FilePdfIcon,
    FileTxtIcon,
    FileXlsIcon,
    FileImageIcon,
    PrinterIcon,
    TrashIcon,
    EyeIcon,
    PencilIcon,
    DotIcon,
    TranslateIcon,
    SlidersIcon,
    DotOutlineIcon,
    CaretUpDownIcon,
    CreditCardIcon,
    HouseLineIcon,
    UsersIcon,
    LockKeyIcon,
    ShieldIcon,
    SpinnerIcon,
    CheckIcon,
    CaretLeftIcon,
    CaretRightIcon,
    CaretUpIcon,
    CaretDownIcon,
    InfoIcon,
    ChatTextIcon,
    type Icon as PhosphorIcon,
} from "@phosphor-icons/react";

// Define the icon component type
type IconComponent = PhosphorIcon;

// Icons mapping object with proper typing
export const Icons = {
    // Navigation & Core UI
    Dashboard: WindowsLogoIcon,
    Menu: SquaresFourIcon,
    Settings: GearIcon,
    Home: HouseLineIcon,

    // User Management
    UserCircle: UserCircleIcon,
    Profile: UserCircleIcon,
    Users: UsersIcon,
    UserList: UserListIcon,
    UserAdd: UserCirclePlusIcon,
    UserChange: UserSwitchIcon,

    // Permissions & Security
    Shield: ShieldIcon,
    Permission: LockKeyIcon,
    Lock: LockIcon,
    Unlock: LockOpenIcon,

    // Actions & Controls
    Add: PlusIcon,
    Remove: MinusIcon,
    View: EyeIcon,
    Edit: PencilIcon,
    Trash: TrashIcon,
    Delete: TrashIcon,
    Search: ListMagnifyingGlassIcon,
    Print: PrinterIcon,
    Filters: SlidersIcon,

    // Notifications & Alerts
    Notification: BellIcon,
    NotificationActive: BellRingingIcon,
    Bell: BellIcon,
    Info: InfoIcon,

    // Communication
    MessageSquare: ChatTextIcon,

    // Carets & Arrows
    CaretDownCircle: CaretCircleDownIcon,
    CaretUpCircle: CaretCircleUpIcon,
    CaretRight: CaretRightIcon,
    CaretLeft: CaretLeftIcon,
    CaretUp: CaretUpIcon,
    CaretDown: CaretDownIcon,
    CaretSort: CaretUpDownIcon,
    ArrowRight: ArrowLineRightIcon,
    ArrowLeft: ArrowLineLeftIcon,

    // Files
    FilePdf: FilePdfIcon,
    FileText: FileTxtIcon,
    FileExcel: FileXlsIcon,
    FileImage: FileImageIcon,

    // Theme & Display
    ThemeDark: MoonIcon,
    ThemeLight: SunIcon,
    Translate: TranslateIcon,

    // Status & Lists
    ListDot: DotIcon,
    ListDotOutline: DotOutlineIcon,
    Check: CheckIcon,

    // Auth
    SignIn: SignInIcon,
    SignOut: SignOutIcon,

    // Misc
    Billing: CreditCardIcon,
    Spinner: SpinnerIcon,
    Loader2: SpinnerIcon, // Alias for compatibility
} as const;

// Type for available icon names
export type IconName = keyof typeof Icons;

// Props interface for icon components
interface IconProps {
    size?: number | string;
    weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
    className?: string;
}

// Optimized helper function with better error handling and caching
const iconCache = new Map<IconName, IconComponent>();

export const getIcon = (iconName: IconName): IconComponent | null => {
    if (!iconName || typeof iconName !== 'string') {
        console.warn('getIcon: iconName must be a valid string.');
        return null;
    }

    // Check cache first for performance
    if (iconCache.has(iconName)) {
        return iconCache.get(iconName) || null;
    }

    const IconComponent = Icons[iconName];

    if (!IconComponent) {
        console.warn(`getIcon: Icon "${iconName}" not found in Icons object.`);
        iconCache.set(iconName, IconComponent);
        return null;
    }

    // Cache the result
    iconCache.set(iconName, IconComponent);
    return IconComponent;
};

// Generic Icon component with type safety
interface GenericIconProps extends IconProps {
    name: IconName;
}

export const Icon: React.FC<GenericIconProps> = ({
                                                     name,
                                                     size = 24,
                                                     weight = "regular",
                                                     className,
                                                     ...props
                                                 }) => {
    const IconComponent = getIcon(name);

    if (!IconComponent) {
        // Fallback to a default icon
        return <Icons.Info size={size} weight={weight} className={className} {...props} />;
    }

    return <IconComponent size={size} weight={weight} className={className} {...props} />;
};

// Optional: Clear cache if needed (useful for development)
export const clearIconCache = (): void => {
    iconCache.clear();
    console.log('Icon cache cleared.');
};

// Get all available icon names
export const getAvailableIcons = (): IconName[] => {
    return Object.keys(Icons) as IconName[];
};

// Type exports for external use
export type { IconComponent, IconProps, GenericIconProps };