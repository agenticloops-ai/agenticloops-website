import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { PATTERN_CATEGORIES } from '../config/patterns';
import type { PatternData } from '../config/patterns';

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

    const filterPills = PATTERN_CATEGORIES.map(cat => ({
        label: cat.label,
        color: cat.color,
    }));

    return (
        <section className="section section-alt relative overflow-hidden" id="patterns">
            <div className="container">
                <ScrollReveal>
                    <div className="mb-8">
                        <h2 className="mb-4">Agentic Patterns</h2>
                        <div className="flex flex-wrap gap-2">
                            {filterPills.map((pill, i) => (
                                <span
                                    key={pill.label}
                                    className="text-xs font-mono px-3 py-1 rounded-full border border-border text-text-muted"
                                    style={i === 0 ? {
                                        background: 'var(--color-accent-primary)',
                                        color: '#fff',
                                        borderColor: 'var(--color-accent-primary)',
                                    } : {}}
                                >
                                    {pill.label}
                                </span>
                            ))}
                        </div>
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                    {categoryData.map((cat, i) => {
                        const color = cat.color;

                        return (
                            <ScrollReveal key={cat.id} direction="up" delay={i * 0.05}>
                                <a
                                    href={`${baseUrl}patterns`}
                                    className={`card card-color-${color} block p-5 h-full no-underline text-inherit group flex flex-col`}
                                >
                                    <h4 className="text-base font-semibold mb-2">
                                        {cat.emoji} {cat.label}
                                    </h4>

                                    <p className="text-sm text-text-secondary leading-relaxed mb-3">
                                        {cat.description}
                                    </p>

                                    {cat.patternNames.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {cat.patternNames.slice(0, 4).map(name => (
                                                <span
                                                    key={name}
                                                    className="text-xs font-mono text-text-muted px-2 py-0.5 border border-border rounded"
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
                        <a href={`${baseUrl}patterns`} className="btn-primary inline-flex items-center gap-2">
                            Browse All Patterns <ArrowRight size={16} />
                        </a>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
