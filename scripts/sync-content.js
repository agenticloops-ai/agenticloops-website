/**
 * Fetches course content from external repositories
 * and syncs it to src/content/course/
 * 
 * Run: node scripts/sync-content.js
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');
const destDir = path.join(projectRoot, 'src', 'content', 'courses');

// GitHub token for private repo access (set via env var in github actions)
const GITHUB_TOKEN = process.env.COURSE_CONTENT_TOKEN;

// Import repo configuration
import { COURSE_REPOS } from './repos.config.js';

// For local development without cloning (optional override)
const LOCAL_CONTENT_PATH = process.env.LOCAL_CONTENT_PATH;

/**
 * Build the git clone URL, injecting token for private repos if available
 */
function getAuthenticatedRepoUrl(repoUrl) {
    if (!GITHUB_TOKEN) {
        return repoUrl;
    }
    // Convert https://github.com/... to https://<token>@github.com/...
    return repoUrl.replace('https://github.com/', `https://${GITHUB_TOKEN}@github.com/`);
}

function cleanDir(dir) {
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true });
    }
    fs.mkdirSync(dir, { recursive: true });
}

/**
 * Parse commented-out frontmatter from markdown content.
 * Converts <!-- --- ... --- --> to standard --- ... --- frontmatter.
 * If the content already has standard frontmatter, returns it unchanged.
 * @param {string} content - Markdown content
 * @returns {string} Content with uncommented frontmatter
 */
function parseCommentedFrontmatter(content) {
    // Match <!-- --- ... --- --> at the start of the file (with optional leading whitespace)
    const commentedFrontmatterRegex = /^\s*<!--\s*---\s*\n([\s\S]*?)\n\s*---\s*-->/;
    const match = content.match(commentedFrontmatterRegex);

    if (match) {
        const frontmatterBody = match[1];
        const rest = content.slice(match[0].length);
        console.log(`    ↳ Converted commented frontmatter to standard frontmatter`);
        return `---\n${frontmatterBody}\n---${rest}`;
    }

    return content;
}

/**
 * Transform markdown links that try to escape content folder to GitHub URLs
 * and convert internal lesson links to absolute website paths
 * @param {string} content - Markdown content
 * @param {string} repoUrl - GitHub repo URL (e.g., https://github.com/AI-Agents-Eng/py-playground.git)
 * @param {string} branch - Branch name
 * @param {string} relativePath - Current file's path relative to content root (e.g., 01-foundations/01-simple-llm-call)
 * @param {string} courseName - Course name for website URL (e.g., ai-agents-engineering)
 */
function transformLinks(content, repoUrl, branch, relativePath, courseName) {
    // Get base GitHub URL without .git
    const baseGitHubUrl = repoUrl.replace(/\.git$/, '');

    // Match markdown links: [text](url) and ![alt](url)
    return content.replace(/(!?\[([^\]]*)\])\(([^)]+)\)/g, (match, prefix, _text, url) => {
        // Skip absolute URLs, anchors, and mailto
        if (url.startsWith('http') || url.startsWith('#') || url.startsWith('mailto:')) {
            return match;
        }

        // Skip images (those with !)
        if (match.startsWith('!')) {
            return match;
        }

        // Check if the relative path escapes the content folder (goes beyond lesson root)
        // Count how many levels up the path goes
        const upLevels = (url.match(/\.\.\//g) || []).length;
        const pathParts = relativePath.split('/').filter(Boolean);

        // If going up more levels than we're deep, it escapes content - convert to GitHub URL
        if (upLevels > pathParts.length) {
            // Remove all ../ from the beginning
            let repoPath = url.replace(/^(\.\.\/)+/, '');

            // Construct GitHub URL
            const isDir = !repoPath.includes('.') || repoPath.endsWith('/');
            const gitPath = isDir ? 'tree' : 'blob';

            // Handle anchor links
            const [filePath, anchor] = repoPath.split('#');
            const anchorSuffix = anchor ? `#${anchor}` : '';

            const newUrl = `${baseGitHubUrl}/${gitPath}/${branch}/${filePath}${anchorSuffix}`;
            console.log(`    ↳ External link: ${url} → ${newUrl}`);
            return `${prefix}(${newUrl})`;
        }

        // Transform links to code files to GitHub
        if (url.match(/\.(py|js|ts|json|yaml|yml|sh|bash)$/)) {
            const resolvedPath = path.posix.normalize(path.posix.join(relativePath, url));
            const newUrl = `${baseGitHubUrl}/blob/${branch}/${resolvedPath}`;
            console.log(`    ↳ Code file link: ${url} → ${newUrl}`);
            return `${prefix}(${newUrl})`;
        }

        // Transform internal lesson-to-lesson links (like ../02-chat/ or ./README.md)
        // to absolute website paths
        if (url.startsWith('./') || url.startsWith('../')) {
            // Resolve the relative path
            const resolvedPath = path.posix.normalize(path.posix.join(relativePath, url));
            // Remove trailing README.md or index.md
            const cleanPath = resolvedPath.replace(/\/(README|index)\.md$/i, '').replace(/\/$/, '');
            const newUrl = `/courses/${courseName}/${cleanPath}`;
            console.log(`    ↳ Internal link: ${url} → ${newUrl}`);
            return `${prefix}(${newUrl})`;
        }

        return match;
    });
}

