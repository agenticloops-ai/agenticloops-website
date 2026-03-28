import { useState, useEffect } from 'react';
import { ArrowRight, Clock } from 'lucide-react';
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
    }, [baseUrl]);

    return (
        <section className="section relative overflow-hidden" id="topics">
            <div className="container">
                <ScrollReveal>
                    <div className="mb-8">
                        <h2 className="mb-4">Agentic Tutorials</h2>
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                    {modules.map((module, i) => {
                        const colorClass = moduleColorClasses[i % moduleColorClasses.length];
                        const isComingSoon = module.lessons.length > 0 && module.lessons.every(l => l.status === 'coming-soon');

                        return (
                            <ScrollReveal key={module.id} direction="up" delay={i * 0.05}>
                                <a
                                    href={`${baseUrl}tutorials#module-${module.id}`}
                                    className={`card card-color-${colorClass} block p-5 h-full no-underline text-inherit group flex flex-col`}
                                >
                                    {isComingSoon && (
                                        <div className="absolute top-3 right-3">
                                            <span className="coming-soon-badge">
                                                <Clock size={10} /> Coming Soon
                                            </span>
                                        </div>
                                    )}

                                    <h4 className="text-base font-semibold mb-2">{module.title}</h4>
                                    <p className="text-sm text-text-secondary leading-relaxed mb-3">{module.description}</p>

                                    {module.lessons.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {module.lessons.slice(0, 4).map(l => (
                                                <span
                                                    key={l.slug}
                                                    className="text-xs font-mono text-text-muted px-2 py-0.5 border border-border rounded"
                                                >
                                                    {l.title}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="mt-auto flex items-center justify-between text-xs font-mono">
                                        <span style={{ color: `var(--palette-${colorClass})` }}>
                                            {module.lessons.length} lesson{module.lessons.length !== 1 ? 's' : ''}
                                        </span>
                                        <span className="flex items-center gap-1 text-text-muted opacity-60 group-hover:opacity-100 transition-opacity">
                                            browse <ArrowRight size={12} />
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
