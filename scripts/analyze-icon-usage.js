
// =============================================================================
// 📁 scripts/analyze-icon-usage.js
/**
 * Analyze icon usage across the codebase
 * Run with: node scripts/analyze-icon-usage.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

function scanIconUsage() {
    const iconUsage = new Map();
    const files = glob.sync('src/**/*.{ts,tsx}', { cwd: process.cwd() });

    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');

        // Find Icon name props
        const nameMatches = content.match(/name=["']([^"']+)["']/g) || [];
        nameMatches.forEach(match => {
            const iconName = match.match(/name=["']([^"']+)["']/)[1];
            if (!iconUsage.has(iconName)) {
                iconUsage.set(iconName, []);
            }
            iconUsage.get(iconName).push(file);
        });

        // Find direct Phosphor imports
        const importMatches = content.match(/import\s*{\s*([^}]+)\s*}\s*from\s*['"]@phosphor-icons\/react['"]/g) || [];
        importMatches.forEach(match => {
            const icons = match.match(/{\s*([^}]+)\s*}/)[1]
                .split(',')
                .map(icon => icon.trim());

            icons.forEach(iconName => {
                if (!iconUsage.has(iconName)) {
                    iconUsage.set(iconName, []);
                }
                iconUsage.get(iconName).push(file);
            });
        });
    });

    return iconUsage;
}

function analyzeUsage() {
    const usage = scanIconUsage();
    const sortedUsage = Array.from(usage.entries())
        .sort((a, b) => b[1].length - a[1].length);

    console.log(`\n📊 Icon Usage Analysis`);
    console.log(`=======================`);
    console.log(`Total unique icons used: ${usage.size}`);
    console.log(`\nTop 10 most used icons:`);

    sortedUsage.slice(0, 10).forEach(([iconName, files], index) => {
        console.log(`${index + 1}. ${iconName} (${files.length} files)`);
    });

    console.log(`\nIcons used only once:`);
    const singleUse = sortedUsage.filter(([, files]) => files.length === 1);
    console.log(`${singleUse.length} icons used only once`);

    // Generate preload list
    const commonIcons = sortedUsage
        .filter(([, files]) => files.length >= 3)
        .map(([iconName]) => iconName);

    console.log(`\n📦 Recommended preload list (${commonIcons.length} icons):`);
    console.log(JSON.stringify(commonIcons, null, 2));

    return { usage, commonIcons };
}

if (require.main === module) {
    analyzeUsage();
}

module.exports = { scanIconUsage, analyzeUsage };