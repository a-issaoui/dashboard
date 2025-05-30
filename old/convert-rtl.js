#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

// Promisified fs functions for better error handling
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// Tailwind v4 compatible RTL class mapping
const classMap = {
    // Margin - all variants (v4 uses logical properties by default)
    "ml-(\\d+(?:\\.\\d+)?)": "ms-$1",
    "mr-(\\d+(?:\\.\\d+)?)": "me-$1",
    "ml-auto": "ms-auto",
    "mr-auto": "me-auto",
    "ml-px": "ms-px",
    "mr-px": "me-px",
    "-ml-(\\d+(?:\\.\\d+)?)": "-ms-$1",
    "-mr-(\\d+(?:\\.\\d+)?)": "-me-$1",

    // Padding - all variants
    "pl-(\\d+(?:\\.\\d+)?)": "ps-$1",
    "pr-(\\d+(?:\\.\\d+)?)": "pe-$1",
    "pl-auto": "ps-auto",
    "pr-auto": "pe-auto",
    "pl-px": "ps-px",
    "pr-px": "pe-px",

    // Text alignment
    "text-left": "text-start",
    "text-right": "text-end",

    // Border width
    "border-l-(\\d+(?:\\.\\d+)?)": "border-s-$1",
    "border-r-(\\d+(?:\\.\\d+)?)": "border-e-$1",
    "border-l": "border-s",
    "border-r": "border-e",

    // Border color (v4 syntax)
    "border-l-([a-zA-Z]+(?:-\\d+)?)": "border-s-$1",
    "border-r-([a-zA-Z]+(?:-\\d+)?)": "border-e-$1",

    // Rounded corners (v4 uses logical properties)
    "rounded-l-(\\d+(?:\\.\\d+)?)": "rounded-s-$1",
    "rounded-r-(\\d+(?:\\.\\d+)?)": "rounded-e-$1",
    "rounded-l": "rounded-s",
    "rounded-r": "rounded-e",
    "rounded-tl-(\\d+(?:\\.\\d+)?)": "rounded-ss-$1",
    "rounded-tr-(\\d+(?:\\.\\d+)?)": "rounded-se-$1",
    "rounded-bl-(\\d+(?:\\.\\d+)?)": "rounded-es-$1",
    "rounded-br-(\\d+(?:\\.\\d+)?)": "rounded-ee-$1",
    "rounded-tl": "rounded-ss",
    "rounded-tr": "rounded-se",
    "rounded-bl": "rounded-es",
    "rounded-br": "rounded-ee",

    // Position (inset) - v4 compatible
    "left-(\\d+(?:\\.\\d+)?)": "start-$1",
    "right-(\\d+(?:\\.\\d+)?)": "end-$1",
    "left-auto": "start-auto",
    "right-auto": "end-auto",
    "left-px": "start-px",
    "right-px": "end-px",
    "-left-(\\d+(?:\\.\\d+)?)": "-start-$1",
    "-right-(\\d+(?:\\.\\d+)?)": "-end-$1",

    // Inset utilities (v4 preferred)
    "inset-x-(\\d+(?:\\.\\d+)?)": "inset-inline-$1",
    "inset-y-(\\d+(?:\\.\\d+)?)": "inset-block-$1",

    // Scroll margin/padding
    "scroll-ml-(\\d+(?:\\.\\d+)?)": "scroll-ms-$1",
    "scroll-mr-(\\d+(?:\\.\\d+)?)": "scroll-me-$1",
    "scroll-pl-(\\d+(?:\\.\\d+)?)": "scroll-ps-$1",
    "scroll-pr-(\\d+(?:\\.\\d+)?)": "scroll-pe-$1",

    // Space between (v4 handles RTL automatically, but keeping for migration)
    "space-x-(\\d+(?:\\.\\d+)?)": "space-x-$1",
    "-space-x-(\\d+(?:\\.\\d+)?)": "-space-x-$1",

    // Divide (v4 handles RTL automatically)
    "divide-x-(\\d+(?:\\.\\d+)?)": "divide-x-$1",

    // Float - v4 logical properties
    "float-left": "float-start",
    "float-right": "float-end",

    // Clear - v4 logical properties
    "clear-left": "clear-start",
    "clear-right": "clear-end",

    // Transform origin - v4 logical properties
    "origin-left": "origin-start",
    "origin-right": "origin-end",
    "origin-top-left": "origin-start-top",
    "origin-top-right": "origin-end-top",
    "origin-bottom-left": "origin-start-bottom",
    "origin-bottom-right": "origin-end-bottom",

    // CSS Grid - v4 additions
    "justify-self-start": "justify-self-start", // Already correct
    "justify-self-end": "justify-self-end",     // Already correct
    "justify-items-start": "justify-items-start", // Already correct
    "justify-items-end": "justify-items-end",     // Already correct

    // Flexbox - v4 improvements
    "justify-start": "justify-start", // Already correct in v4
    "justify-end": "justify-end",     // Already correct in v4

    // Arbitrary values support (v4 enhanced syntax)
    "ml-\\[([^\\]]+)\\]": "ms-[$1]",
    "mr-\\[([^\\]]+)\\]": "me-[$1]",
    "pl-\\[([^\\]]+)\\]": "ps-[$1]",
    "pr-\\[([^\\]]+)\\]": "pe-[$1]",
    "left-\\[([^\\]]+)\\]": "start-[$1]",
    "right-\\[([^\\]]+)\\]": "end-[$1]",
    "border-l-\\[([^\\]]+)\\]": "border-s-[$1]",
    "border-r-\\[([^\\]]+)\\]": "border-e-[$1]",
    "rounded-l-\\[([^\\]]+)\\]": "rounded-s-[$1]",
    "rounded-r-\\[([^\\]]+)\\]": "rounded-e-[$1]",
    "rounded-tl-\\[([^\\]]+)\\]": "rounded-ss-[$1]",
    "rounded-tr-\\[([^\\]]+)\\]": "rounded-se-[$1]",
    "rounded-bl-\\[([^\\]]+)\\]": "rounded-es-[$1]",
    "rounded-br-\\[([^\\]]+)\\]": "rounded-ee-[$1]",

    // Container queries (v4 feature)
    "@container": "@container", // No change needed

    // Modern CSS properties (v4 enhanced)
    "backdrop-blur": "backdrop-blur", // No change needed
    "supports-\\[([^\\]]+)\\]": "supports-[$1]", // No change needed
};

