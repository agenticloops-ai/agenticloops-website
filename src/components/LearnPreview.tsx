import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { RadarChart } from './learn/RadarChart';
import dimensions from '../data/dimensions.json';
import archetypes from '../data/archetypes.json';

const colorClasses = ['cyan', 'violet', 'pink', 'emerald', 'amber', 'rose', 'sky', 'orange'] as const;

export function LearnPreview() {
    const baseUrl = import.meta.env.BASE_URL || '';
    const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null);
    const archetype = archetypes.find(a => a.id === selectedArchetype);
    const dimensionsMeta = dimensions.map(d => ({ id: d.id, name: d.name }));

    return (
        <section className="section relative overflow-hidden" id="learn-preview">
            <div className="container">
                <ScrollReveal>
                    <div className="mb-8">
                        <h2 className="mb-2">Learning Path</h2>
                        <p className="text-sm text-text-secondary max-w-[500px]">
                            Eight capability dimensions. Pick what you're building and get a personalized plan.
                        </p>
                    </div>
                </ScrollReveal>

                <ScrollReveal delay={0.05}>
                    {/* Archetype picker */}
                    <div className="mb-6">
                        <p className="text-xs font-mono text-text-muted mb-2">I'm building a...</p>
                        <div className="flex flex-wrap gap-1.5">
                            {archetypes.map(a => {
                                const isActive = selectedArchetype === a.id;
                                return (
                                    <button
                                        key={a.id}
                                        onClick={() => setSelectedArchetype(isActive ? null : a.id)}
                                        className="border-none cursor-pointer transition-all"
                                        style={{
                                            padding: '0.3rem 0.7rem',
                                            borderRadius: '5px',
                                            fontSize: '0.75rem',
                                            fontFamily: 'inherit',
                                            fontWeight: 500,
                                            background: isActive ? 'var(--color-accent-primary)' : 'var(--color-bg-card-solid)',
                                            color: isActive ? '#fff' : 'var(--color-text-secondary)',
                                            border: `1px solid ${isActive ? 'var(--color-accent-primary)' : 'var(--color-border)'}`,
                                        }}
                                    >
                                        {a.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </ScrollReveal>

                <ScrollReveal delay={0.1}>
                    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 mb-8">
                        {/* Radar chart */}
                        <div className="flex justify-center items-center">
                            <div className="card p-4" style={{ background: 'var(--color-bg-card-solid)' }}>
                                <RadarChart
                                    dimensions={dimensionsMeta}
                                    values={archetype?.targetProfile ?? Object.fromEntries(dimensions.map(d => [d.id, 3]))}
                                    size={190}
                                    showLabels={false}
                                />
                            </div>
                        </div>

                        {/* Dimension list */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                            {dimensions.map((dim, i) => {
                                const colorClass = colorClasses[i % colorClasses.length];
                                const target = archetype?.targetProfile[dim.id as keyof typeof archetype.targetProfile];
                                const relevance = target ?? null;
                                const isDimmed = relevance !== null && relevance < 3;

                                return (
                                    <a
                                        key={dim.id}
                                        href={`${baseUrl}learn`}
                                        className="card p-3 no-underline text-inherit block transition-all"
                                        style={{
                                            opacity: isDimmed ? 0.4 : 1,
                                            borderColor: relevance !== null && relevance >= 4 ? `var(--palette-${colorClass})` : undefined,
                                        }}
                                    >
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <div
                                                className="w-2 h-2 rounded-full shrink-0"
                                                style={{ background: `var(--palette-${colorClass})` }}
                                            />
                                            <span className="text-xs font-semibold truncate">{dim.name}</span>
                                            {relevance !== null && (
                                                <span className="text-[9px] font-mono ml-auto shrink-0" style={{ color: `var(--palette-${colorClass})` }}>
                                                    {relevance}/5
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-text-muted leading-snug m-0 line-clamp-2">
                                            {dim.coreQuestion}
                                        </p>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </ScrollReveal>

                <ScrollReveal delay={0.15}>
                    <div className="text-center">
                        <a href={`${baseUrl}learn`} className="btn-primary inline-flex items-center gap-2">
                            Explore Learning Path <ArrowRight size={16} />
                        </a>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
