import { useState, useEffect } from 'react';
import type { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { getGitHubUrl, GITHUB_REPOS } from '../config/repos';
import { Github } from './BrandIcons';

// Color palette class names (must match CSS --palette-* order)
const moduleColorClasses = ['cyan', 'violet', 'pink', 'emerald', 'amber'] as const;

interface Lesson {
    title: string;
    description: string;
    slug: string;
    icon: string;
    status?: string;
}

interface Module {
    id: string;
    title: string;
    description: string;
    lessons: Lesson[];
}

// Convert kebab-case icon name to PascalCase and get from Icons
function getIcon(iconName: string): LucideIcon {
    // Convert 'book-open' to 'BookOpen'
    const pascalCase = iconName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');

    return (Icons as unknown as Record<string, LucideIcon>)[pascalCase] || Icons.BookOpen;
}

export function Topics() {
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);
    const baseUrl = import.meta.env.BASE_URL || '';

    useEffect(() => {
        fetch(`${baseUrl}api/course-modules.json`)
            .then(res => res.json())
            .then(data => {
                setModules(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <section className="section relative overflow-hidden" id="topics">
            {/* Background Gradient Blurs */}
            <div className="gradient-blur gradient-blur-blue absolute -top-32 -right-[5%] opacity-15"></div>
            <div className="gradient-blur gradient-blur-violet absolute -bottom-32 -left-[5%] opacity-15"></div>
            {/* Section Accent Line */}
            <div
                className="absolute top-0 right-0 w-[300px] h-1 shadow-[0_0_20px_var(--color-accent-cyan)]"
                style={{ background: 'var(--color-accent-gradient)' }}
            ></div>

            <div className="container">
                <ScrollReveal>
                    <div className="text-center mb-20 relative">
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="w-10 h-0.5 bg-accent-cyan"></div>
                            <span className="badge">tutorials</span>
                            <div className="w-10 h-0.5 bg-accent-cyan"></div>
                        </div>

                        <h2 className="mb-6">
                            What We <span className="gradient-text">Cover</span>
                        </h2>

                        <p className="body-text max-w-[700px] mx-auto">
                            A comprehensive curriculum for building production-ready AI agents
                        </p>

                        <a
                            href={GITHUB_REPOS.agenticAIEngineering}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-4 px-4 py-2 text-sm font-mono font-bold uppercase tracking-wider text-text-secondary no-underline border border-border rounded transition-all hover:text-accent-cyan hover:border-accent-cyan"
                        >
                            <Github size={16} />
                            View on GitHub
                            <Icons.ArrowUpRight size={14} className="opacity-60" />
                        </a>
                    </div>
                </ScrollReveal>

                {loading ? (
                    <div className="text-center py-12 text-text-muted">
                        Loading course content...
                    </div>
                ) : modules.length === 0 ? (
                    <div className="text-center py-12 text-text-muted">
                        No course content available yet.
                    </div>
                ) : (
                    modules.map((module, moduleIndex) => {
                        const colorClass = moduleColorClasses[moduleIndex % moduleColorClasses.length];

                        return (
                            <div key={module.id} className={moduleIndex < modules.length - 1 ? 'mb-24' : ''}>
                                <ScrollReveal>
                                    <div
                                        className="mb-12 pt-4 pb-6 pl-6 border-b-2 border-border relative"
                                        style={{
                                            borderLeft: `4px solid var(--palette-${colorClass})`,
                                            background: `linear-gradient(90deg, color-mix(in srgb, var(--palette-${colorClass}) 5%, transparent), transparent)`
                                        }}
                                    >
                                        <div
                                            className="absolute top-0 -left-1 w-1 h-10"
                                            style={{ background: `var(--palette-${colorClass})`, boxShadow: `0 0 20px var(--palette-${colorClass})` }}
                                        ></div>

                                        <div className="flex items-center gap-4 mb-3">
                                            <div
                                                className="label py-1 px-3 border-2"
                                                style={{
                                                    color: `var(--palette-${colorClass})`,
                                                    borderColor: `var(--palette-${colorClass})`,
                                                    clipPath: 'var(--clip-corner-sm)'
                                                }}
                                            >
                                                MODULE_0{moduleIndex + 1}
                                            </div>
                                            <h3
                                                className="text-2xl font-bold m-0"
                                                style={{ color: `var(--palette-${colorClass})`, textShadow: `0 0 20px color-mix(in srgb, var(--palette-${colorClass}) 25%, transparent)` }}
                                            >
                                                {module.title}
                                            </h3>
                                        </div>
                                        <p className="body-text m-0">
                                            {module.description}
                                        </p>
                                    </div>
                                </ScrollReveal>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {module.lessons.map((lesson, i) => {
                                        const LessonIcon = getIcon(lesson.icon || 'book-open');

                                        return (
                                            <ScrollReveal
                                                key={lesson.slug}
                                                direction={i % 2 === 0 ? 'left' : 'right'}
                                                delay={i * 0.03}
                                            >
                                                <a
                                                    href={getGitHubUrl(GITHUB_REPOS.agenticAIEngineering, lesson.slug)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={() => {
                                                        if (typeof window.gtag === 'function') {
                                                            window.gtag('event', 'click_lesson', {
                                                                event_category: 'engagement',
                                                                event_label: lesson.slug,
                                                                module: module.title
                                                            });
                                                        }
                                                    }}
                                                    className={`card card-color-${colorClass} block p-6 h-full relative overflow-hidden no-underline text-inherit transition-all hover:translate-x-1.5 group flex flex-col`}
                                                >
                                                    <div className="corner-accent corner-accent-lg"></div>

                                                    {/* Coming Soon Badge - Top Right */}
                                                    {lesson.status === 'coming-soon' && (
                                                        <div
                                                            className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 text-xs font-mono uppercase tracking-wider border rounded"
                                                            style={{
                                                                color: 'var(--color-text-muted)',
                                                                borderColor: 'var(--color-border)',
                                                                background: 'color-mix(in srgb, var(--color-bg-elevated) 80%, transparent)'
                                                            }}
                                                        >
                                                            <Icons.Clock size={10} /> Coming Soon
                                                        </div>
                                                    )}

                                                    <div className="icon-box icon-box-outline mb-4">
                                                        <LessonIcon size={22} strokeWidth={2.5} />
                                                    </div>

                                                    <h4 className="card-title mb-3 flex items-center gap-2">
                                                        {lesson.title}
                                                        <Icons.ChevronRight size={16} className="opacity-50" />
                                                    </h4>

                                                    {lesson.description && (
                                                        <p className="text-sm text-text-secondary leading-relaxed mb-2">
                                                            {lesson.description}
                                                        </p>
                                                    )}

                                                    <div className="mt-auto pt-2 flex items-center justify-end gap-2 text-xs font-mono font-bold uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">
                                                        <span className="flex items-center gap-1.5">
                                                            view code <Github size={14} />
                                                        </span>
                                                        <Icons.ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                                                    </div>
                                                </a>
                                            </ScrollReveal>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </section>
    );
}