// Tailwind v4 container queries and modern variants
const variants = [
    // Standard responsive
    'sm:', 'md:', 'lg:', 'xl:', '2xl:',

    // Container queries (v4 feature)
    '@xs:', '@sm:', '@md:', '@lg:', '@xl:', '@2xl:',
    '@3xl:', '@4xl:', '@5xl:', '@6xl:', '@7xl:',

    // Interactive states
    'hover:', 'focus:', 'focus-within:', 'focus-visible:', 'active:',
    'visited:', 'target:', 'disabled:', 'enabled:', 'checked:', 'indeterminate:',
    'default:', 'required:', 'valid:', 'invalid:', 'in-range:', 'out-of-range:',
    'placeholder-shown:', 'autofill:', 'read-only:',

    // Structural
    'first:', 'last:', 'only:', 'odd:', 'even:',
    'first-of-type:', 'last-of-type:', 'only-of-type:',
    'empty:', 'has-[*]:', 'not-[*]:',

    // Group and peer states (v4 enhanced)
    'group-hover:', 'group-focus:', 'group-focus-within:', 'group-focus-visible:',
    'group-active:', 'group-visited:', 'group-target:', 'group-disabled:',
    'group-enabled:', 'group-checked:', 'group-indeterminate:', 'group-valid:',
    'group-invalid:', 'group-required:', 'group-read-only:',

    'peer-hover:', 'peer-focus:', 'peer-focus-within:', 'peer-focus-visible:',
    'peer-active:', 'peer-visited:', 'peer-target:', 'peer-disabled:',
    'peer-enabled:', 'peer-checked:', 'peer-indeterminate:', 'peer-valid:',
    'peer-invalid:', 'peer-required:', 'peer-read-only:',

    // Media features (v4 enhanced)
    'dark:', 'light:', 'motion-safe:', 'motion-reduce:', 'contrast-more:', 'contrast-less:',
    'print:', 'portrait:', 'landscape:', 'forced-colors:', 'prefers-reduced-data:',

    // Arbitrary variants (v4 feature)
    '\\[[^\\]]+\\]:',
];

// Configuration
const config = {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte', '.astro'],
    excludeDirs: ['node_modules', '.git', '.next', 'dist', 'build', 'coverage', '.turbo', '.nuxt'],
    backupDir: '.rtl-backup',
    dryRun: false,
    verbose: false,
};

class RTLConverter {
    constructor(options = {}) {
        this.config = { ...config, ...options };
        this.stats = {
            filesProcessed: 0,
            filesModified: 0,
            classesReplaced: 0,
            errors: 0,
        };
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = {
            info: '📝',
            success: '✅',
            warning: '⚠️',
            error: '❌',
        }[type];

        console.log(`${prefix} [${timestamp}] ${message}`);
    }

