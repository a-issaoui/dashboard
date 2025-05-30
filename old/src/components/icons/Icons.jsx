// Icons.jsx
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
    InfoIcon,         // Added for Info
    ChatTextIcon      // Added for MessageSquare
} from "@phosphor-icons/react";

export const Icons = {
    // Navigation & Core UI
    Dashboard: WindowsLogoIcon,
    Menu: SquaresFourIcon,
    Settings: GearIcon,
    Home: HouseLineIcon,

    // User Management
    UserCircle: UserCircleIcon,     // Explicitly added for direct use (e.g., NotificationBell)
    Profile: UserCircleIcon,        // Existing mapping
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
    Trash: TrashIcon,               // Explicitly added for direct use (e.g., NotificationBell)
    Delete: TrashIcon,              // Existing mapping
    Search: ListMagnifyingGlassIcon,
    Print: PrinterIcon,
    Filters: SlidersIcon,

    // Notifications & Alerts
    Notification: BellIcon,
    NotificationActive: BellRingingIcon,
    Bell: BellIcon,                 // Added for direct use (e.g., as a fallback in NotificationBell)
    Info: InfoIcon,                 // Added for informational messages

    // Communication
    MessageSquare: ChatTextIcon,    // Added for messages/comments

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
};

// Optimized helper function with better error handling and caching
const iconCache = new Map();

export const getIcon = (iconName) => {
    if (!iconName || typeof iconName !== 'string') {
        // console.warn('getIcon: iconName must be a non-empty string.', iconName);
        return null;
    }

    // Check cache first for performance
    if (iconCache.has(iconName)) {
        return iconCache.get(iconName);
    }

    const IconComponent = Icons[iconName];

    // if (!IconComponent) {
    //     console.warn(`getIcon: Icon "${iconName}" not found in Icons object.`);
    // }

    // Cache the result (even if null) to avoid repeated lookups
    iconCache.set(iconName, IconComponent || null);

    return IconComponent || null;
};

// Optional: Clear cache if needed (useful for development)
export const clearIconCache = () => {
    iconCache.clear();
    // console.log('Icon cache cleared.');
};

// Optional: Get all available icon names
export const getAvailableIcons = () => {
    return Object.keys(Icons);
};
