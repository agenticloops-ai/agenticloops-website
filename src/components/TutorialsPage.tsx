import { useState, useEffect, useMemo } from 'react';
import {
    ChevronDown, Clock,
    BookOpen, ExternalLink
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import { getGitHubUrl, GITHUB_REPOS } from '../config/repos';
import { Github } from './BrandIcons';

const moduleColorClasses = ['cyan', 'violet', 'pink', 'emerald', 'amber'] as const;

// Rough time estimates per lesson (minutes)
const LESSON_TIME: Record<string, number> = {
    'simple-llm-call': 20, 'prompt-engineering': 30, 'chat': 25,
    'tool-use': 30, 'agent-loop': 45, 'capstone': 60,
    'prompt-chaining': 30, 'routing': 30, 'parallelization': 30,
    'orchestrator-workers': 45, 'evaluator-optimizer': 45, 'human-in-the-loop': 35,
};

function estimateTime(slug: string): number {
    const lastPart = slug.split('/').pop() || '';
    for (const [key, val] of Object.entries(LESSON_TIME)) {
        if (lastPart.includes(key)) return val;
    }
    return 30; // default
}

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

export function TutorialsPage() {
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
    const baseUrl = import.meta.env.BASE_URL || '';

    useEffect(() => {
        fetch(`${baseUrl}api/course-modules.json`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setModules(data);
                    setExpandedModules(new Set(data.map((m: Module) => m.id)));
                }
                setLoading(false);

                // Scroll to hash target after render
                requestAnimationFrame(() => {
                    const hash = window.location.hash;
                    if (hash) {
                        const el = document.querySelector(hash);
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
            })
            .catch(() => setLoading(false));
    }, []);

    const totalLessons = useMemo(() => modules.reduce((sum, m) => sum + m.lessons.length, 0), [modules]);
    const totalMinutes = useMemo(() =>
        modules.reduce((sum, m) => sum + m.lessons.reduce((s, l) => s + estimateTime(l.slug), 0), 0),
        [modules]
    );

    const filteredModules = modules;

    const toggleModule = (id: string) => {
        setExpandedModules(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    // Running lesson counter across modules
    let globalLessonIndex = 0;

    return (
        <div className="tutorials-page">
            {/* Header bar */}
            <section className="relative overflow-hidden" style={{ padding: '5.5rem 1.5rem 1.5rem' }}>
                <div className="container max-w-[900px]">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold mb-1">Agentic Tutorials</h1>
                            <p className="text-sm text-text-secondary m-0">
                                {totalLessons} lessons · ~{Math.round(totalMinutes / 60)} hours · from basics to production
                            </p>
                        </div>
                        <a
                            href={GITHUB_REPOS.agenticAIEngineering}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary inline-flex items-center gap-1.5 shrink-0"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                        >
                            <Github size={13} /> GitHub <ExternalLink size={10} />
                        </a>
                    </div>

                    {/* Module jump pills */}
                    <div className="flex flex-wrap gap-2">
                        {modules.map((mod, i) => {
                            const colorClass = moduleColorClasses[i % moduleColorClasses.length];
                            const isComingSoon = mod.lessons.length > 0 && mod.lessons.every(l => l.status === 'coming-soon');
                            return (
                                <button
                                    key={mod.id}
                                    onClick={() => {
                                        // Expand and scroll to module
                                        setExpandedModules(prev => new Set(prev).add(mod.id));
                                        document.getElementById(`module-${mod.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }}
                                    className="border-none cursor-pointer transition-all flex items-center gap-1.5"
                                    style={{
                                        padding: '0.35rem 0.7rem',
                                        borderRadius: '5px',
                                        fontSize: '0.75rem',
                                        fontFamily: 'inherit',
                                        fontWeight: 500,
                                        background: `color-mix(in srgb, var(--palette-${colorClass}) 10%, transparent)`,
                                        color: `var(--palette-${colorClass})`,
                                        border: `1px solid color-mix(in srgb, var(--palette-${colorClass}) 25%, transparent)`,
                                        opacity: isComingSoon ? 0.5 : 1,
                                    }}
                                >
                                    <span className="font-mono text-[10px] opacity-60">{String(i + 1).padStart(2, '0')}</span>
                                    {mod.title}
                                    <span className="text-[10px] opacity-50">{mod.lessons.length}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Content */}
            <section style={{ padding: '1rem 1.5rem 3rem' }}>
                <div className="container max-w-[900px]">

                    {loading ? (
                        <div className="text-center py-16 text-text-muted">Loading tutorials...</div>
                    ) : (
                        <div className="space-y-6">
                            {filteredModules.map((module, moduleIndex) => {
                                const actualIndex = modules.findIndex(m => m.id === module.id);
                                const colorClass = moduleColorClasses[actualIndex % moduleColorClasses.length];
                                const isExpanded = expandedModules.has(module.id);
                                const isComingSoon = module.lessons.length > 0 && module.lessons.every(l => l.status === 'coming-soon');
                                const moduleTime = module.lessons.reduce((s, l) => s + estimateTime(l.slug), 0);
                                const startIndex = globalLessonIndex;
                                globalLessonIndex += module.lessons.length;

                                return (
                                    <div key={module.id} id={`module-${module.id}`}>
                                        {/* Module header — clickable accordion */}
                                        <button
                                            onClick={() => toggleModule(module.id)}
                                            className="w-full text-left cursor-pointer border-none p-4 rounded-lg transition-all"
                                            style={{
                                                background: 'var(--color-bg-card-solid)',
                                                border: `1px solid ${isExpanded ? `var(--palette-${colorClass})` : 'var(--color-border)'}`,
                                                borderLeft: `3px solid var(--palette-${colorClass})`,
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded shrink-0"
                                                    style={{
                                                        color: `var(--palette-${colorClass})`,
                                                        background: `color-mix(in srgb, var(--palette-${colorClass}) 12%, transparent)`,
                                                        border: `1px solid color-mix(in srgb, var(--palette-${colorClass}) 30%, transparent)`,
                                                    }}
                                                >
                                                    MODULE {String(actualIndex + 1).padStart(2, '0')}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-base font-semibold m-0" style={{ color: `var(--palette-${colorClass})` }}>
                                                            {module.title}
                                                        </h3>
                                                        {isComingSoon && (
                                                            <span className="text-[10px] font-mono text-text-muted flex items-center gap-1">
                                                                <Clock size={9} /> Coming Soon
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-text-secondary m-0 mt-0.5">{module.description}</p>
                                                </div>
                                                <div className="text-right shrink-0 hidden sm:block">
                                                    <span className="text-[10px] font-mono text-text-muted block">
                                                        {module.lessons.length} lessons · ~{moduleTime}m
                                                    </span>
                                                </div>
                                                <ChevronDown
                                                    size={16}
                                                    className="text-text-muted shrink-0 transition-transform"
                                                    style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}
                                                />
                                            </div>
                                        </button>

                                        {/* Expanded: vertical lesson list */}
                                        {isExpanded && (
                                            <div className="relative ml-6 mt-2 pl-6 border-l-2" style={{ borderColor: `color-mix(in srgb, var(--palette-${colorClass}) 30%, transparent)`, animation: 'fadeIn 0.2s ease' }}>
                                                {module.lessons.map((lesson, i) => {
                                                    const LessonIcon = getIcon(lesson.icon || 'book-open');
                                                    const time = estimateTime(lesson.slug);
                                                    const lessonNumber = startIndex + i + 1;
                                                    const isLessonComingSoon = lesson.status === 'coming-soon';

                                                    return (
                                                        <a
                                                            key={lesson.slug}
                                                            href={getGitHubUrl(GITHUB_REPOS.agenticAIEngineering, lesson.slug)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="group block no-underline text-inherit py-3 relative"
                                                            style={{ opacity: isLessonComingSoon ? 0.5 : 1 }}
                                                            onClick={() => {
                                                                if (typeof window.gtag === 'function') {
                                                                    window.gtag('event', 'click_lesson', {
                                                                        event_category: 'engagement',
                                                                        event_label: lesson.slug,
                                                                        module: module.title
                                                                    });
                                                                }
                                                            }}
                                                        >
                                                            {/* Timeline dot */}
                                                            <div
                                                                className="absolute -left-[31px] top-[18px] w-3 h-3 rounded-full border-2"
                                                                style={{
                                                                    borderColor: `var(--palette-${colorClass})`,
                                                                    background: isLessonComingSoon ? 'var(--color-bg-primary)' : `var(--palette-${colorClass})`,
                                                                    boxShadow: isLessonComingSoon ? 'none' : `0 0 6px color-mix(in srgb, var(--palette-${colorClass}) 50%, transparent)`,
                                                                }}
                                                            />

                                                            <div className="flex items-start gap-3">
                                                                {/* Step number */}
                                                                <span className="text-[10px] font-mono text-text-muted w-5 shrink-0 text-right pt-0.5">
                                                                    {String(lessonNumber).padStart(2, '0')}
                                                                </span>

                                                                {/* Icon */}
                                                                <div
                                                                    className="icon-box icon-box-outline shrink-0"
                                                                    style={{ width: '28px', height: '28px' }}
                                                                >
                                                                    <LessonIcon size={14} />
                                                                </div>

                                                                {/* Content */}
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2">
                                                                        <h4 className="text-sm font-semibold m-0 group-hover:text-accent-primary transition-colors">
                                                                            {lesson.title}
                                                                        </h4>
                                                                        {isLessonComingSoon && (
                                                                            <span className="text-[9px] font-mono text-text-muted uppercase">soon</span>
                                                                        )}
                                                                    </div>
                                                                    {lesson.description && (
                                                                        <p className="text-xs text-text-secondary m-0 mt-0.5 leading-relaxed">
                                                                            {lesson.description}
                                                                        </p>
                                                                    )}
                                                                </div>

                                                                {/* Time + link */}
                                                                <div className="flex items-center gap-3 shrink-0 pt-0.5">
                                                                    <span className="text-[10px] font-mono text-text-muted flex items-center gap-1">
                                                                        <Clock size={9} /> {time}m
                                                                    </span>
                                                                    <span className="text-[10px] font-mono text-text-muted opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                                                        <Github size={11} /> code
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            <style>{`
                .tutorials-page { min-height: 100vh; }
            `}</style>
        </div>
    );
}
