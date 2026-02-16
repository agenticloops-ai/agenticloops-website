/**
 * Course repository configuration
 * Add your external course repositories here
 */

export const COURSE_REPOS = [
    {
        name: 'agentic-ai-engineering',
        repo: 'https://github.com/agenticloops-ai/agentic-ai-engineering.git',
        branch: 'main',
        contentPath: /^\d{2}-/,  // Regex: modules in root dir (01-module1, 02-module2, etc.)
    }
];
