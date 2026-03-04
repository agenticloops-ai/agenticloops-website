import { useState, useEffect } from 'react';
import { ArrowRight, ChevronRight, BookOpen, Clock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

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
            <div className="gradient-blur gradient-blur-blue absolute -top-32 -right-[5%] opacity-10"></div>

            <div className="container">
                <ScrollReveal>
                    <div className="text-center mb-14">
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="w-10 h-0.5" style={{ background: 'var(--color-accent-primary)' }}></div>
                            <span className="badge">tutorials</span>
                            <div className="w-10 h-0.5" style={{ background: 'var(--color-accent-primary)' }}></div>
                        </div>
                        <h2 className="mb-4">
                            Agentic Tutorials
                        </h2>
                        <p className="body-text max-w-[600px] mx-auto">
                            A comprehensive curriculum for building production-ready AI agents — {modules.reduce((sum, m) => sum + m.lessons.length, 0)} lessons across {modules.length} modules.
                        </p>
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
                    {modules.map((module, i) => {
                        const colorClass = moduleColorClasses[i % moduleColorClasses.length];
                        const ModuleIcon = getIcon(module.lessons[0]?.icon || 'book-open');
                        const isComingSoon = module.lessons.length > 0 && module.lessons.every(l => l.status === 'coming-soon');

                        return (
                            <ScrollReveal key={module.id} direction="up" delay={i * 0.05}>
                                <a
                                    href={`${baseUrl}tutorials`}
                                    className={`card card-color-${colorClass} block p-6 h-full no-underline text-inherit group flex flex-col`}
                                >
                                    {isComingSoon && (
                                        <div className="absolute top-4 right-4">
                                            <span className="coming-soon-badge">
                                                <Clock size={10} /> Coming Soon
                                            </span>
                                        </div>
                                    )}

                                    <div className="icon-box icon-box-outline mb-4">
                                        <ModuleIcon size={20} />
                                    </div>

                                    <h4 className="card-title mb-2 flex items-center gap-2">
                                        {module.title}
                                        <ChevronRight size={14} className="opacity-40" />
                                    </h4>

                                    <p className="text-sm text-text-secondary leading-relaxed mb-3">
                                        {module.description}
                                    </p>

                                    {module.lessons.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                            {module.lessons.map(lesson => (
                                                <span
                                                    key={lesson.slug}
                                                    className="text-[0.6rem] font-mono text-text-muted px-2 py-0.5 border border-border rounded"
                                                >
                                                    {lesson.title}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="mt-auto pt-2 flex items-center justify-between text-xs font-mono">
                                        <span style={{ color: `var(--palette-${colorClass})` }}>
                                            {module.lessons.length} lesson{module.lessons.length !== 1 ? 's' : ''}
                                        </span>
                                        <span className="flex items-center gap-1 text-text-muted opacity-60 group-hover:opacity-100 transition-opacity">
                                            browse <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                                        </span>
                                    </div>
                                </a>
                            </ScrollReveal>
                        );
                    })}
                </div>

                <ScrollReveal>
                    <div className="text-center">
                        <a href={`${baseUrl}tutorials`} className="btn-primary inline-flex items-center gap-2">
                            Browse All Tutorials <ArrowRight size={16} />
                        </a>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
