/**
 * Centralized repository configuration
 * Single source of truth for GitHub repo URLs
 */

export const GITHUB_REPOS = {
    agenticAIEngineering: 'https://github.com/agenticloops-ai/agentic-ai-engineering',
    agenticAppsInternals: 'https://github.com/agenticloops-ai/agentic-apps-internals',
    agenticAIPatterns: 'https://github.com/agenticloops-ai/agentic-ai-patterns',
} as const;

/**
 * Build GitHub URL for a slug within a given repo
 * @param repoUrl - GitHub repo URL (e.g., GITHUB_REPOS.agenticAIEngineering)
 * @param slug - Slug like agentic-ai-engineering/01-foundations/01-simple-llm-call
 * @returns GitHub tree URL for the content
 */
export function getGitHubUrl(repoUrl: string, slug: string): string {
    const parts = slug.split('/');
    if (parts.length >= 2) {
        const path = parts.slice(1).join('/');
        return `${repoUrl}/tree/main/${path}`;
    }
    return `${repoUrl}/tree/main`;
}
