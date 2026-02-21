import { useState, useEffect } from 'react';
import { ArrowRight, ChevronRight, Brain, Workflow, Network, Database, Shield, RefreshCcw } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { PATTERN_CATEGORIES } from '../config/patterns';
import type { PatternData } from '../config/patterns';

const categoryIconMap: Record<string, typeof Brain> = {
    reasoning: Brain,
    workflow: Workflow,
    orchestration: Network,
    memory: Database,
    safety: Shield,
    resilience: RefreshCcw,
};

export function PatternsPreview() {
    const baseUrl = import.meta.env.BASE_URL || '';
    const [patterns, setPatterns] = useState<PatternData[]>([]);

    useEffect(() => {
        fetch(`${baseUrl}api/patterns.json`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setPatterns(data);
            })
            .catch(() => { });
    }, []);

    // Group patterns by category
    const categoryData = PATTERN_CATEGORIES.map(cat => {
        const catPatterns = patterns.filter(p => p.category === cat.id);
        return {
            ...cat,
            count: catPatterns.length,
            patternNames: catPatterns.map(p => p.name),
        };
    });

    return (
        <section className="section relative overflow-hidden" id="patterns">
            {/* Background accents */}
            <div className="gradient-blur gradient-blur-violet absolute -top-32 -right-[5%] opacity-15"></div>
            <div className="gradient-blur gradient-blur-blue absolute -bottom-32 -left-[5%] opacity-15"></div>
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
                                patterns
                            </span>
                            <div className="w-10 h-0.5 bg-accent-cyan"></div>
                        </div>
                        <h2 className="mb-6">
                            Design <span className="gradient-text">Patterns</span>
                        </h2>
                        <p className="body-text max-w-[650px] mx-auto mb-8">
                            {patterns.length > 0 ? patterns.length : 26} design patterns for AI agent engineering — with architecture diagrams, trade-offs, and relationship maps.
                        </p>
                    </div>
                </ScrollReveal>

                {/* Category Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {categoryData.map((cat, i) => {
                        const CatIcon = categoryIconMap[cat.id] || Brain;
                        const color = cat.color;

                        return (
                            <ScrollReveal key={cat.id} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.05}>
                                <a
                                    href={`${baseUrl}patterns`}
                                    className={`card card-color-${color} block p-6 h-full relative overflow-hidden no-underline text-inherit transition-all hover:translate-x-1.5 group flex flex-col`}
                                >
                                    <div className="corner-accent corner-accent-lg"></div>

                                    <div className="icon-box icon-box-outline mb-4">
                                        <CatIcon size={22} strokeWidth={2.5} />
                                    </div>

                                    <h4 className="card-title mb-3 flex items-center gap-2">
                                        {cat.emoji} {cat.label}
                                        <ChevronRight size={16} className="opacity-50" />
                                    </h4>

                                    <p className="text-sm text-text-secondary leading-relaxed mb-3">
                                        {cat.description}
                                    </p>

                                    {/* Pattern names list */}
                                    {cat.patternNames.length > 0 && (
                                        <div className="pprev-pattern-list mb-3">
                                            {cat.patternNames.map(name => (
                                                <span key={name} className="pprev-pattern-name">{name}</span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="mt-auto pt-2 flex items-center justify-between gap-2 text-xs font-mono font-bold uppercase tracking-wider">
                                        <span className="pprev-count" style={{ color: `var(--palette-${color})` }}>
                                            {cat.count} pattern{cat.count !== 1 ? 's' : ''}
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
                            href={`${baseUrl}patterns`}
                            className="btn-primary inline-flex items-center gap-2"
                        >
                            Browse All Patterns <ArrowRight size={18} />
                        </a>
                    </div>
                </ScrollReveal>
            </div>

            <style>{`
                .pprev-pattern-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.3rem;
                }
                .pprev-pattern-name {
                    font-family: 'Azeret Mono', monospace;
                    font-size: 0.6rem;
                    color: var(--color-text-muted);
                    padding: 0.15rem 0.45rem;
                    border: 1px solid var(--color-border);
                    clip-path: var(--clip-corner-sm);
                    white-space: nowrap;
                    transition: all 0.2s;
                }
                .group:hover .pprev-pattern-name {
                    border-color: color-mix(in srgb, var(--color-border-accent) 30%, var(--color-border));
                }
                .pprev-count {
                    font-size: 0.7rem;
                    opacity: 0.7;
                }
            `}</style>
        </section>
    );
}
