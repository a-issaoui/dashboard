





















// =============================================================================
// 📁 scripts/generate-icon-metadata.js
/**
 * Script to generate icon metadata from Phosphor icons
 * Run with: node scripts/generate-icon-metadata.js
 */

const fs = require('fs');
const path = require('path');

// Categories and their associated keywords
const ICON_CATEGORIES = {
    navigation: ['arrow', 'caret', 'chevron', 'house', 'home', 'map', 'compass', 'path', 'navigation'],
    interface: ['plus', 'minus', 'x', 'check', 'gear', 'settings', 'slider', 'dot', 'eye', 'lock', 'key', 'shield', 'star', 'heart', 'bookmark', 'flag', 'tag'],
    communication: ['chat', 'envelope', 'phone', 'bell', 'megaphone', 'microphone', 'video', 'share', 'export', 'paper'],
    media: ['play', 'pause', 'stop', 'skip', 'fast', 'rewind', 'repeat', 'shuffle', 'speaker', 'music', 'image', 'camera', 'film', 'palette'],
    business: ['currency', 'dollar', 'credit', 'bank', 'briefcase', 'invoice', 'receipt', 'calculator', 'chart', 'trend', 'graph', 'presentation', 'target', 'handshake', 'medal', 'trophy', 'crown', 'certificate'],
    development: ['code', 'terminal', 'bug', 'database', 'server', 'hard', 'cloud', 'globe', 'network', 'wifi', 'bluetooth', 'cpu', 'memory', 'graphics', 'desktop', 'laptop', 'device', 'browser'],
    social: ['facebook', 'twitter', 'instagram', 'linkedin', 'github', 'google', 'apple', 'microsoft', 'slack', 'discord', 'telegram', 'whatsapp', 'snapchat', 'tiktok', 'youtube', 'spotify', 'twitch', 'reddit', 'pinterest', 'behance', 'dribbble', 'figma', 'notion', 'sketch'],
    files: ['file', 'folder', 'archive', 'document', 'image', 'video', 'audio'],
    transport: ['car', 'truck', 'bus', 'train', 'airplane', 'boat', 'bicycle', 'motorcycle'],
    weather: ['sun', 'moon', 'cloud', 'rain', 'snow', 'lightning', 'wind'],
    health: ['heart', 'medical', 'hospital', 'pill', 'syringe', 'first'],
    shopping: ['shopping', 'cart', 'bag', 'credit', 'money', 'package'],
};

// RTL icons that should flip
const RTL_FLIP_ICONS = [
    'ArrowLeft', 'ArrowRight', 'CaretLeft', 'CaretRight', 'ChevronLeft', 'ChevronRight',
    'ArrowCircleLeft', 'ArrowCircleRight', 'ArrowSquareLeft', 'ArrowSquareRight',
    'SkipBack', 'SkipForward', 'FastForward', 'Rewind',
    'SignIn', 'SignOut', 'Export', 'Share', 'ShareNetwork',
    'AlignLeft', 'AlignRight', 'TextAlignLeft', 'TextAlignRight',
    'Sidebar', 'SidebarSimple', 'PaperPlane', 'PaperPlaneRight'
];

// Common aliases
const ALIASES = {
    'House': ['home'],
    'SquaresFour': ['dashboard', 'grid'],
    'User': ['profile', 'account'],
    'Users': ['people', 'team'],
    'Gear': ['settings', 'config'],
    'Bell': ['notification', 'alert'],
    'MagnifyingGlass': ['search', 'find'],
    'Plus': ['add', 'create'],
    'X': ['close', 'cancel'],
    'Check': ['success', 'done'],
    'Spinner': ['loading', 'progress'],
    'Sun': ['light', 'day'],
    'Moon': ['dark', 'night'],
    'Envelope': ['email', 'mail'],
    'Phone': ['call', 'telephone'],
    'Chat': ['message', 'talk'],
    'ArrowLeft': ['back', 'previous'],
    'ArrowRight': ['forward', 'next'],
    'List': ['menu', 'hamburger'],
    'Trash': ['delete', 'remove'],
    'PencilSimple': ['edit', 'modify'],
    'Copy': ['duplicate', 'clone'],
    'FloppyDisk': ['save', 'store'],
};

// Function to categorize an icon based on its name
function categorizeIcon(iconName) {
    const lowerName = iconName.toLowerCase();

    for (const [category, keywords] of Object.entries(ICON_CATEGORIES)) {
        if (keywords.some(keyword => lowerName.includes(keyword))) {
            return category;
        }
    }

    return 'interface'; // default category
}

// Function to generate keywords for an icon
function generateKeywords(iconName) {
    const keywords = [];
    const lowerName = iconName.toLowerCase();

    // Add the name itself
    keywords.push(lowerName);

    // Add parts of the name
    const parts = iconName.split(/(?=[A-Z])/).map(part => part.toLowerCase());
    keywords.push(...parts);

    // Add common synonyms
    if (lowerName.includes('arrow')) keywords.push('direction', 'navigation');
    if (lowerName.includes('circle')) keywords.push('round', 'circular');
    if (lowerName.includes('square')) keywords.push('rectangular', 'box');
    if (lowerName.includes('simple')) keywords.push('basic', 'minimal');
    if (lowerName.includes('line')) keywords.push('linear', 'outline');

    // Remove duplicates
    return [...new Set(keywords)];
}

// Generate metadata for all icons
function generateIconMetadata() {
    // Read all icon exports from the paste.txt content
    // This would be replaced with actual icon reading logic
    const iconNames = [
        'House', 'ArrowLeft', 'ArrowRight', 'SquaresFour', 'User', 'Users',
        'Gear', 'Bell', 'MagnifyingGlass', 'Plus', 'X', 'Check', 'Spinner',
        'Sun', 'Moon', 'Envelope', 'Phone', 'Chat', 'List', 'Trash',
        'PencilSimple', 'Copy', 'FloppyDisk', 'Eye', 'EyeSlash', 'Lock',
        'LockOpen', 'Key', 'Shield', 'Star', 'Heart', 'Bookmark', 'Flag',
        // Add more icons as needed...
    ];

    const metadata = iconNames.map(iconName => ({
        name: iconName,
        category: categorizeIcon(iconName),
        keywords: generateKeywords(iconName),
        rtlFlip: RTL_FLIP_ICONS.includes(iconName),
        aliases: ALIASES[iconName] || [],
    }));

    return metadata;
}

// Write metadata to file
function writeMetadataFile() {
    const metadata = generateIconMetadata();
    const content = `// Auto-generated icon metadata
// Run 'node scripts/generate-icon-metadata.js' to regenerate

import type { IconMetadata } from '../types';

export const iconMetadata: IconMetadata[] = ${JSON.stringify(metadata, null, 2)};
`;

    const outputPath = path.join(__dirname, '../src/components/icons/utils/metadata.ts');
    fs.writeFileSync(outputPath, content);
    console.log(`Generated metadata for ${metadata.length} icons`);
}

if (require.main === module) {
    writeMetadataFile();
}

module.exports = { generateIconMetadata };













