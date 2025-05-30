import {
    // Latin fonts - you can change these
    Geist,
    Geist_Mono,
    Poppins,        // Changed from Instrument_Sans
    Inter,
    Open_Sans,      // Changed from Mulish
    Noto_Sans_Mono,

    // Arabic fonts - you can change these
    Noto_Naskh_Arabic,
    Noto_Sans_Arabic,
    Amiri,
    Almarai,        // New Arabic font option
    IBM_Plex_Sans_Arabic, // New Arabic font option
} from 'next/font/google';

import { cn } from '@/lib/utils';

// Latin fonts
const fontSans = Geist({
    subsets: ['latin'],
    variable: '--font-sans',
    display: 'swap'
});

const fontMono = Geist_Mono({
    subsets: ['latin'],
    variable: '--font-mono',
    display: 'swap'
});

const fontPoppins = Poppins({
    subsets: ['latin'],
    variable: '--font-poppins',
    weight: ['300', '400', '500', '600', '700'],
    display: 'swap'
});

const fontNotoMono = Noto_Sans_Mono({
    subsets: ['latin'],
    variable: '--font-noto-mono',
    display: 'swap'
});

const fontOpenSans = Open_Sans({
    subsets: ['latin'],
    variable: '--font-open-sans',
    display: 'swap'
});

const fontInter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap'
});

// Arabic fonts
const fontNotoNaskhArabic = Noto_Naskh_Arabic({
    subsets: ['arabic'],
    variable: '--font-noto-naskh-arabic',
    display: 'swap'
});

const fontNotoSansArabic = Noto_Sans_Arabic({
    subsets: ['arabic'],
    variable: '--font-noto-sans-arabic',
    display: 'swap'
});

const fontAmiri = Amiri({
    subsets: ['arabic'],
    variable: '--font-amiri',
    weight: ['400','700'],
    display: 'swap'
});

const fontAlmarai = Almarai({
    subsets: ['arabic'],
    variable: '--font-almarai',
    weight: ['300', '400', '700', '800'],
    display: 'swap'
});

const fontIBMPlexArabic = IBM_Plex_Sans_Arabic({
    subsets: ['arabic'],
    variable: '--font-ibm-plex-arabic',
    weight: ['300', '400', '500', '600', '700'],
    display: 'swap'
});

// Combined font variables
export const fontVariables = cn(
    // Latin fonts
    fontSans.variable,
    fontMono.variable,
    fontPoppins.variable,
    fontNotoMono.variable,
    fontOpenSans.variable,
    fontInter.variable,
    // Arabic fonts
    fontNotoNaskhArabic.variable,
    fontNotoSansArabic.variable,
    fontAmiri.variable,
    fontAlmarai.variable,
    fontIBMPlexArabic.variable
);

// Updated font utility classes
export const fontClasses = {
    // Latin fonts
    sans: 'font-sans',
    mono: 'font-mono',
    poppins: 'font-poppins',
    notoMono: 'font-noto-mono',
    openSans: 'font-open-sans',
    inter: 'font-inter',

    // Arabic fonts
    notoNaskhArabic: 'font-noto-naskh-arabic',
    notoSansArabic: 'font-noto-sans-arabic',
    amiri: 'font-amiri',
    almarai: 'font-almarai',
    ibmPlexArabic: 'font-ibm-plex-arabic',

    // RTL-aware font selection - customize these mappings
    rtlSans: 'ltr:font-sans rtl:font-almarai',           // Changed RTL font
    rtlMono: 'ltr:font-mono rtl:font-noto-mono',
    rtlTitle: 'ltr:font-poppins rtl:font-ibm-plex-arabic', // Changed both fonts
    rtlBody: 'ltr:font-inter rtl:font-noto-sans-arabic',
    rtlSerif: 'ltr:font-sans rtl:font-amiri',
};

// Updated font stacks
export const fontStacks = {
    latin: {
        sans: `var(--font-sans), ui-sans-serif, system-ui, sans-serif`,
        mono: `var(--font-mono), ui-monospace, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace`,
        poppins: `var(--font-poppins), ui-sans-serif, system-ui, sans-serif`,
        inter: `var(--font-inter), ui-sans-serif, system-ui, sans-serif`,
        openSans: `var(--font-open-sans), ui-sans-serif, system-ui, sans-serif`,
    },
    arabic: {
        sans: `var(--font-noto-sans-arabic), 'Arial Unicode MS', Tahoma, sans-serif`,
        naskh: `var(--font-noto-naskh-arabic), 'Traditional Arabic', 'Arial Unicode MS', serif`,
        amiri: `var(--font-amiri), 'Traditional Arabic', 'Times New Roman', serif`,
        almarai: `var(--font-almarai), 'Arial Unicode MS', Tahoma, sans-serif`,
        ibmPlex: `var(--font-ibm-plex-arabic), 'Arial Unicode MS', Tahoma, sans-serif`,
    },
    rtl: {
        sans: `var(--font-almarai), var(--font-sans), ui-sans-serif, system-ui, sans-serif`,
        mono: `var(--font-noto-mono), var(--font-mono), ui-monospace, monospace`,
        title: `var(--font-ibm-plex-arabic), var(--font-poppins), ui-sans-serif, system-ui, sans-serif`,
        body: `var(--font-noto-sans-arabic), var(--font-inter), ui-sans-serif, system-ui, sans-serif`,
        serif: `var(--font-amiri), var(--font-sans), ui-serif, serif`,
    }
};