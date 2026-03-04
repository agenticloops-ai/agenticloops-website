import { ArrowRight, Sparkles, Clock, Factory, Microscope, Server } from 'lucide-react';
import { Github } from './BrandIcons';
import { ScrollReveal } from './ScrollReveal';
import { GITHUB_REPOS } from '../config/repos';

const repoColorClasses = ['cyan', 'violet', 'pink', 'emerald', 'amber'] as const;

const repos = [
    {
        name: 'agentic-ai-engineering',
        url: GITHUB_REPOS.agenticAIEngineering,
        description: 'Hands-on tutorials for building AI agents from scratch. Learn LLM APIs, prompt engineering, tool calling, and the agent loop through practical examples.',
        language: 'Python',
        featured: true,
        icon: Sparkles
    },
    {
        name: 'agentic-apps-internals',
        url: GITHUB_REPOS.agenticAppsInternals,
        description: 'Reverse-engineering analysis of popular AI agents — system prompts, tool architectures, and implementation patterns.',
        language: 'Markdown, JSON, YAML',
        comingSoon: true,
        releaseDate: 'Q1 2026',
        icon: Microscope
    },
    {
        name: 'agentic-ai-patterns',
        url: GITHUB_REPOS.agenticAIPatterns,
        description: 'Design patterns for agentic AI systems. ReAct, multi-agent orchestration, memory management, and structured outputs.',
        language: 'Python',
        comingSoon: true,
        releaseDate: 'Q2 2026',
        icon: Factory
    },
    {
        name: 'agentic-platform-engineering',
        description: 'Building internal AI agentic platforms. Infrastructure, orchestration, and operational patterns for running AI agents in production.',
        language: 'Python',
        comingSoon: true,
        releaseDate: 'Q2 2026',
        icon: Server
    },
];

export function RepoSection() {
    return (
        <section className="section relative overflow-hidden" id="code">
            <div className="gradient-blur gradient-blur-violet absolute -top-32 -left-[5%] opacity-10"></div>

            <div className="container">
                <ScrollReveal>
                    <div className="text-center mb-16">
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="w-10 h-0.5" style={{ background: 'var(--color-accent-primary)' }}></div>
                            <span className="badge">repositories</span>
                            <div className="w-10 h-0.5" style={{ background: 'var(--color-accent-primary)' }}></div>
                        </div>
                        <h2 className="mb-4">
                            Featured Repos
                        </h2>
                        <p className="body-text max-w-[600px] mx-auto">
                            We focus on internals, so engineers understand how agents work.
                        </p>
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {repos.map((repo, i) => {
                        const colorClass = repoColorClasses[i % repoColorClasses.length];
                        return (
                            <ScrollReveal key={repo.name} direction="up" delay={i * 0.08}>
                                <a
                                    href={repo.comingSoon ? '#' : repo.url}
                                    target={repo.comingSoon ? undefined : "_blank"}
                                    rel={repo.comingSoon ? undefined : "noopener noreferrer"}
                                    onClick={(e) => {
                                        if (repo.comingSoon) {
                                            e.preventDefault();
                                        } else if (typeof window.gtag === 'function') {
                                            window.gtag('event', 'click_repo', {
                                                event_category: 'engagement',
                                                event_label: repo.name
                                            });
                                        }
                                    }}
                                    className={`card card-color-${colorClass} flex flex-col h-full relative overflow-hidden no-underline text-inherit ${repo.comingSoon ? 'opacity-60 cursor-default' : ''
                                        }`}
                                >
                                    {repo.comingSoon && (
                                        <div className="absolute top-4 right-4">
                                            <span className="coming-soon-badge">
                                                <Clock size={10} /> Coming Soon
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3 mb-4">
                                        {repo.icon && (
                                            <div className="icon-box icon-box-outline w-10 h-10">
                                                <repo.icon size={18} />
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-mono font-semibold text-text-primary">
                                                {repo.name}
                                            </div>
                                            {!repo.comingSoon && (
                                                <div className="text-xs font-mono text-text-muted">
                                                    {repo.language}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-sm text-text-secondary leading-relaxed mb-4 flex-1">
                                        {repo.description}
                                    </p>

                                    <div className="card-footer min-h-[2.5rem]">
                                        {!repo.comingSoon ? (
                                            <div className="link-action ml-auto flex items-center gap-2">
                                                View Repo <Github size={14} /> <ArrowRight size={14} />
                                            </div>
                                        ) : (
                                            <div className="text-xs font-mono text-text-muted ml-auto">
                                                Releasing {repo.releaseDate || 'soon'}
                                            </div>
                                        )}
                                    </div>
                                </a>
                            </ScrollReveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