    createBackup(filePath) {
        if (!this.config.createBackup) return;

        const backupPath = path.join(
            path.dirname(filePath),
            this.config.backupDir,
            path.basename(filePath) + '.bak'
        );

        fs.mkdirSync(path.dirname(backupPath), { recursive: true });
        fs.copyFileSync(filePath, backupPath);
    }

    replaceClasses(content) {
        let modifiedContent = content;
        let replacementCount = 0;

        // Create expanded class map with variants
        const expandedClassMap = {};

        for (const [pattern, replacement] of Object.entries(classMap)) {
            // Add base pattern
            expandedClassMap[pattern] = replacement;

            // Add variants (including v4 container queries and arbitrary variants)
            for (const variant of variants) {
                const variantPattern = `${variant}${pattern}`;
                const variantReplacement = `${variant}${replacement}`;
                expandedClassMap[variantPattern] = variantReplacement;
            }
        }

        // Special handling for class attribute patterns (v4 supports various syntaxes)
        const classAttributePatterns = [
            // className="..."
            /className\s*=\s*["'`]([^"'`]*?)["'`]/g,
            // class="..."
            /class\s*=\s*["'`]([^"'`]*?)["'`]/g,
            // clsx(), cn(), classNames() etc.
            /(?:clsx|cn|classNames|tw)\s*\(\s*["'`]([^"'`]*?)["'`]/g,
            // Template literal classes
            /`[^`]*?`/g,
        ];

        // Apply replacements with word boundaries for better accuracy
        for (const [pattern, replacement] of Object.entries(expandedClassMap)) {
            // Enhanced regex to handle class boundaries better
            const regex = new RegExp(`(?<=^|\\s|["'\`])${pattern}(?=\\s|$|["'\`])`, 'g');
            const matches = modifiedContent.match(regex);

            if (matches) {
                modifiedContent = modifiedContent.replace(regex, replacement);
                replacementCount += matches.length;

                if (this.config.verbose) {
                    this.log(`Replaced ${matches.length} instances of '${pattern}' with '${replacement}'`);
                }
            }
        }

        return {
            content: modifiedContent,
            replacementCount,
            hasChanges: replacementCount > 0,
        };
    }

    async processFile(filePath) {
        try {
            this.stats.filesProcessed++;

            if (this.config.verbose) {
                this.log(`Processing: ${filePath}`);
            }

            const content = await readFile(filePath, 'utf8');
            const result = this.replaceClasses(content);

            if (result.hasChanges) {
                this.stats.filesModified++;
                this.stats.classesReplaced += result.replacementCount;

                if (!this.config.dryRun) {
                    if (this.config.createBackup) {
                        this.createBackup(filePath);
                    }

                    await writeFile(filePath, result.content, 'utf8');
                }

                this.log(
                    `${this.config.dryRun ? '[DRY RUN] ' : ''}Updated: ${filePath} (${result.replacementCount} classes)`,
                    'success'
                );
            } else if (this.config.verbose) {
                this.log(`No changes needed: ${filePath}`);
            }

        } catch (error) {
            this.stats.errors++;
            this.log(`Failed to process ${filePath}: ${error.message}`, 'error');
        }
    }

    shouldProcessFile(fileName) {
        return this.config.extensions.some(ext => fileName.endsWith(ext));
    }

    shouldSkipDirectory(dirName) {
        return this.config.excludeDirs.includes(dirName) || dirName.startsWith('.');
    }

    async scanDirectory(dirPath) {
        try {
            const entries = await readdir(dirPath, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(dirPath, entry.name);

                if (entry.isDirectory()) {
                    if (!this.shouldSkipDirectory(entry.name)) {
                        await this.scanDirectory(fullPath);
                    } else if (this.config.verbose) {
                        this.log(`Skipping directory: ${fullPath}`);
                    }
                } else if (entry.isFile()) {
                    if (this.shouldProcessFile(entry.name)) {
                        await this.processFile(fullPath);
                    }
                }
            }
        } catch (error) {
            this.log(`Failed to scan directory ${dirPath}: ${error.message}`, 'error');
        }
    }

    async convert(targetPath) {
        const startTime = Date.now();

        try {
            const stats = await stat(targetPath);

            this.log(`🚀 Starting Tailwind v4 RTL conversion...`);

            if (stats.isDirectory()) {
                this.log(`Target directory: ${targetPath}`);
                await this.scanDirectory(targetPath);
            } else if (stats.isFile()) {
                this.log(`Target file: ${targetPath}`);
                await this.processFile(targetPath);
            } else {
                throw new Error('Target path is neither a file nor a directory');
            }

            const duration = ((Date.now() - startTime) / 1000).toFixed(2);
            this.printSummary(duration);

        } catch (error) {
            this.log(`Conversion failed: ${error.message}`, 'error');
            process.exit(1);
        }
    }

    printSummary(duration) {
        console.log('\n' + '='.repeat(60));
        console.log('🎉 TAILWIND V4 RTL CONVERSION SUMMARY');
        console.log('='.repeat(60));
        console.log(`📁 Files processed: ${this.stats.filesProcessed}`);
        console.log(`✏️  Files modified: ${this.stats.filesModified}`);
        console.log(`🔄 Classes replaced: ${this.stats.classesReplaced}`);
        console.log(`❌ Errors: ${this.stats.errors}`);
        console.log(`⏱️  Duration: ${duration}s`);

        if (this.config.dryRun) {
            console.log('\n⚠️  This was a DRY RUN - no files were actually modified');
        }

        if (this.stats.errors > 0) {
            console.log('\n⚠️  Some files had errors. Check the log above for details.');
        }

        console.log('\n📖 Next steps:');
        console.log('   1. Add `dir="rtl"` to your HTML element');
        console.log('   2. Update your Tailwind v4 config for RTL support');
        console.log('   3. Test your components in RTL mode');

        console.log('='.repeat(60));
    }
}

// CLI argument parsing
function parseArgs() {
    const args = process.argv.slice(2);
    const options = {
        targetPath: null,
        dryRun: false,
        verbose: false,
        createBackup: false,
        help: false,
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        switch (arg) {
            case '--dry-run':
            case '-d':
                options.dryRun = true;
                break;
            case '--verbose':
            case '-v':
                options.verbose = true;
                break;
            case '--backup':
            case '-b':
                options.createBackup = true;
                break;
            case '--help':
            case '-h':
                options.help = true;
                break;
            default:
                if (!options.targetPath && !arg.startsWith('-')) {
                    options.targetPath = arg;
                }
        }
    }

    return options;
}

function printHelp() {
    console.log(`
🔄 Tailwind CSS v4 RTL Converter

Converts directional classes to RTL-compatible logical properties
for Tailwind CSS v4 projects with Next.js and shadcn/ui.

USAGE:
  node convert-rtl.js <directory|file> [options]

OPTIONS:
  -d, --dry-run     Preview changes without modifying files
  -v, --verbose     Show detailed processing information
  -b, --backup      Create backup files before modification
  -h, --help        Show this help message

EXAMPLES:
  node convert-rtl.js ./src                    # Convert all files in src directory
  node convert-rtl.js ./components --verbose   # Convert with detailed output
  node convert-rtl.js ./src --dry-run          # Preview changes without applying
  node convert-rtl.js file.jsx --backup        # Convert single file with backup

SUPPORTED FILE TYPES:
  .js, .jsx, .ts, .tsx, .vue, .svelte, .astro

EXCLUDED DIRECTORIES:
  node_modules, .git, .next, dist, build, coverage, .turbo, .nuxt

TAILWIND V4 FEATURES SUPPORTED:
  ✅ Container queries (@xs:, @sm:, etc.)
  ✅ Enhanced arbitrary variants
  ✅ Modern CSS logical properties
  ✅ Improved state variants
  ✅ Better RTL support

POST-CONVERSION SETUP:
  1. Add dir="rtl" to your HTML element
  2. Configure Tailwind v4 for RTL in your CSS:
     @import "tailwindcss";
     @config "./tailwind.config.js";
  3. Test components in both LTR and RTL modes
`);
}

// Main execution
async function main() {
    const options = parseArgs();

    if (options.help) {
        printHelp();
        return;
    }

    if (!options.targetPath) {
        console.error('❌ Error: Please specify a target directory or file');
        console.error('   Usage: node convert-rtl.js <directory|file> [options]');
        console.error('   Use --help for more information');
        process.exit(1);
    }

    const converter = new RTLConverter({
        dryRun: options.dryRun,
        verbose: options.verbose,
        createBackup: options.createBackup,
    });

    await converter.convert(path.resolve(options.targetPath));
}

// Run the script
if (require.main === module) {
    main().catch(error => {
        console.error('❌ Fatal error:', error.message);
        process.exit(1);
    });
}

module.exports = { RTLConverter, classMap };