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
            <div className="gradient-blur gradient-blur-violet absolute -top-32 -right-[5%] opacity-10"></div>

            <div className="container">
                <ScrollReveal>
                    <div className="text-center mb-14">
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="w-10 h-0.5" style={{ background: 'var(--color-accent-primary)' }}></div>
                            <span className="badge">patterns</span>
                            <div className="w-10 h-0.5" style={{ background: 'var(--color-accent-primary)' }}></div>
                        </div>
                        <h2 className="mb-4">
                            Agentic Patterns
                        </h2>
                        <p className="body-text max-w-[600px] mx-auto">
                            {patterns.length > 0 ? patterns.length : 26} design patterns for AI agent engineering — with architecture diagrams, trade-offs, and relationship maps.
                        </p>
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
                    {categoryData.map((cat, i) => {
                        const CatIcon = categoryIconMap[cat.id] || Brain;
                        const color = cat.color;

                        return (
                            <ScrollReveal key={cat.id} direction="up" delay={i * 0.05}>
                                <a
                                    href={`${baseUrl}patterns`}
                                    className={`card card-color-${color} block p-6 h-full no-underline text-inherit group flex flex-col`}
                                >
                                    <div className="icon-box icon-box-outline mb-4">
                                        <CatIcon size={20} />
                                    </div>

                                    <h4 className="card-title mb-2 flex items-center gap-2">
                                        {cat.emoji} {cat.label}
                                        <ChevronRight size={14} className="opacity-40" />
                                    </h4>

                                    <p className="text-sm text-text-secondary leading-relaxed mb-3">
                                        {cat.description}
                                    </p>

                                    {cat.patternNames.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                            {cat.patternNames.map(name => (
                                                <span
                                                    key={name}
                                                    className="text-[0.6rem] font-mono text-text-muted px-2 py-0.5 border border-border rounded"
                                                >
                                                    {name}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="mt-auto pt-2 flex items-center justify-between text-xs font-mono">
                                        <span style={{ color: `var(--palette-${color})` }}>
                                            {cat.count} pattern{cat.count !== 1 ? 's' : ''}
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
                        <a href={`${baseUrl}patterns`} className="btn-primary inline-flex items-center gap-2">
                            Browse All Patterns <ArrowRight size={16} />
                        </a>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
