/**
 * Fetches pattern content from the agentic-ai-patterns repository
 * and caches it locally for the API endpoint to read.
 *
 * Run: node scripts/sync-patterns.js
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');
const cacheDir = path.join(projectRoot, '.patterns-clone');

const REPO_URL = 'https://github.com/agenticloops-ai/agentic-ai-patterns.git';
const BRANCH = 'main';

// GitHub token for private repo access (reuse same env var as course sync)
const GITHUB_TOKEN = process.env.COURSE_CONTENT_TOKEN;

function getAuthenticatedRepoUrl(repoUrl) {
    if (!GITHUB_TOKEN) return repoUrl;
    return repoUrl.replace('https://github.com/', `https://${GITHUB_TOKEN}@github.com/`);
}

async function main() {
    console.log('Patterns Sync\n');

    try {
        // Clean previous clone
        if (fs.existsSync(cacheDir)) {
            fs.rmSync(cacheDir, { recursive: true });
        }

        const cloneUrl = getAuthenticatedRepoUrl(REPO_URL);
        console.log(`Cloning ${REPO_URL} (branch: ${BRANCH})...`);

        execSync(`git clone --depth 1 --branch ${BRANCH} "${cloneUrl}" "${cacheDir}"`, {
            stdio: 'pipe'
        });

        // Verify patterns directory exists
        const patternsDir = path.join(cacheDir, 'patterns');
        if (!fs.existsSync(patternsDir)) {
            throw new Error('patterns/ directory not found in cloned repo');
        }

        const categories = fs.readdirSync(patternsDir).filter(item =>
            fs.statSync(path.join(patternsDir, item)).isDirectory()
        );

        console.log(`  Found ${categories.length} pattern categories: ${categories.join(', ')}`);
        console.log('\n✓ Patterns sync complete');
    } catch (error) {
        console.error(`✗ Failed to sync patterns: ${error.message}`);
        process.exit(1);
    }
}

main();