function copyAndRename(srcDir, destDir, repoUrl = '', branch = 'main', contentRelPath = '', courseName = '') {
    if (!fs.existsSync(srcDir)) {
        console.log(`  Source not found: ${srcDir}`);
        return;
    }

    const items = fs.readdirSync(srcDir);

    for (const item of items) {
        const srcPath = path.join(srcDir, item);
        const stat = fs.statSync(srcPath);

        if (stat.isDirectory()) {
            const destPath = path.join(destDir, item);
            fs.mkdirSync(destPath, { recursive: true });
            const newRelPath = contentRelPath ? `${contentRelPath}/${item}` : item;
            copyAndRename(srcPath, destPath, repoUrl, branch, newRelPath, courseName);
        } else if (item.toLowerCase() === 'readme.md') {
            // Rename README.md to index.md for Astro
            const destPath = path.join(destDir, 'index.md');
            let content = fs.readFileSync(srcPath, 'utf-8');
            content = parseCommentedFrontmatter(content);
            if (repoUrl) {
                content = transformLinks(content, repoUrl, branch, contentRelPath, courseName);
            }
            fs.writeFileSync(destPath, content);
        } else if (item.endsWith('.md')) {
            const destPath = path.join(destDir, item);
            let content = fs.readFileSync(srcPath, 'utf-8');
            content = parseCommentedFrontmatter(content);
            if (repoUrl) {
                content = transformLinks(content, repoUrl, branch, contentRelPath, courseName);
            }
            fs.writeFileSync(destPath, content);
        }
    }
}

async function fetchFromRepo(course) {
    const tempDir = path.join(projectRoot, '.temp-clone');
    const courseName = course.name.replace(/^\d+-/, '');
    const courseDestDir = path.join(destDir, courseName);

    console.log(`Fetching ${course.name} from ${course.repo}...`);

    try {
        // Clean temp dir
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true });
        }

        // Clone repo (shallow clone for speed)
        const cloneUrl = getAuthenticatedRepoUrl(course.repo);
        execSync(`git clone --depth 1 --branch ${course.branch} "${cloneUrl}" "${tempDir}"`, {
            stdio: 'pipe'
        });

        fs.mkdirSync(courseDestDir, { recursive: true });

        // Handle regex contentPath (modules in root) vs string contentPath (subdirectory)
        if (course.contentPath instanceof RegExp) {
            // Find directories matching the pattern in root
            const items = fs.readdirSync(tempDir);
            const moduleDirs = items.filter(item => {
                const itemPath = path.join(tempDir, item);
                return fs.statSync(itemPath).isDirectory() && course.contentPath.test(item);
            }).sort();

            console.log(`  Found ${moduleDirs.length} module directories matching pattern`);

            for (const moduleDir of moduleDirs) {
                const srcPath = path.join(tempDir, moduleDir);
                const destPath = path.join(courseDestDir, moduleDir);
                fs.mkdirSync(destPath, { recursive: true });
                copyAndRename(srcPath, destPath, course.repo, course.branch, moduleDir, courseName);
            }
        } else {
            // Copy content from single subdirectory
            const srcPath = path.join(tempDir, course.contentPath);
            copyAndRename(srcPath, courseDestDir, course.repo, course.branch, '', courseName);
        }

        console.log(`  ✓ Synced to ${courseDestDir}`);
    } catch (error) {
        console.error(`  ✗ Failed to fetch ${course.name}:`, error.message);
    } finally {
        // Cleanup
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true });
        }
    }
}

async function syncFromLocal(localPath) {
    console.log(`Syncing from local path: ${localPath}\n`);

    for (const course of COURSE_REPOS) {
        const courseName = course.name.replace(/^\d+-/, '');
        const courseDestDir = path.join(destDir, courseName);

        console.log(`Syncing ${course.name} from local...`);
        fs.mkdirSync(courseDestDir, { recursive: true });

        if (course.contentPath instanceof RegExp) {
            // Find directories matching the pattern in the local path
            const items = fs.readdirSync(localPath);
            const moduleDirs = items.filter(item => {
                const itemPath = path.join(localPath, item);
                return fs.statSync(itemPath).isDirectory() && course.contentPath.test(item);
            }).sort();

            console.log(`  Found ${moduleDirs.length} module directories matching pattern`);

            for (const moduleDir of moduleDirs) {
                const srcPath = path.join(localPath, moduleDir);
                const destPath = path.join(courseDestDir, moduleDir);
                fs.mkdirSync(destPath, { recursive: true });
                copyAndRename(srcPath, destPath, course.repo, course.branch, moduleDir, courseName);
            }
        } else {
            // Copy content from single subdirectory
            const srcPath = path.join(localPath, course.contentPath);
            copyAndRename(srcPath, courseDestDir, course.repo, course.branch, '', courseName);
        }

        console.log(`  ✓ Synced to ${courseDestDir}`);
    }
}

async function main() {
    console.log('Content Sync\n');

    // Clean destination
    cleanDir(destDir);
    console.log(`Cleaned ${destDir}\n`);

    if (LOCAL_CONTENT_PATH) {
        // Local development mode
        await syncFromLocal(LOCAL_CONTENT_PATH);
    } else {
        // Fetch from repos
        for (const course of COURSE_REPOS) {
            await fetchFromRepo(course);
        }
    }

    console.log('\n✓ Content sync complete');
}

main();
