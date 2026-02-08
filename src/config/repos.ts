/**
 * Centralized repository configuration
 * Single source of truth for GitHub repo URLs
 */

export const GITHUB_REPOS = {
    aiAgentsEngineering: 'https://github.com/agenticloops-ai/ai-agents-engineering',
    aiAgentsInternals: 'https://github.com/agenticloops-ai/ai-agents-internals',
} as const;

// Default repo for course content
export const COURSE_REPO = GITHUB_REPOS.aiAgentsEngineering;

/**
 * Build GitHub URL for a lesson/course slug
 * @param slug - Slug like ai-agents-engineering/01-foundations/01-simple-llm-call
 * @returns GitHub tree URL for the content
 */
export function getGitHubUrl(slug: string): string {
    // Convert slug like ai-agents-engineering/01-foundations/01-simple-llm-call
    // to 01-foundations/01-simple-llm-call (modules are in repo root)
    const parts = slug.split('/');
    if (parts.length >= 2) {
        const lessonPath = parts.slice(1).join('/');
        return `${COURSE_REPO}/tree/main/${lessonPath}`;
    }
    return `${COURSE_REPO}/tree/main`;
}
