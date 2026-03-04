import { useState, useEffect } from 'react';
import { ArrowRight, ChevronRight, BookOpen, Clock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { GITHUB_REPOS } from '../config/repos';
import { Github } from './BrandIcons';

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

function getIcon(iconName: string): LucideIcon {
    const pascalCase = iconName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
    return (Icons as unknown as Record<string, LucideIcon>)[pascalCase] || BookOpen;
}

export function TutorialsPreview() {
    const baseUrl = import.meta.env.BASE_URL || '';
    const [modules, setModules] = useState<Module[]>([]);

    useEffect(() => {
        fetch(`${baseUrl}api/course-modules.json`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setModules(data);
            })
            .catch(() => {});
    }, []);

    return (
        <section className="section relative overflow-hidden" id="topics">
            {/* Background accents */}
            <div className="gradient-blur gradient-blur-blue absolute -top-32 -right-[5%] opacity-15"></div>
            <div className="gradient-blur gradient-blur-violet absolute -bottom-32 -left-[5%] opacity-15"></div>
            <div
                className="absolute top-0 right-0 w-[300px] h-1 shadow-[0_0_20px_var(--color-accent-cyan)]"
                style={{ background: 'var(--color-accent-gradient)' }}
            ></div>

            <div className="container">
                <ScrollReveal>
                    <div className="text-center mb-16">
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="w-10 h-0.5 bg-accent-cyan"></div>
                            <span className="badge">
                                <span className="badge-dot"></span>
                                tutorials
                            </span>
                            <div className="w-10 h-0.5 bg-accent-cyan"></div>
                        </div>
                        <h2 className="mb-6">
                            Agentic <span className="gradient-text">Tutorials</span>
                        </h2>
                        <p className="body-text max-w-[650px] mx-auto mb-8">
                            A comprehensive curriculum for building production-ready AI agents — {modules.reduce((sum, m) => sum + m.lessons.length, 0)} lessons across {modules.length} modules.
                        </p>
                    </div>
                </ScrollReveal>

                {/* Module Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {modules.map((module, i) => {
                        const colorClass = moduleColorClasses[i % moduleColorClasses.length];
                        const ModuleIcon = getIcon(module.lessons[0]?.icon || 'book-open');
                        const isComingSoon = module.lessons.length > 0 && module.lessons.every(l => l.status === 'coming-soon');

                        return (
                            <ScrollReveal key={module.id} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.05}>
                                <a
                                    href={`${baseUrl}tutorials`}
                                    className={`card card-color-${colorClass} block p-6 h-full relative overflow-hidden no-underline text-inherit transition-all hover:translate-x-1.5 group flex flex-col`}
                                >
                                    <div className="corner-accent corner-accent-lg"></div>

                                    {isComingSoon && (
                                        <div
                                            className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 text-xs font-mono uppercase tracking-wider border rounded"
                                            style={{
                                                color: 'var(--color-text-muted)',
                                                borderColor: 'var(--color-border)',
                                                background: 'color-mix(in srgb, var(--color-bg-elevated) 80%, transparent)'
                                            }}
                                        >
                                            <Clock size={10} /> Coming Soon
                                        </div>
                                    )}

                                    <div className="icon-box icon-box-outline mb-4">
                                        <ModuleIcon size={22} strokeWidth={2.5} />
                                    </div>

                                    <h4 className="card-title mb-3 flex items-center gap-2">
                                        {module.title}
                                        <ChevronRight size={16} className="opacity-50" />
                                    </h4>

                                    <p className="text-sm text-text-secondary leading-relaxed mb-3">
                                        {module.description}
                                    </p>

                                    {/* Lesson names list */}
                                    {module.lessons.length > 0 && (
                                        <div className="tprev-lesson-list mb-3">
                                            {module.lessons.map(lesson => (
                                                <span key={lesson.slug} className="tprev-lesson-name">{lesson.title}</span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="mt-auto pt-2 flex items-center justify-between gap-2 text-xs font-mono font-bold uppercase tracking-wider">
                                        <span className="tprev-count" style={{ color: `var(--palette-${colorClass})` }}>
                                            {module.lessons.length} lesson{module.lessons.length !== 1 ? 's' : ''}
                                        </span>
                                        <span className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                            browse <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                                        </span>
                                    </div>
                                </a>
                            </ScrollReveal>
                        );
                    })}
                </div>

                {/* CTA */}
                <ScrollReveal>
                    <div className="text-center">
                        <a
                            href={`${baseUrl}tutorials`}
                            className="btn-primary inline-flex items-center gap-2"
                        >
                            Browse All Tutorials <ArrowRight size={18} />
                        </a>
                    </div>
                </ScrollReveal>
            </div>

            <style>{`
                .tprev-lesson-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.3rem;
                }
                .tprev-lesson-name {
                    font-family: 'Azeret Mono', monospace;
                    font-size: 0.6rem;
                    color: var(--color-text-muted);
                    padding: 0.15rem 0.45rem;
                    border: 1px solid var(--color-border);
                    clip-path: var(--clip-corner-sm);
                    white-space: nowrap;
                    transition: all 0.2s;
                }
                .group:hover .tprev-lesson-name {
                    border-color: color-mix(in srgb, var(--color-border-accent) 30%, var(--color-border));
                }
                .tprev-count {
                    font-size: 0.7rem;
                    opacity: 0.7;
                }
            `}</style>
        </section>
    );
}
