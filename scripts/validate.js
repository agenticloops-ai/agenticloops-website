/**
 * Pre-deploy validation tests
 * Run: npm run test
 * 
 * Validates:
 * 1. Build - no TypeScript/compilation errors
 * 2. API endpoints - return valid JSON
 * 3. Pages - render without errors
 * 4. Links - no broken internal links
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

let passed = 0;
let failed = 0;
const errors = [];

function test(name, fn) {
    try {
        fn();
        console.log(`  ✓ ${name}`);
        passed++;
    } catch (error) {
        console.log(`  ✗ ${name}`);
        console.log(`    → ${error.message}`);
        errors.push({ name, error: error.message });
        failed++;
    }
}

function assert(condition, message) {
    if (!condition) throw new Error(message);
}

// ============================================
// 1. BUILD VALIDATION
// ============================================
function validateBuild() {
    console.log('\n🔨 Build Validation\n');

    test('TypeScript check passes', () => {
        try {
            execSync('npx astro check', {
                cwd: projectRoot,
                stdio: 'pipe',
                encoding: 'utf-8'
            });
        } catch (e) {
            // Extract just the error summary from the output
            const output = e.stdout || e.stderr || e.message;
            const errorLines = output.split('\n')
                .filter(line => line.includes('error') || line.includes('Error'))
                .slice(0, 5)
                .join('\n');
            throw new Error(errorLines || 'TypeScript check failed');
        }
    });

    test('Build completes successfully', () => {
        try {
            execSync('npm run build', {
                cwd: projectRoot,
                stdio: 'pipe',
                encoding: 'utf-8'
            });
        } catch (e) {
            throw new Error('Build failed: ' + e.message.slice(0, 200));
        }
    });

    test('Dist directory created', () => {
        assert(fs.existsSync(path.join(projectRoot, 'dist')),
            'dist/ directory not created');
    });

    test('Index page generated', () => {
        assert(fs.existsSync(path.join(projectRoot, 'dist', 'index.html')),
            'index.html not generated');
    });
}

// ============================================
// 2. API VALIDATION
// ============================================
function validateAPIs() {
    console.log('\n🔌 API Validation\n');

    const apiDir = path.join(projectRoot, 'dist', 'api');

    test('API directory exists', () => {
        assert(fs.existsSync(apiDir), 'dist/api/ does not exist');
    });

    if (!fs.existsSync(apiDir)) return;

    test('course-index.json is valid JSON', () => {
        const file = path.join(apiDir, 'course-index.json');
        if (!fs.existsSync(file)) throw new Error('File not found');
        const content = fs.readFileSync(file, 'utf-8');
        JSON.parse(content); // Throws if invalid
    });

    test('course-modules.json is valid JSON', () => {
        const file = path.join(apiDir, 'course-modules.json');
        if (!fs.existsSync(file)) throw new Error('File not found');
        const content = fs.readFileSync(file, 'utf-8');
        JSON.parse(content);
    });

    test('course-index.json has lessons', () => {
        const file = path.join(apiDir, 'course-index.json');
        if (!fs.existsSync(file)) throw new Error('File not found');
        const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
        assert(Array.isArray(data), 'Expected array');
        // Warning but not failure if empty
        if (data.length === 0) {
            console.log('    ⚠️  Warning: No lessons in search index');
        }
    });
}

// ============================================
// 3. PAGE VALIDATION
// ============================================
function validatePages() {
    console.log('\n📄 Page Validation\n');

    const distDir = path.join(projectRoot, 'dist');

    test('Homepage exists and has content', () => {
        const file = path.join(distDir, 'index.html');
        assert(fs.existsSync(file), 'index.html not found');
        const content = fs.readFileSync(file, 'utf-8');
        assert(content.length > 1000, 'index.html seems too small');
        assert(content.includes('<title>'), 'Missing title tag');
    });

    test('Homepage has no error markers', () => {
        const file = path.join(distDir, 'index.html');
        const content = fs.readFileSync(file, 'utf-8');
        assert(!content.includes('Internal Server Error'), 'Contains error message');
        assert(!content.includes('undefined'), 'Contains "undefined" text');
    });

    // Check course pages if they exist
    const courseDir = path.join(distDir, 'course');
    if (fs.existsSync(courseDir)) {
        test('Course pages generated', () => {
            const items = fs.readdirSync(courseDir);
            assert(items.length > 0, 'No course pages generated');
        });
    }
}

// ============================================
// 4. LINK VALIDATION (optional, slower)
// ============================================
function validateLinks() {
    console.log('\n🔗 Link Validation\n');

    const distDir = path.join(projectRoot, 'dist');
    const htmlFiles = [];

    function findHtml(dir) {
        const items = fs.readdirSync(dir);
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                findHtml(fullPath);
            } else if (item.endsWith('.html')) {
                htmlFiles.push(fullPath);
            }
        }
    }

    findHtml(distDir);

    test(`All HTML files valid (${htmlFiles.length} files)`, () => {
        const broken = [];
        for (const file of htmlFiles) {
            const content = fs.readFileSync(file, 'utf-8');
            // Check for broken href links to local files
            const hrefMatches = content.matchAll(/href="(\/[^"#]+)"/g);
            for (const match of hrefMatches) {
                const href = match[1];
                // Skip external links and anchors
                if (href.startsWith('http') || href.startsWith('#')) continue;

                // Convert /path to dist/path/index.html or dist/path
                let targetPath = path.join(distDir, href);
                if (!targetPath.endsWith('.html') && !targetPath.includes('.')) {
                    targetPath = path.join(targetPath, 'index.html');
                }

                if (!fs.existsSync(targetPath) && !fs.existsSync(targetPath.replace('/index.html', '.html'))) {
                    broken.push(`${path.relative(distDir, file)}: ${href}`);
                }
            }
        }

        if (broken.length > 0) {
            throw new Error(`Broken links:\n      ${broken.slice(0, 5).join('\n      ')}`);
        }
    });
}

// ============================================
// RUN ALL TESTS
// ============================================
async function main() {
    console.log('🧪 Pre-Deploy Validation\n');
    console.log('========================');


    validateBuild();
    validateAPIs();
    validatePages();
    validateLinks();

    console.log('\n========================');
    console.log(`\n✓ Passed: ${passed}`);
    console.log(`✗ Failed: ${failed}`);

    if (failed > 0) {
        console.log('\n❌ Validation failed. Fix errors before deploying.\n');
        process.exit(1);
    } else {
        console.log('\n✅ All validations passed. Ready to deploy!\n');
        process.exit(0);
    }
}

main();
