import { useState, useEffect, useMemo, useCallback } from 'react';
import {
    ChevronDown, ChevronRight, ExternalLink, X,
} from 'lucide-react';
import type { PatternData } from '../config/patterns';
import { PATTERN_CATEGORIES, COMPLEXITY_LEVELS } from '../config/patterns';
import { GITHUB_REPOS } from '../config/repos';
import { Github } from './BrandIcons';

const categoryColorClasses = ['cyan', 'violet', 'pink', 'emerald', 'amber', 'cyan'] as const;

/** Curated learning progressions through patterns */
const PATTERN_PROGRESSIONS = [
    {
        id: 'first-agent',
        title: 'Your First Agent',
        description: 'From a single LLM call to an autonomous reasoning loop',
        color: 'cyan',
        steps: [
            { slug: 'chain-of-thought', label: 'Chain-of-Thought' },
            { slug: 'tool-use', label: 'Tool Use' },
            { slug: 'react', label: 'ReAct' },
            { slug: 'reflection', label: 'Reflection' },
        ],
    },
    {
        id: 'multi-agent',
        title: 'Single to Multi-Agent',
        description: 'Scale from one agent to coordinated teams',
        color: 'violet',
        steps: [
            { slug: 'prompt-chaining', label: 'Prompt Chaining' },
            { slug: 'orchestrator-workers', label: 'Orchestrator-Workers' },
            { slug: 'supervisor', label: 'Supervisor' },
            { slug: 'hierarchical-teams', label: 'Hierarchical Teams' },
        ],
    },
    {
        id: 'safe-agents',
        title: 'Making Agents Safe',
        description: 'Add guardrails, human oversight, and sandboxing',
        color: 'amber',
        steps: [
            { slug: 'guardrails', label: 'Guardrails' },
            { slug: 'human-in-the-loop', label: 'Human-in-the-Loop' },
            { slug: 'sandboxed-execution', label: 'Sandboxed Execution' },
        ],
    },
    {
        id: 'adding-memory',
        title: 'Adding Memory',
        description: 'From short-term context to persistent knowledge',
        color: 'emerald',
        steps: [
            { slug: 'conversation-memory', label: 'Conversation Memory' },
            { slug: 'semantic-memory', label: 'Semantic Memory' },
            { slug: 'agentic-rag', label: 'Agentic RAG' },
        ],
    },
];

/** Pattern combos for common archetypes */
const PATTERN_COMBOS = [
    {
        id: 'coding-assistant',
        title: 'Coding Assistant',
        examples: 'Claude Code, Cursor, Copilot',
        patterns: ['react', 'tool-use', 'guardrails', 'sandboxed-execution', 'conversation-memory'],
    },
    {
        id: 'research-bot',
        title: 'Research Pipeline',
        examples: 'Deep Research, Perplexity',
        patterns: ['prompt-chaining', 'parallelization', 'agentic-rag', 'evaluator-optimizer'],
    },
    {
        id: 'support-agent',
        title: 'Customer Support',
        examples: 'Intercom AI, Zendesk AI',
        patterns: ['routing', 'orchestrator-workers', 'human-in-the-loop', 'conversation-memory'],
    },
    {
        id: 'internal-automation',
        title: 'Internal Automator',
        examples: 'Slack bots, CI/CD agents',
        patterns: ['prompt-chaining', 'tool-use', 'retry-with-feedback', 'guardrails'],
    },
];

/** Render inline markdown (bold, italic, code) */
function renderMd(text: string) {
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) return <strong key={i} className="text-text-primary">{part.slice(2, -2)}</strong>;
        if (part.startsWith('*') && part.endsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>;
        if (part.startsWith('`') && part.endsWith('`')) return <code key={i} style={{ fontSize: '0.9em', padding: '0.1em 0.35em', background: 'var(--color-bg-tertiary)', borderRadius: '3px' }}>{part.slice(1, -1)}</code>;
        return part;
    });
}

