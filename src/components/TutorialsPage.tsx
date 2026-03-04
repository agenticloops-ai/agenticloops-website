import { useState, useEffect, useMemo } from 'react';
import {
    Search, Filter, X, ChevronDown, ChevronRight, ArrowRight,
    BookOpen, ExternalLink
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { getGitHubUrl, GITHUB_REPOS } from '../config/repos';
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

export function TutorialsPage() {
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedModule, setSelectedModule] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const baseUrl = import.meta.env.BASE_URL || '';

    useEffect(() => {
        fetch(`${baseUrl}api/course-modules.json`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setModules(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const totalLessons = useMemo(() => modules.reduce((sum, m) => sum + m.lessons.length, 0), [modules]);

    const filteredModules = useMemo(() => {
        return modules
            .map(mod => {
                if (selectedModule && mod.id !== selectedModule) return null;

                if (!searchQuery) return mod;

                const q = searchQuery.toLowerCase();
                const moduleMatch = mod.title.toLowerCase().includes(q) || mod.description.toLowerCase().includes(q);
                const matchingLessons = mod.lessons.filter(l =>
                    l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q)
                );

                if (moduleMatch) return mod;
                if (matchingLessons.length > 0) return { ...mod, lessons: matchingLessons };
                return null;
            })
            .filter((mod): mod is Module => mod !== null);
    }, [modules, selectedModule, searchQuery]);

    const clearFilters = () => {
        setSelectedModule(null);
        setSearchQuery('');
    };

    const hasActiveFilters = selectedModule || searchQuery;

    return (
        <div className="tutorials-page">
            {/* Hero */}
            <section className="section hero-section relative overflow-hidden" style={{ minHeight: 'auto', paddingTop: '8rem', paddingBottom: '2.5rem' }}>
                <div className="gradient-blur gradient-blur-blue absolute top-32 -right-[5%]"></div>
                <div className="gradient-blur gradient-blur-violet absolute -bottom-32 -left-[5%]"></div>

                <div className="container">
                    <ScrollReveal>
                        <div className="text-center mb-8">
                            <div className="flex items-center justify-center gap-4 mb-6">
                                <div className="w-10 h-0.5 bg-accent-cyan"></div>
                                <span className="badge">
                                    <span className="badge-dot"></span>
                                    {totalLessons} lessons
                                </span>
                                <div className="w-10 h-0.5 bg-accent-cyan"></div>
                            </div>

                            <h1 className="mb-6">
                                Agentic <span className="gradient-text">Tutorials</span>
                            </h1>

                            <p className="body-text max-w-[700px] mx-auto mb-8">
                                A comprehensive curriculum for building production-ready AI agents.
                            </p>

                            <a
                                href={GITHUB_REPOS.agenticAIEngineering}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-secondary inline-flex items-center gap-2"
                                style={{ padding: '0.65rem 1.5rem', fontSize: '0.8rem' }}
                            >
                                <Github size={16} />
                                View on GitHub <ExternalLink size={14} />
                            </a>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Content */}
            <section className="section" style={{ paddingTop: '2rem' }}>
                <div className="container">
                    {/* Search & Filters Bar */}
                    <div className="tp-toolbar">
                        <div className="tp-search-bar">
                            <Search size={18} className="tp-search-icon" />
                            <input
                                type="text"
                                placeholder="Search tutorials..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="tp-search-input"
                            />
                            {searchQuery && (
                                <button className="tp-search-clear" onClick={() => setSearchQuery('')}>
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                        <button
                            className={`tp-filter-toggle ${hasActiveFilters ? 'has-filters' : ''}`}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter size={16} />
                            Modules
                            {selectedModule && (
                                <span className="tp-filter-count">1</span>
                            )}
                            <ChevronDown size={14} className={showFilters ? 'tp-chevron-open' : ''} />
                        </button>
                    </div>

                    {/* Expandable Filter Panel */}
                    {showFilters && (
                        <div className="tp-filter-panel">
                            <div className="tp-filter-group">
                                <span className="tp-filter-label">Module</span>
                                <div className="tp-filter-chips">
                                    {modules.map((mod, i) => {
                                        const colorClass = moduleColorClasses[i % moduleColorClasses.length];
                                        return (
                                            <button
                                                key={mod.id}
                                                className={`tp-chip ${selectedModule === mod.id ? 'active' : ''}`}
                                                onClick={() => setSelectedModule(selectedModule === mod.id ? null : mod.id)}
                                                style={selectedModule === mod.id ? {
                                                    borderColor: `var(--palette-${colorClass})`,
                                                    color: `var(--palette-${colorClass})`,
                                                    background: `color-mix(in srgb, var(--palette-${colorClass}) 10%, transparent)`
                                                } : undefined}
                                            >
                                                {mod.title}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            {hasActiveFilters && (
                                <button className="tp-clear-filters" onClick={clearFilters}>
                                    <X size={12} /> Clear all filters
                                </button>
                            )}
                        </div>
                    )}

                    {/* Module Grid with Lessons */}
                    {loading ? (
                        <div className="text-center py-16 text-text-muted">
                            Loading tutorials...
                        </div>
                    ) : filteredModules.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-text-muted mb-4">No tutorials match your criteria</p>
                            <button className="btn-secondary" onClick={clearFilters} style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}>
                                Clear filters
                            </button>
                        </div>
                    ) : (
                        filteredModules.map((module, moduleIndex) => {
                            const actualIndex = modules.findIndex(m => m.id === module.id);
                            const colorClass = moduleColorClasses[actualIndex % moduleColorClasses.length];
                            const isComingSoon = module.lessons.length > 0 && module.lessons.every(l => l.status === 'coming-soon');

                            return (
                                <div key={module.id} className={moduleIndex < filteredModules.length - 1 ? 'mb-24' : ''}>
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
                                                    MODULE_0{actualIndex + 1}
                                                </div>
                                                <h3
                                                    className="text-2xl font-bold m-0"
                                                    style={{ color: `var(--palette-${colorClass})`, textShadow: `0 0 20px color-mix(in srgb, var(--palette-${colorClass}) 25%, transparent)` }}
                                                >
                                                    {module.title}
                                                </h3>
                                                {isComingSoon && (
                                                    <div
                                                        className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono uppercase tracking-wider border rounded"
                                                        style={{
                                                            color: 'var(--color-text-muted)',
                                                            borderColor: 'var(--color-border)',
                                                            background: 'color-mix(in srgb, var(--color-bg-elevated) 80%, transparent)'
                                                        }}
                                                    >
                                                        <Icons.Clock size={10} /> Coming Soon
                                                    </div>
                                                )}
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
                                                            <ChevronRight size={16} className="opacity-50" />
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
                                                            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
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

            <style>{`
                .tutorials-page {
                    min-height: 100vh;
                }

                /* Toolbar */
                .tp-toolbar {
                    display: flex;
                    gap: 0.75rem;
                    margin-bottom: 1rem;
                    align-items: stretch;
                }
                @media (max-width: 640px) {
                    .tp-toolbar { flex-direction: column; }
                }
                .tp-search-bar {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    flex: 1;
                    padding: 0.6rem 1rem;
                    background: var(--color-bg-card-solid);
                    border: 1.5px solid var(--color-border);
                    transition: border-color 0.2s;
                    clip-path: var(--clip-corner-sm);
                }
                .tp-search-bar:focus-within {
                    border-color: var(--color-accent-cyan);
                    box-shadow: 0 0 20px rgba(6,182,212,0.1);
                }
                .tp-search-icon { color: var(--color-accent-cyan); opacity: 0.6; flex-shrink: 0; }
                .tp-search-input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    outline: none;
                    font-family: 'Rajdhani', sans-serif;
                    font-size: 1rem;
                    font-weight: 600;
                    color: var(--color-text-primary);
                    letter-spacing: 0.01em;
                }
                .tp-search-input::placeholder { color: var(--color-text-muted); opacity: 0.5; }
                .tp-search-clear {
                    display: flex; align-items: center; justify-content: center;
                    background: rgba(6,182,212,0.1); border: 1px solid rgba(6,182,212,0.3);
                    color: var(--color-accent-cyan); padding: 0.25rem; cursor: pointer;
                    transition: all 0.2s;
                }
                .tp-search-clear:hover { background: rgba(6,182,212,0.2); }

                .tp-filter-toggle {
                    display: flex; align-items: center; gap: 0.4rem;
                    padding: 0.6rem 1rem;
                    font-family: 'Rajdhani', sans-serif; font-size: 0.85rem; font-weight: 700;
                    text-transform: uppercase; letter-spacing: 0.06em;
                    background: var(--color-bg-card-solid); border: 1.5px solid var(--color-border);
                    color: var(--color-text-secondary); cursor: pointer; transition: all 0.2s;
                    clip-path: var(--clip-corner-sm); flex-shrink: 0;
                }
                .tp-filter-toggle:hover { border-color: var(--color-accent-cyan); color: var(--color-accent-cyan); }
                .tp-filter-toggle.has-filters { border-color: var(--color-accent-cyan); color: var(--color-accent-cyan); }
                .tp-filter-count {
                    font-family: 'Azeret Mono', monospace; font-size: 0.6rem;
                    background: var(--color-accent-cyan); color: #000;
                    padding: 0.1rem 0.35rem; font-weight: 700;
                }
                .tp-chevron-open { transform: rotate(180deg); }

                .tp-filter-panel {
                    padding: 1rem 1.25rem; margin-bottom: 1rem;
                    background: var(--color-bg-card-solid); border: 1.5px solid var(--color-border);
                    clip-path: var(--clip-corner-sm);
                    animation: tpSlideUp 0.2s ease-out;
                }
                @keyframes tpSlideUp {
                    from { opacity: 0; transform: translateY(-8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .tp-filter-group { margin-bottom: 0.75rem; }
                .tp-filter-group:last-of-type { margin-bottom: 0; }
                .tp-filter-label {
                    display: block; font-family: 'Azeret Mono', monospace;
                    font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.1em;
                    color: var(--color-text-muted); margin-bottom: 0.5rem;
                }
                .tp-filter-chips { display: flex; flex-wrap: wrap; gap: 0.35rem; }
                .tp-chip {
                    padding: 0.3rem 0.65rem;
                    font-family: 'Azeret Mono', monospace; font-size: 0.65rem; font-weight: 600;
                    background: transparent; border: 1px solid var(--color-border);
                    color: var(--color-text-secondary); cursor: pointer;
                    transition: all 0.15s; clip-path: var(--clip-corner-sm);
                }
                .tp-chip:hover { border-color: var(--color-accent-cyan); color: var(--color-accent-cyan); }
                .tp-chip.active { border-color: var(--color-accent-cyan); color: var(--color-accent-cyan); background: rgba(6,182,212,0.1); }
                .tp-clear-filters {
                    display: inline-flex; align-items: center; gap: 0.3rem;
                    margin-top: 0.75rem; font-family: 'Azeret Mono', monospace;
                    font-size: 0.6rem; color: var(--color-text-muted);
                    background: none; border: none; cursor: pointer; padding: 0;
                    transition: color 0.2s;
                }
                .tp-clear-filters:hover { color: var(--color-accent-cyan); }
            `}</style>
        </div>
    );
}
