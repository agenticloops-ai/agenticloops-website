import { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Search, Filter, X, ExternalLink, ChevronDown, ChevronRight, ArrowRight,
    Brain, GitBranch, Network, Database, Shield, RefreshCcw,
    Workflow, LayoutGrid, Map, Landmark, CircleCheck, FileEdit
} from 'lucide-react';
import type { PatternData } from '../config/patterns';
import { PATTERN_CATEGORIES, COMPLEXITY_LEVELS, PATTERNS_REPO } from '../config/patterns';
import { ScrollReveal } from './ScrollReveal';
import { PatternPreview } from './PatternPreview';
import { DecisionFlowchart } from './DecisionFlowchart';
import { PatternRelationshipMap } from './PatternRelationshipMap';

const categoryIconMap: Record<string, typeof Brain> = {
    reasoning: Brain,
    workflow: Workflow,
    orchestration: Network,
    memory: Database,
    safety: Shield,
    resilience: RefreshCcw,
};

const categoryColorClasses = ['cyan', 'violet', 'pink', 'emerald', 'amber', 'cyan'] as const;

type ViewMode = 'catalog' | 'flowchart' | 'map';

export function PatternsPage() {
    const [patterns, setPatterns] = useState<PatternData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedComplexity, setSelectedComplexity] = useState<number | null>(null);
    const [selectedPattern, setSelectedPattern] = useState<PatternData | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('catalog');
    const [showFilters, setShowFilters] = useState(false);
    const baseUrl = import.meta.env.BASE_URL || '';

    useEffect(() => {
        fetch(`${baseUrl}api/patterns.json`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setPatterns(data);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedPattern(null);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    const filteredPatterns = useMemo(() => {
        return patterns.filter(p => {
            if (selectedCategory && p.category !== selectedCategory) return false;
            if (selectedComplexity && p.complexityLevel !== selectedComplexity) return false;
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                return (
                    p.name.toLowerCase().includes(q) ||
                    p.intent.toLowerCase().includes(q) ||
                    p.alsoKnownAs.toLowerCase().includes(q) ||
                    p.categoryLabel.toLowerCase().includes(q)
                );
            }
            return true;
        });
    }, [patterns, selectedCategory, selectedComplexity, searchQuery]);

    const groupedPatterns = useMemo(() => {
        const groups: Record<string, PatternData[]> = {};
        filteredPatterns.forEach(p => {
            if (!groups[p.category]) groups[p.category] = [];
            groups[p.category].push(p);
        });
        return groups;
    }, [filteredPatterns]);

    const handleSelectPatternBySlug = useCallback((slug: string) => {
        const pattern = patterns.find(p => p.slug === slug);
        if (pattern) {
            setSelectedPattern(pattern);
        }
    }, [patterns]);

    const clearFilters = () => {
        setSelectedCategory(null);
        setSelectedComplexity(null);
        setSearchQuery('');
    };

    const hasActiveFilters = selectedCategory || selectedComplexity || searchQuery;

    return (
        <div className="patterns-page">
            {/* Hero - matches home page centered style */}
            <section className="section hero-section relative overflow-hidden" style={{ minHeight: 'auto', paddingTop: '8rem', paddingBottom: '2.5rem' }}>
                {/* Background Gradient Blurs */}
                <div className="gradient-blur gradient-blur-blue absolute top-32 -right-[5%]"></div>
                <div className="gradient-blur gradient-blur-violet absolute -bottom-32 -left-[5%]"></div>

                <div className="container">
                    <ScrollReveal>
                        <div className="text-center mb-8">
                            <div className="flex items-center justify-center gap-4 mb-6">
                                <div className="w-10 h-0.5 bg-accent-cyan"></div>
                                <span className="badge">
                                    <span className="badge-dot"></span>
                                    {patterns.length} patterns
                                </span>
                                <div className="w-10 h-0.5 bg-accent-cyan"></div>
                            </div>

                            <h1 className="mb-6">
                                Design <span className="gradient-text">Patterns</span>
                            </h1>

                            <p className="body-text max-w-[700px] mx-auto mb-8">
                                The definitive catalog of design patterns for AI agent engineering.
                            </p>

                            <a
                                href={PATTERNS_REPO}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-secondary inline-flex items-center gap-2"
                                style={{ padding: '0.65rem 1.5rem', fontSize: '0.8rem' }}
                            >
                                View on GitHub <ExternalLink size={14} />
                            </a>
                        </div>
                    </ScrollReveal>

                    {/* View Mode Tabs */}
                    <div className="pp-view-tabs">
                        <button
                            className={`pp-tab ${viewMode === 'catalog' ? 'active' : ''}`}
                            onClick={() => setViewMode('catalog')}
                        >
                            <LayoutGrid size={16} /> Catalog
                        </button>
                        <button
                            className={`pp-tab ${viewMode === 'flowchart' ? 'active' : ''}`}
                            onClick={() => setViewMode('flowchart')}
                        >
                            <GitBranch size={16} /> Decision Guide
                        </button>
                        <button
                            className={`pp-tab ${viewMode === 'map' ? 'active' : ''}`}
                            onClick={() => setViewMode('map')}
                        >
                            <Map size={16} /> Relationship Map
                        </button>
                    </div>
                </div>
            </section>

            {/* Decision Flowchart View */}
            {viewMode === 'flowchart' && (
                <section className="section">
                    <div className="container">
                        <ScrollReveal>
                            <div className="text-center mb-10">
                                <h2 className="text-2xl font-bold mb-3">
                                    Find Your <span className="gradient-text">Pattern</span>
                                </h2>
                                <p className="body-text max-w-[500px] mx-auto">
                                    Not sure which pattern to use? Follow the flowchart to find the right one.
                                </p>
                            </div>
                        </ScrollReveal>
                        <DecisionFlowchart onSelectPattern={handleSelectPatternBySlug} />
                    </div>
                </section>
            )}

            {/* Relationship Map View */}
            {viewMode === 'map' && (
                <section className="section" style={{ paddingLeft: 0, paddingRight: 0 }}>
                    <div className="container">
                        <ScrollReveal>
                            <div className="text-center mb-10">
                                <h2 className="text-2xl font-bold mb-3">
                                    Pattern <span className="gradient-text">Relationships</span>
                                </h2>
                                <p className="body-text max-w-[500px] mx-auto">
                                    Patterns compose, extend, and create the need for each other. Click a pattern to view details.
                                </p>
                            </div>
                        </ScrollReveal>
                    </div>
                    <PatternRelationshipMap
                        onSelectPattern={handleSelectPatternBySlug}
                    />
                </section>
            )}

            {/* Catalog View */}
            {viewMode === 'catalog' && (
                <section className="section" style={{ paddingTop: '2rem' }}>
                    <div className="container">
                        {/* Search & Filters Bar */}
                        <div className="pp-toolbar">
                            <div className="pp-search-bar">
                                <Search size={18} className="pp-search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search patterns..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="pp-search-input"
                                />
                                {searchQuery && (
                                    <button className="pp-search-clear" onClick={() => setSearchQuery('')}>
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                            <button
                                className={`pp-filter-toggle ${hasActiveFilters ? 'has-filters' : ''}`}
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <Filter size={16} />
                                Filters
                                {hasActiveFilters && (
                                    <span className="pp-filter-count">
                                        {[selectedCategory, selectedComplexity].filter(Boolean).length}
                                    </span>
                                )}
                                <ChevronDown size={14} className={showFilters ? 'pp-chevron-open' : ''} />
                            </button>
                        </div>

                        {/* Expandable Filter Panel */}
                        {showFilters && (
                            <div className="pp-filter-panel">
                                <div className="pp-filter-group">
                                    <span className="pp-filter-label">Category</span>
                                    <div className="pp-filter-chips">
                                        {PATTERN_CATEGORIES.map(cat => (
                                            <button
                                                key={cat.id}
                                                className={`pp-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                                                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                                                style={selectedCategory === cat.id ? {
                                                    borderColor: `var(--palette-${cat.color})`,
                                                    color: `var(--palette-${cat.color})`,
                                                    background: `color-mix(in srgb, var(--palette-${cat.color}) 10%, transparent)`
                                                } : undefined}
                                            >
                                                {cat.emoji} {cat.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="pp-filter-group">
                                    <span className="pp-filter-label">Complexity</span>
                                    <div className="pp-filter-chips">
                                        {COMPLEXITY_LEVELS.map(cl => (
                                            <button
                                                key={cl.level}
                                                className={`pp-chip ${selectedComplexity === cl.level ? 'active' : ''}`}
                                                onClick={() => setSelectedComplexity(selectedComplexity === cl.level ? null : cl.level)}
                                            >
                                                {cl.stars} {cl.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {hasActiveFilters && (
                                    <button className="pp-clear-filters" onClick={clearFilters}>
                                        <X size={12} /> Clear all filters
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Results count */}
                        <div className="pp-results-meta">
                            <span className="code-comment">
                                {filteredPatterns.length} pattern{filteredPatterns.length !== 1 ? 's' : ''}
                                {hasActiveFilters ? ' (filtered)' : ''}
                            </span>
                        </div>

                        {/* Pattern Grid by Category - MODULE style headers like Topics */}
                        {loading ? (
                            <div className="text-center py-16 text-text-muted">
                                Loading patterns catalog...
                            </div>
                        ) : filteredPatterns.length === 0 ? (
                            <div className="text-center py-16">
                                <p className="text-text-muted mb-4">No patterns match your criteria</p>
                                <button className="btn-secondary" onClick={clearFilters} style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}>
                                    Clear filters
                                </button>
                            </div>
                        ) : (
                            PATTERN_CATEGORIES.map((catConfig, catIdx) => {
                                const catPatterns = groupedPatterns[catConfig.id];
                                if (!catPatterns || catPatterns.length === 0) return null;
                                const colorClass = categoryColorClasses[catIdx % categoryColorClasses.length];

                                return (
                                    <div key={catConfig.id} className={catIdx < PATTERN_CATEGORIES.length - 1 ? 'mb-24' : ''}>
                                        <ScrollReveal>
                                            {/* Category header matching Topics MODULE style exactly */}
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
                                                        {catConfig.emoji} {catPatterns.length} PATTERNS
                                                    </div>
                                                    <h3
                                                        className="text-2xl font-bold m-0"
                                                        style={{ color: `var(--palette-${colorClass})`, textShadow: `0 0 20px color-mix(in srgb, var(--palette-${colorClass}) 25%, transparent)` }}
                                                    >
                                                        {catConfig.label}
                                                    </h3>
                                                </div>
                                                <p className="body-text m-0">
                                                    {catConfig.description}
                                                </p>
                                            </div>
                                        </ScrollReveal>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {catPatterns.map((pattern, i) => {
                                                const CatIcon = categoryIconMap[pattern.category] || Brain;

                                                return (
                                                    <ScrollReveal key={pattern.id} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.03}>
                                                        <button
                                                            className={`card card-color-${colorClass} block p-6 h-full relative overflow-hidden no-underline text-inherit transition-all hover:translate-x-1.5 group flex flex-col w-full text-left cursor-pointer`}
                                                            onClick={() => setSelectedPattern(pattern)}
                                                        >
                                                            <div className="corner-accent corner-accent-lg"></div>

                                                            <div className="icon-box icon-box-outline mb-4">
                                                                <CatIcon size={22} strokeWidth={2.5} />
                                                            </div>

                                                            <h4 className="card-title mb-3 flex items-center gap-2">
                                                                {pattern.name}
                                                                <ChevronRight size={16} className="opacity-50" />
                                                            </h4>

                                                            {pattern.intent && (
                                                                <p className="text-sm text-text-secondary leading-relaxed mb-2 flex-1 pp-intent-clamp">
                                                                    {pattern.intent}
                                                                </p>
                                                            )}

                                                            {/* Complexity + Maturity badges */}
                                                            <div className="pp-card-badges">
                                                                <span className="pp-badge pp-badge-complexity">
                                                                    {pattern.complexity}
                                                                </span>
                                                                {pattern.status && (
                                                                    <span className={`pp-badge pp-badge-maturity pp-maturity-${pattern.status.toLowerCase()}`}>
                                                                        {pattern.status === 'Canonical' && <Landmark size={11} />}
                                                                        {pattern.status === 'Established' && <CircleCheck size={11} />}
                                                                        {pattern.status === 'Draft' && <FileEdit size={11} />}
                                                                        {pattern.status}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <div className="mt-auto pt-2 flex items-center justify-end gap-2 text-xs font-mono font-bold uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">
                                                                <span className="flex items-center gap-1.5">
                                                                    view pattern
                                                                </span>
                                                                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                                                            </div>
                                                        </button>
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
            )}

            {/* Pattern Preview Modal */}
            {selectedPattern && (
                <PatternPreview
                    pattern={selectedPattern}
                    onClose={() => setSelectedPattern(null)}
                    onNavigateToPattern={handleSelectPatternBySlug}
                />
            )}

            <style>{`
                .patterns-page {
                    min-height: 100vh;
                }

                /* View Mode Tabs */
                .pp-view-tabs {
                    display: flex;
                    justify-content: center;
                    gap: 0.25rem;
                    border: 1.5px solid var(--color-border);
                    padding: 0.25rem;
                    width: fit-content;
                    margin: 0 auto;
                    clip-path: var(--clip-corner-sm);
                    background: var(--color-bg-card-solid);
                }
                .pp-tab {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    padding: 0.5rem 1.25rem;
                    font-family: 'Rajdhani', sans-serif;
                    font-size: 0.85rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                    background: transparent;
                    border: none;
                    color: var(--color-text-muted);
                    cursor: pointer;
                    transition: all 0.2s;
                    clip-path: var(--clip-corner-sm);
                }
                .pp-tab:hover { color: var(--color-text-secondary); }
                .pp-tab.active {
                    background: var(--color-accent-gradient);
                    color: #000;
                }

                /* Toolbar */
                .pp-toolbar {
                    display: flex;
                    gap: 0.75rem;
                    margin-bottom: 1rem;
                    align-items: stretch;
                }
                @media (max-width: 640px) {
                    .pp-toolbar { flex-direction: column; }
                }
                .pp-search-bar {
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
                .pp-search-bar:focus-within {
                    border-color: var(--color-accent-cyan);
                    box-shadow: 0 0 20px rgba(6,182,212,0.1);
                }
                .pp-search-icon { color: var(--color-accent-cyan); opacity: 0.6; flex-shrink: 0; }
                .pp-search-input {
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
                .pp-search-input::placeholder { color: var(--color-text-muted); opacity: 0.5; }
                .pp-search-clear {
                    display: flex; align-items: center; justify-content: center;
                    background: rgba(6,182,212,0.1); border: 1px solid rgba(6,182,212,0.3);
                    color: var(--color-accent-cyan); padding: 0.25rem; cursor: pointer;
                    transition: all 0.2s;
                }
                .pp-search-clear:hover { background: rgba(6,182,212,0.2); }

                .pp-filter-toggle {
                    display: flex; align-items: center; gap: 0.4rem;
                    padding: 0.6rem 1rem;
                    font-family: 'Rajdhani', sans-serif; font-size: 0.85rem; font-weight: 700;
                    text-transform: uppercase; letter-spacing: 0.06em;
                    background: var(--color-bg-card-solid); border: 1.5px solid var(--color-border);
                    color: var(--color-text-secondary); cursor: pointer; transition: all 0.2s;
                    clip-path: var(--clip-corner-sm); flex-shrink: 0;
                }
                .pp-filter-toggle:hover { border-color: var(--color-accent-cyan); color: var(--color-accent-cyan); }
                .pp-filter-toggle.has-filters { border-color: var(--color-accent-cyan); color: var(--color-accent-cyan); }
                .pp-filter-count {
                    font-family: 'Azeret Mono', monospace; font-size: 0.6rem;
                    background: var(--color-accent-cyan); color: #000;
                    padding: 0.1rem 0.35rem; font-weight: 700;
                }
                .pp-chevron-open { transform: rotate(180deg); }

                .pp-filter-panel {
                    padding: 1rem 1.25rem; margin-bottom: 1rem;
                    background: var(--color-bg-card-solid); border: 1.5px solid var(--color-border);
                    clip-path: var(--clip-corner-sm);
                    animation: ppSlideUp 0.2s ease-out;
                }
                @keyframes ppSlideUp {
                    from { opacity: 0; transform: translateY(-8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .pp-filter-group { margin-bottom: 0.75rem; }
                .pp-filter-group:last-of-type { margin-bottom: 0; }
                .pp-filter-label {
                    display: block; font-family: 'Azeret Mono', monospace;
                    font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.1em;
                    color: var(--color-text-muted); margin-bottom: 0.5rem;
                }
                .pp-filter-chips { display: flex; flex-wrap: wrap; gap: 0.35rem; }
                .pp-chip {
                    padding: 0.3rem 0.65rem;
                    font-family: 'Azeret Mono', monospace; font-size: 0.65rem; font-weight: 600;
                    background: transparent; border: 1px solid var(--color-border);
                    color: var(--color-text-secondary); cursor: pointer;
                    transition: all 0.15s; clip-path: var(--clip-corner-sm);
                }
                .pp-chip:hover { border-color: var(--color-accent-cyan); color: var(--color-accent-cyan); }
                .pp-chip.active { border-color: var(--color-accent-cyan); color: var(--color-accent-cyan); background: rgba(6,182,212,0.1); }
                .pp-clear-filters {
                    display: inline-flex; align-items: center; gap: 0.3rem;
                    margin-top: 0.75rem; font-family: 'Azeret Mono', monospace;
                    font-size: 0.6rem; color: var(--color-text-muted);
                    background: none; border: none; cursor: pointer; padding: 0;
                    transition: color 0.2s;
                }
                .pp-clear-filters:hover { color: var(--color-accent-cyan); }

                .pp-results-meta { margin-bottom: 2rem; }

                /* Card intent clamp */
                .pp-intent-clamp {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                /* Card badges */
                .pp-card-badges {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.4rem;
                    margin-bottom: 0.5rem;
                    align-items: center;
                }
                .pp-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.3rem;
                    font-family: 'Azeret Mono', monospace;
                    font-size: 0.7rem;
                    font-weight: 600;
                    padding: 0.2rem 0.5rem;
                    border: 1px solid var(--color-border);
                    clip-path: var(--clip-corner-sm);
                    line-height: 1.3;
                }
                .pp-badge-complexity {
                    color: var(--color-accent-amber);
                    border-color: color-mix(in srgb, var(--color-accent-amber) 30%, var(--color-border));
                    background: color-mix(in srgb, var(--color-accent-amber) 6%, transparent);
                }
                .pp-badge-maturity {
                    color: var(--color-text-secondary);
                }
                .pp-maturity-canonical {
                    color: var(--palette-emerald);
                    border-color: color-mix(in srgb, var(--palette-emerald) 30%, var(--color-border));
                    background: color-mix(in srgb, var(--palette-emerald) 6%, transparent);
                }
                .pp-maturity-established {
                    color: var(--palette-cyan);
                    border-color: color-mix(in srgb, var(--palette-cyan) 30%, var(--color-border));
                    background: color-mix(in srgb, var(--palette-cyan) 6%, transparent);
                }
                .pp-maturity-draft {
                    color: var(--color-text-muted);
                    border-color: var(--color-border);
                    background: color-mix(in srgb, var(--color-bg-tertiary) 50%, transparent);
                }
            `}</style>
        </div>
    );
}