const statusIcons: Record<string, string> = {
    'Canonical': '\u{1F3DB}\uFE0F',
    'Established': '\u2705',
    'Draft': '\u{1F4DD}',
};

export function PatternsPage() {
    const [patterns, setPatterns] = useState<PatternData[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const [selectedPattern, setSelectedPattern] = useState<PatternData | null>(null);
    const [showExplainer, setShowExplainer] = useState(true);
    const baseUrl = import.meta.env.BASE_URL || '';

    useEffect(() => {
        fetch(`${baseUrl}api/patterns.json`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setPatterns(data);
                    // Expand all categories by default
                    const cats = new Set(PATTERN_CATEGORIES.map(c => c.id));
                    setExpandedCategories(cats);
                }
                setLoading(false);

                // Handle URL hash — open pattern modal
                requestAnimationFrame(() => {
                    const hash = window.location.hash.slice(1);
                    if (hash && Array.isArray(data)) {
                        const pattern = data.find((p: PatternData) => p.slug === hash);
                        if (pattern) {
                            setSelectedPattern(pattern);
                        }
                    }
                });
            })
            .catch(() => setLoading(false));
    }, []);

    // Group patterns by category
    const patternsByCategory = useMemo(() => {
        const map: Record<string, PatternData[]> = {};
        for (const cat of PATTERN_CATEGORIES) {
            map[cat.id] = patterns
                .filter(p => p.category === cat.id)
                .sort((a, b) => a.complexityLevel - b.complexityLevel);
        }
        return map;
    }, [patterns]);

    const toggleCategory = (id: string) => {
        setExpandedCategories(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const openPattern = useCallback((pattern: PatternData) => {
        setSelectedPattern(pattern);
        window.history.replaceState(null, '', `#${pattern.slug}`);
    }, []);

    const closePattern = useCallback(() => {
        setSelectedPattern(null);
        window.history.replaceState(null, '', window.location.pathname);
    }, []);

    const navigateToPattern = useCallback((slug: string) => {
        const pattern = patterns.find(p => p.slug === slug);
        if (pattern) {
            setSelectedPattern(pattern);
            window.history.replaceState(null, '', `#${slug}`);
        }
    }, [patterns]);

    // Compute running start index per category
    const categoryStartIndex = useMemo(() => {
        const map: Record<string, number> = {};
        let idx = 0;
        for (const cat of PATTERN_CATEGORIES) {
            map[cat.id] = idx;
            idx += (patternsByCategory[cat.id] || []).length;
        }
        return map;
    }, [patternsByCategory]);

    return (
        <div style={{ minHeight: '100vh' }}>
            {/* Compact header */}
            <section className="relative overflow-hidden" style={{ padding: '5.5rem 1.5rem 1rem' }}>
                <div className="container max-w-[900px]">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold mb-1">Agentic Patterns</h1>
                            <p className="text-sm text-text-secondary m-0">
                                {patterns.length} patterns · {PATTERN_CATEGORIES.length} categories · from foundation to advanced
                            </p>
                        </div>
                        <a
                            href={GITHUB_REPOS.agenticAIPatterns}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary inline-flex items-center gap-1.5 shrink-0"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                        >
                            <Github size={13} /> GitHub <ExternalLink size={10} />
                        </a>
                    </div>
                </div>
            </section>

            <section style={{ padding: '0 1.5rem 3rem' }}>
                <div className="container max-w-[900px]">

                    {/* "What are patterns?" explainer */}
                    <div className="mb-4">
                        <button
                            onClick={() => setShowExplainer(!showExplainer)}
                            className="w-full text-left cursor-pointer border-none p-3 rounded-lg transition-all flex items-center gap-2"
                            style={{
                                background: 'var(--color-bg-card-solid)',
                                border: '1px solid var(--color-border)',
                            }}
                        >
                            <span className="text-sm font-semibold text-text-primary">What are design patterns?</span>
                            <ChevronDown
                                size={14}
                                className="text-text-muted ml-auto transition-transform"
                                style={{ transform: showExplainer ? 'rotate(180deg)' : 'rotate(0)' }}
                            />
                        </button>
                        {showExplainer && (
                            <div className="p-4 text-sm text-text-secondary leading-relaxed" style={{ animation: 'fadeIn 0.2s ease' }}>
                                <p className="mb-3 m-0">
                                    A <strong className="text-text-primary">design pattern</strong> is a reusable solution to a recurring engineering problem.
                                    These 26 patterns capture hard-won knowledge about how to structure AI agents — when to use a simple chain vs. a multi-agent swarm,
                                    how to add memory, how to keep agents safe. Think Gang of Four, but for agents.
                                </p>
                                <div className="flex flex-wrap gap-3 text-xs font-mono">
                                    {COMPLEXITY_LEVELS.map(cl => (
                                        <span key={cl.level} className="flex items-center gap-1.5">
                                            <span style={{ color: cl.level === 1 ? 'var(--palette-cyan)' : cl.level === 2 ? 'var(--palette-amber)' : 'var(--palette-pink)' }}>
                                                {cl.stars}
                                            </span>
                                            <span className="text-text-muted">{cl.label}</span>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Pattern Progressions */}
                    <div className="mb-6">
                        <h2 className="text-base font-semibold mb-1">Learning Progressions</h2>
                        <p className="text-xs text-text-secondary mb-3">Curated sequences — learn patterns in the right order.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {PATTERN_PROGRESSIONS.map(prog => (
                                <div
                                    key={prog.id}
                                    className="card p-3"
                                    style={{ borderLeft: `3px solid var(--palette-${prog.color})` }}
                                >
                                    <h4 className="text-sm font-semibold mb-0.5 m-0" style={{ color: `var(--palette-${prog.color})` }}>
                                        {prog.title}
                                    </h4>
                                    <p className="text-[11px] text-text-muted mb-2 m-0">{prog.description}</p>
                                    <div className="flex items-center gap-1 flex-wrap">
                                        {prog.steps.map((step, si) => (
                                            <span key={step.slug} className="flex items-center gap-1">
                                                <button
                                                    onClick={() => navigateToPattern(step.slug)}
                                                    className="bg-transparent border-none cursor-pointer p-0 text-xs font-medium transition-colors hover:text-accent-primary"
                                                    style={{ color: 'var(--color-text-primary)', fontFamily: 'inherit' }}
                                                >
                                                    {step.label}
                                                </button>
                                                {si < prog.steps.length - 1 && (
                                                    <span className="text-text-muted text-[10px] mx-0.5">→</span>
                                                )}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pattern Combos */}
                    <div className="mb-6">
                        <h2 className="text-base font-semibold mb-1">Pattern Combos</h2>
                        <p className="text-xs text-text-secondary mb-3">Which patterns work together for common agent types.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                            {PATTERN_COMBOS.map(combo => (
                                <div key={combo.id} className="card p-3">
                                    <h4 className="text-xs font-semibold mb-0.5 m-0 text-text-primary">{combo.title}</h4>
                                    <p className="text-[10px] text-text-muted mb-2 m-0 font-mono">{combo.examples}</p>
                                    <div className="flex flex-wrap gap-1">
                                        {combo.patterns.map(slug => {
                                            const p = patterns.find(pt => pt.slug === slug);
                                            const catConfig = p ? PATTERN_CATEGORIES.find(c => c.id === p.category) : null;
                                            const color = catConfig?.color || 'cyan';
                                            return (
                                                <button
                                                    key={slug}
                                                    onClick={() => navigateToPattern(slug)}
                                                    className="border-none cursor-pointer transition-all text-[10px] font-mono"
                                                    style={{
                                                        padding: '0.15rem 0.4rem',
                                                        borderRadius: '3px',
                                                        fontFamily: 'inherit',
                                                        background: `color-mix(in srgb, var(--palette-${color}) 12%, transparent)`,
                                                        color: `var(--palette-${color})`,
                                                        border: `1px solid color-mix(in srgb, var(--palette-${color}) 25%, transparent)`,
                                                    }}
                                                >
                                                    {p?.name || slug}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Category jump pills */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {PATTERN_CATEGORIES.map((cat, i) => {
                            const colorClass = categoryColorClasses[i % categoryColorClasses.length];
                            const count = patternsByCategory[cat.id]?.length ?? 0;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => {
                                        setExpandedCategories(prev => new Set(prev).add(cat.id));
                                        document.getElementById(`category-${cat.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
                                    }}
                                >
                                    <span className="font-mono text-[10px] opacity-60">{String(i + 1).padStart(2, '0')}</span>
                                    {cat.label}
                                    <span className="text-[10px] opacity-50">{count}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Pattern catalog */}
                    {loading ? (
                        <div className="text-center py-16 text-text-muted">Loading patterns...</div>
                    ) : (
                        <div className="space-y-4">
                            {PATTERN_CATEGORIES.map((cat, catIndex) => {
                                const colorClass = categoryColorClasses[catIndex % categoryColorClasses.length];
                                const catPatterns = patternsByCategory[cat.id] || [];
                                const isExpanded = expandedCategories.has(cat.id);
                                const complexityRange = catPatterns.length > 0
                                    ? `${COMPLEXITY_LEVELS[Math.min(...catPatterns.map(p => p.complexityLevel)) - 1]?.stars ?? ''} → ${COMPLEXITY_LEVELS[Math.max(...catPatterns.map(p => p.complexityLevel)) - 1]?.stars ?? ''}`
                                    : '';
                                const startIndex = categoryStartIndex[cat.id] ?? 0;

                                return (
                                    <div key={cat.id} id={`category-${cat.id}`}>
                                        {/* Category header */}
                                        <button
                                            onClick={() => toggleCategory(cat.id)}
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
                                                    {cat.emoji} {cat.label.toUpperCase()}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-text-secondary m-0">{cat.description}</p>
                                                </div>
                                                <div className="text-right shrink-0 hidden sm:block">
                                                    <span className="text-[10px] font-mono text-text-muted">
                                                        {catPatterns.length} patterns · {complexityRange}
                                                    </span>
                                                </div>
                                                <ChevronDown
                                                    size={16}
                                                    className="text-text-muted shrink-0 transition-transform"
                                                    style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}
                                                />
                                            </div>
                                        </button>

                                        {/* Expanded: pattern list */}
                                        {isExpanded && (
                                            <div
                                                className="relative ml-6 mt-2 pl-6 border-l-2"
                                                style={{
                                                    borderColor: `color-mix(in srgb, var(--palette-${colorClass}) 30%, transparent)`,
                                                    animation: 'fadeIn 0.2s ease',
                                                }}
                                            >
                                                {catPatterns.map((pattern, i) => {
                                                    const patternNumber = startIndex + i + 1;
                                                    const complexityInfo = COMPLEXITY_LEVELS[pattern.complexityLevel - 1];

                                                    return (
                                                        <button
                                                            key={pattern.slug}
                                                            id={`pattern-${pattern.slug}`}
                                                            onClick={() => openPattern(pattern)}
                                                            className="group w-full text-left bg-transparent border-none cursor-pointer py-3 relative block"
                                                            style={{ fontFamily: 'inherit' }}
                                                        >
                                                            <div
                                                                className="absolute -left-[31px] top-[18px] w-3 h-3 rounded-full border-2"
                                                                style={{
                                                                    borderColor: `var(--palette-${colorClass})`,
                                                                    background: 'var(--color-bg-primary)',
                                                                }}
                                                            />
                                                            <div className="flex items-start gap-3">
                                                                <span className="text-[10px] font-mono text-text-muted w-5 shrink-0 text-right pt-0.5">
                                                                    {String(patternNumber).padStart(2, '0')}
                                                                </span>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2 flex-wrap">
                                                                        <h4 className="text-sm font-semibold m-0 group-hover:text-accent-primary transition-colors">
                                                                            {pattern.name}
                                                                        </h4>
                                                                        <span className="text-[10px] font-mono" style={{
                                                                            color: pattern.complexityLevel === 1 ? 'var(--palette-cyan)' : pattern.complexityLevel === 2 ? 'var(--palette-amber)' : 'var(--palette-pink)',
                                                                        }}>
                                                                            {complexityInfo?.stars}
                                                                        </span>
                                                                        <span className="text-[9px] font-mono text-text-muted">
                                                                            {statusIcons[pattern.status] || ''} {pattern.status}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-xs text-text-secondary m-0 mt-0.5 leading-relaxed">
                                                                        {pattern.intent}
                                                                    </p>
                                                                </div>
                                                                <ChevronRight size={14} className="text-text-muted shrink-0 mt-1" />
                                                            </div>
                                                        </button>
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

            {/* Pattern Detail Modal */}
            {selectedPattern && (() => {
                const catConfig = PATTERN_CATEGORIES.find(c => c.id === selectedPattern.category);
                const color = catConfig?.color || 'cyan';
                const complexityInfo = COMPLEXITY_LEVELS[selectedPattern.complexityLevel - 1];

                return (
                    <div
                        className="fixed inset-0 z-[200] flex items-start justify-center pt-[80px] pb-8 px-4"
                        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
                        onClick={closePattern}
                    >
                        <div
                            className="w-full max-w-[720px] max-h-[calc(100vh-120px)] overflow-y-auto rounded-xl"
                            style={{
                                background: 'var(--color-bg-secondary)',
                                border: `1px solid var(--palette-${color})`,
                                boxShadow: `0 0 40px color-mix(in srgb, var(--palette-${color}) 15%, transparent)`,
                                animation: 'fadeIn 0.2s ease',
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="p-6 pb-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-xs font-mono px-2 py-0.5 rounded" style={{
                                            color: `var(--palette-${color})`,
                                            background: `color-mix(in srgb, var(--palette-${color}) 12%, transparent)`,
                                            border: `1px solid color-mix(in srgb, var(--palette-${color}) 30%, transparent)`,
                                        }}>
                                            {catConfig?.emoji} {catConfig?.label}
                                        </span>
                                        <span className="text-xs font-mono" style={{
                                            color: selectedPattern.complexityLevel === 1 ? 'var(--palette-cyan)' : selectedPattern.complexityLevel === 2 ? 'var(--palette-amber)' : 'var(--palette-pink)',
                                        }}>
                                            {complexityInfo?.stars} {complexityInfo?.label}
                                        </span>
                                        <span className="text-xs font-mono text-text-muted">
                                            {statusIcons[selectedPattern.status]} {selectedPattern.status}
                                        </span>
                                    </div>
                                    <button
                                        onClick={closePattern}
                                        className="bg-transparent border-none cursor-pointer text-text-muted hover:text-text-primary transition-colors p-1"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                <h2 className="text-xl font-bold mb-2 m-0">{selectedPattern.name}</h2>
                                <p className="text-sm text-text-secondary leading-relaxed m-0">{selectedPattern.intent}</p>
                            </div>

                            {/* Body */}
                            <div className="p-6 space-y-6">
                                {/* Problem */}
                                {selectedPattern.problemContext && (
                                    <div>
                                        <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2 m-0">Problem</h3>
                                        <p className="text-sm text-text-secondary leading-relaxed m-0">{renderMd(selectedPattern.problemContext)}</p>
                                        {selectedPattern.forces.length > 0 && (
                                            <div className="mt-3 space-y-1.5">
                                                {selectedPattern.forces.map((f, fi) => (
                                                    <div key={fi} className="text-sm text-text-muted px-3 py-1.5 rounded" style={{ background: 'var(--color-bg-tertiary)', borderLeft: `2px solid var(--palette-${color})` }}>
                                                        {renderMd(f)}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Solution */}
                                {selectedPattern.solutionDescription && (
                                    <div>
                                        <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2 m-0">Solution</h3>
                                        <p className="text-sm text-text-secondary leading-relaxed m-0">{renderMd(selectedPattern.solutionDescription)}</p>
                                    </div>
                                )}

                                {/* When to use / When NOT to use */}
                                {(selectedPattern.whenToUse.length > 0 || selectedPattern.whenNotToUse.length > 0) && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {selectedPattern.whenToUse.length > 0 && (
                                            <div>
                                                <h3 className="text-xs font-mono uppercase tracking-wider mb-2 m-0" style={{ color: 'var(--palette-emerald)' }}>When to use</h3>
                                                <ul className="text-sm text-text-secondary m-0 pl-5 space-y-1" style={{ listStyle: 'disc' }}>
                                                    {selectedPattern.whenToUse.map((w, wi) => <li key={wi}>{renderMd(w)}</li>)}
                                                </ul>
                                            </div>
                                        )}
                                        {selectedPattern.whenNotToUse.length > 0 && (
                                            <div>
                                                <h3 className="text-xs font-mono uppercase tracking-wider mb-2 m-0" style={{ color: 'var(--palette-pink)' }}>When NOT to use</h3>
                                                <ul className="text-sm text-text-secondary m-0 pl-5 space-y-1" style={{ listStyle: 'disc' }}>
                                                    {selectedPattern.whenNotToUse.map((w, wi) => <li key={wi}>{renderMd(w)}</li>)}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Pros / Cons */}
                                {(selectedPattern.pros.length > 0 || selectedPattern.cons.length > 0) && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {selectedPattern.pros.length > 0 && (
                                            <div>
                                                <h3 className="text-xs font-mono uppercase tracking-wider mb-2 m-0" style={{ color: 'var(--palette-emerald)' }}>Pros</h3>
                                                <ul className="text-sm text-text-secondary m-0 pl-5 space-y-1" style={{ listStyle: 'disc' }}>
                                                    {selectedPattern.pros.map((p, pi) => <li key={pi}>{renderMd(p)}</li>)}
                                                </ul>
                                            </div>
                                        )}
                                        {selectedPattern.cons.length > 0 && (
                                            <div>
                                                <h3 className="text-xs font-mono uppercase tracking-wider mb-2 m-0" style={{ color: 'var(--palette-pink)' }}>Cons</h3>
                                                <ul className="text-sm text-text-secondary m-0 pl-5 space-y-1" style={{ listStyle: 'disc' }}>
                                                    {selectedPattern.cons.map((c, ci) => <li key={ci}>{renderMd(c)}</li>)}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Related patterns */}
                                {selectedPattern.relations.length > 0 && (
                                    <div>
                                        <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-3 m-0">Related Patterns</h3>
                                        <div className="space-y-2">
                                            {selectedPattern.relations.map((rel, ri) => (
                                                <div key={ri} className="flex items-center gap-3">
                                                    <span className="font-mono text-xs text-text-muted shrink-0 w-28 text-right">{rel.relationship}</span>
                                                    <button
                                                        onClick={() => navigateToPattern(rel.patternSlug)}
                                                        className="bg-transparent border-none cursor-pointer p-0 font-inherit text-sm font-semibold transition-colors hover:text-accent-primary flex items-center gap-1"
                                                        style={{ color: 'var(--color-accent-primary)' }}
                                                    >
                                                        {rel.pattern} <ChevronRight size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                                    <a
                                        href={selectedPattern.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-secondary inline-flex items-center gap-1.5"
                                        style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                                    >
                                        <Github size={14} /> View full pattern on GitHub <ExternalLink size={11} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}
