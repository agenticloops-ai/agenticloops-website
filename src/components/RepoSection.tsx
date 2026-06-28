import { ArrowRight, Sparkles, Clock, Factory, Microscope, Server } from 'lucide-react';
import { Github } from './BrandIcons';
import { ScrollReveal } from './ScrollReveal';
import { GITHUB_REPOS } from '../config/repos';

// Color palette class names (must match CSS --palette-* order)
const repoColorClasses = ['cyan', 'violet', 'pink', 'emerald', 'amber'] as const;

const repos = [
    {
        name: 'agentic-ai-engineering',
        url: GITHUB_REPOS.agenticAIEngineering,
        description: 'Hands-on tutorials for building AI agents from scratch. Learn LLM APIs, prompt engineering, tool calling, and the agent loop through practical examples.',
        stars: 0,
        forks: 0,
        language: 'Python',
        featured: true,
        icon: Sparkles
    },
    {
        name: 'agentic-apps-internals',
        url: GITHUB_REPOS.agenticAppsInternals,
        description: 'Reverse-engineering analysis of popular AI agents — system prompts, tool architectures, and implementation patterns.',
        stars: 0,
        forks: 0,
        language: 'Markdown, JSON, YAML',
        comingSoon: true,
        releaseDate: 'Q1 2026',
        icon: Microscope
    },
    {
        name: 'agentic-ai-patterns',
        description: 'Design patterns for agentic AI systems. ReAct, multi-agent orchestration, memory management, and structured outputs.',
        stars: 0,
        forks: 0,
        language: 'Python',
        comingSoon: true,
        releaseDate: 'Q2 2026',
        icon: Factory
    },
    {
        name: 'agentic-platform-engineering',
        description: 'Building internal AI agentic platforms. Infrastructure, orchestration, and operational patterns for running AI agents in production.',
        stars: 0,
        forks: 0,
        language: 'Python',
        comingSoon: true,
        releaseDate: 'Q2 2026',
        icon: Server
    },
];

export function RepoSection() {
    return (
        <section className="section" id="code">
            <div className="container">
                <ScrollReveal>
                    <div className="text-center mb-20">
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <span className="badge">code</span>
                        </div>
                        <h2 className="mb-6">
                            Featured <span className="gradient-text">Repos</span>
                        </h2>
                        <p className="body-text max-w-[700px] mx-auto mb-8">
                            We focus on internals, so engineers understand how agents work.
                        </p>
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {repos.map((repo, i) => {
                        const colorClass = repoColorClasses[i % repoColorClasses.length];
                        return (
                            <ScrollReveal key={repo.name} direction={i % 2 === 0 ? 'left' : 'right'} delay={0.1 + i * 0.1}>
                                <a
                                    href={repo.comingSoon ? '#' : repo.url}
                                    target={repo.comingSoon ? undefined : "_blank"}
                                    rel={repo.comingSoon ? undefined : "noopener noreferrer"}
                                    onClick={(e) => {
                                        if (repo.comingSoon) {
                                            e.preventDefault();
                                        } else {
                                            if (typeof window.gtag === 'function') {
                                                window.gtag('event', 'click_repo', {
                                                    event_category: 'engagement',
                                                    event_label: repo.name
                                                });
                                            }
                                        }
                                    }}
                                    className={`card card-color-${colorClass} flex flex-col h-full relative no-underline text-inherit ${repo.comingSoon
                                        ? 'opacity-75 cursor-default'
                                        : 'cursor-pointer'
                                        }`}
                                >
                                    {/* Coming Soon Badge - Top Right */}
                                    {repo.comingSoon && (
                                        <div className="coming-soon-badge absolute top-4 right-4 gap-1.5">
                                            <Clock size={10} /> Coming Soon
                                        </div>
                                    )}

                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-3">
                                            {repo.icon && (
                                                <div className="icon-box icon-box-outline w-10 h-10">
                                                    <repo.icon size={18} strokeWidth={2.5} />
                                                </div>
                                            )}

                                            <div>
                                                <div className="font-mono font-bold text-lg text-text-primary mb-1">
                                                    {repo.name}
                                                </div>
                                                {!repo.comingSoon && (
                                                    <div
                                                        className="status-badge"
                                                        style={{ color: 'var(--card-color)', borderColor: 'var(--card-color)' }}
                                                    >
                                                        <span
                                                            className="w-1.5 h-1.5 rounded-full"
                                                            style={{ background: 'var(--card-color)' }}
                                                        ></span>
                                                        {repo.language}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <p className="body-text mb-6 flex-1">
                                        {repo.description}
                                    </p>

                                    <div className="card-footer min-h-[3.5rem]">
                                        {!repo.comingSoon ? (
                                            <div className="link-action ml-auto flex items-center gap-2" style={{ color: 'var(--card-color)' }}>
                                                VIEW REPO <Github size={14} /> <ArrowRight size={14} />
                                            </div>
                                        ) : (
                                            <div className="code-comment ml-auto">
                                                RELEASING {repo.releaseDate || 'SOON'}
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

