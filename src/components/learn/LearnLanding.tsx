import { useState, useMemo } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { RadarChart } from './RadarChart';
import { LevelLadder } from './LevelLadder';
import dimensions from '../../data/dimensions.json';
import archetypes from '../../data/archetypes.json';
import contentCatalog from '../../data/content-catalog.json';

const colorClasses = ['cyan', 'violet', 'pink', 'emerald', 'amber', 'rose', 'sky', 'orange'] as const;

function getIcon(iconName: string): LucideIcon {
    const pascalCase = iconName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
    return (Icons as unknown as Record<string, LucideIcon>)[pascalCase] || Icons.BookOpen;
}

function getTypeColor(type: string) {
    switch (type) {
        case 'tutorial': return 'var(--color-accent-primary)';
        case 'pattern': return 'var(--palette-violet)';
        case 'external': return 'var(--palette-amber)';
        default: return 'var(--color-text-muted)';
    }
}

export function LearnLanding() {
    const baseUrl = import.meta.env.BASE_URL || '';
    const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null);
    const [expandedDimension, setExpandedDimension] = useState<string | null>(null);

    const archetype = archetypes.find(a => a.id === selectedArchetype);
    const dimensionsMeta = dimensions.map(d => ({ id: d.id, name: d.name }));

    // Personalized lesson plan grouped by dimension
    const lessonPlan = useMemo(() => {
        if (!archetype) return null;

        const sortedDims = dimensions
            .map((dim, i) => ({
                ...dim,
                colorClass: colorClasses[i % colorClasses.length],
                originalIndex: i,
                target: archetype.targetProfile[dim.id as keyof typeof archetype.targetProfile] ?? 0,
            }))
            .filter(d => d.target >= 2);

        return sortedDims.map(dim => {
            const items = contentCatalog
                .filter(item =>
                    item.dimensions.some(d => d.dimension === dim.id)
                )
                .sort((a, b) => {
                    const aLevel = a.dimensions.find(d => d.dimension === dim.id)?.level ?? 0;
                    const bLevel = b.dimensions.find(d => d.dimension === dim.id)?.level ?? 0;
                    if (aLevel !== bLevel) return aLevel - bLevel;
                    if (a.status !== b.status) return a.status === 'published' ? -1 : 1;
                    return 0;
                });

            return { dim, items };
        });
    }, [archetype]);

    // Content items per dimension
    const dimContentMap = useMemo(() => {
        const map: Record<string, typeof contentCatalog> = {};
        for (const dim of dimensions) {
            map[dim.id] = contentCatalog
                .filter(item =>
                    item.dimensions.some(d => d.dimension === dim.id)
                )
                .sort((a, b) => {
                    const aLevel = a.dimensions.find(d => d.dimension === dim.id)?.level ?? 0;
                    const bLevel = b.dimensions.find(d => d.dimension === dim.id)?.level ?? 0;
                    return aLevel - bLevel;
                });
        }
        return map;
    }, []);

    // Preview items (top 3 published) per dimension
    const dimPreviewMap = useMemo(() => {
        const map: Record<string, typeof contentCatalog> = {};
        for (const dim of dimensions) {
            map[dim.id] = (dimContentMap[dim.id] || [])
                .filter(item => item.status === 'published')
                .slice(0, 3);
        }
        return map;
    }, [dimContentMap]);

    return (
        <div>
            {/* Hero */}
            <section className="relative overflow-hidden" style={{ padding: '3rem 1.5rem 2rem' }}>
                <div className="container">
                    <div className="text-center mb-8">
                        <h1 className="mb-3">
                            Your Map to{' '}
                            <span className="gradient-text">Production-Grade</span>{' '}
                            Agents
                        </h1>
                        <p className="text-text-secondary max-w-[540px] mx-auto" style={{ fontSize: '1.05rem', lineHeight: 1.6 }}>
                            Eight skills. One radar. Find your path from demo to production.
                        </p>
                    </div>

                    {/* Inline archetype picker */}
                    <div className="max-w-[700px] mx-auto mb-10">
                        <p className="text-center text-sm text-text-muted mb-3 font-mono">
                            I'm building a...
                        </p>
                        <div className="grid grid-cols-3 gap-2 max-w-[600px] mx-auto">
                            {archetypes.map(a => {
                                const isActive = selectedArchetype === a.id;
                                return (
                                    <button
                                        key={a.id}
                                        onClick={() => setSelectedArchetype(isActive ? null : a.id)}
                                        className="border-none cursor-pointer transition-all text-center"
                                        style={{
                                            padding: '0.5rem 0.75rem',
                                            borderRadius: '6px',
                                            fontSize: '0.8rem',
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

                    {/* Radar chart + dimension bars */}
                    {archetype && (
                        <div className="max-w-[800px] mx-auto mb-6 card p-6" style={{ animation: 'fadeIn 0.3s ease' }}>
                            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-center">
                                <div className="flex justify-center">
                                    <RadarChart
                                        dimensions={dimensionsMeta}
                                        values={archetype.targetProfile}
                                        size={180}
                                        showLabels={false}
                                    />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold mb-3 text-text-primary">
                                        {archetype.name} — Target Profile
                                    </h3>
                                    <div className="space-y-1">
                                        {dimensions.map((dim, i) => {
                                            const level = archetype.targetProfile[dim.id as keyof typeof archetype.targetProfile] ?? 0;
                                            const colorClass = colorClasses[i % colorClasses.length];
                                            const percentage = (level / 5) * 100;
                                            return (
                                                <div key={dim.id} className="flex items-center gap-2">
                                                    <span className="text-xs text-text-muted font-mono w-28 shrink-0 truncate">{dim.name}</span>
                                                    <div className="flex-1 h-1.5 bg-border/30 rounded-sm overflow-hidden">
                                                        <div
                                                            className="h-full rounded-sm transition-all duration-500"
                                                            style={{
                                                                width: `${percentage}%`,
                                                                background: `var(--palette-${colorClass})`,
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-[10px] font-mono text-text-muted w-6 text-right">{level}/5</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                        {archetype.examples.map(ex => (
                                            <span key={ex} className="text-[10px] font-mono text-text-muted px-2 py-0.5 border border-border rounded">
                                                {ex}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* CONDITIONAL: Lesson plan (archetype) vs Dimensions grid (default) */}
            {archetype && lessonPlan ? (
                <section className="section-alt relative overflow-hidden" style={{ padding: '2.5rem 1.5rem', animation: 'fadeIn 0.3s ease' }}>
                    <div className="container">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-semibold mb-1">Your Learning Plan</h2>
                                <p className="text-sm text-text-secondary">
                                    {contentCatalog.filter(i => i.status === 'published').length} lessons across {lessonPlan.length} dimensions, ordered by priority.
                                </p>
                            </div>
                            <a href={`${baseUrl}tutorials`} className="link-action text-xs flex items-center gap-1 shrink-0">
                                All tutorials <ArrowRight size={11} />
                            </a>
                        </div>

                        <div className="space-y-10">
                            {lessonPlan.map(({ dim, items }) => {
                                const Icon = getIcon(dim.icon);
                                const publishedCount = items.filter(i => i.status === 'published').length;
                                const totalMinutes = items
                                    .filter(i => i.status === 'published')
                                    .reduce((sum, i) => sum + (i.estimatedMinutes ?? 0), 0);
                                const levelsToShow = dim.levels.filter(l => l.level <= dim.target);

                                return (
                                    <div key={dim.id}>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="icon-box icon-box-outline" style={{ width: '32px', height: '32px' }}>
                                                <Icon size={16} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-base font-semibold text-text-primary">{dim.name}</span>
                                                    <span
                                                        className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                                                        style={{
                                                            color: `var(--palette-${dim.colorClass})`,
                                                            background: `color-mix(in srgb, var(--palette-${dim.colorClass}) 12%, transparent)`,
                                                        }}
                                                    >
                                                        target {dim.target}/5
                                                    </span>
                                                </div>
                                                <p className="text-xs text-text-muted">
                                                    {publishedCount} lesson{publishedCount !== 1 ? 's' : ''} available
                                                    {totalMinutes > 0 && ` · ~${totalMinutes}m`}
                                                </p>
                                            </div>
                                        </div>
                                        <LevelLadder
                                            levels={levelsToShow}
                                            contentItems={items}
                                            dimensionId={dim.id}
                                            colorClass={dim.colorClass}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            ) : (
                <section className="section-alt relative overflow-hidden" style={{ padding: '2.5rem 1.5rem' }}>
                    <div className="container">
                        <h2 className="mb-2 text-lg font-semibold">Eight Capability Dimensions</h2>
                        <p className="text-sm text-text-secondary mb-6">
                            Each dimension is a distinct axis of competence for building production agentic systems.
                        </p>

                        <div className="space-y-4">
                            {dimensions.map((dim, i) => {
                                const colorClass = colorClasses[i % colorClasses.length];
                                const contentCount = (dimContentMap[dim.id] || []).length;
                                const Icon = getIcon(dim.icon);
                                const dimPreview = dimPreviewMap[dim.id] || [];
                                const isExpanded = expandedDimension === dim.id;
                                const allItems = dimContentMap[dim.id] || [];

                                return (
                                    <div key={dim.id}>
                                        {/* Dimension card — clickable to expand */}
                                        <button
                                            onClick={() => setExpandedDimension(isExpanded ? null : dim.id)}
                                            className={`card card-color-${colorClass} w-full text-left p-4 no-underline text-inherit cursor-pointer border-none block`}
                                            style={{
                                                background: 'var(--color-bg-card-solid)',
                                                borderColor: isExpanded ? `var(--palette-${colorClass})` : undefined,
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="icon-box icon-box-outline shrink-0" style={{ width: '32px', height: '32px' }}>
                                                    <Icon size={16} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="text-sm font-semibold">{dim.name}</h4>
                                                        <span className="text-[10px] font-mono text-text-muted">
                                                            {dim.levels.length} levels · {contentCount} items
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-text-secondary leading-relaxed m-0 italic">
                                                        "{dim.coreQuestion}"
                                                    </p>
                                                </div>

                                                {/* Preview items — visible when collapsed */}
                                                {!isExpanded && dimPreview.length > 0 && (
                                                    <div className="hidden lg:flex items-center gap-3 shrink-0">
                                                        {dimPreview.map(item => (
                                                            <span key={item.id} className="text-[11px] text-text-muted flex items-center gap-1">
                                                                <span style={{ color: getTypeColor(item.type) }}>{'>'}</span>
                                                                <span className="truncate max-w-[120px]">{item.title}</span>
                                                            </span>
                                                        ))}
                                                        {contentCount > 3 && (
                                                            <span className="text-[10px] text-text-muted opacity-60">+{contentCount - 3}</span>
                                                        )}
                                                    </div>
                                                )}

                                                <ChevronDown
                                                    size={16}
                                                    className="text-text-muted shrink-0 transition-transform"
                                                    style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}
                                                />
                                            </div>
                                        </button>

                                        {/* Expanded: Level ladder inline */}
                                        {isExpanded && (
                                            <div className="mt-3 ml-4 pb-2" style={{ animation: 'fadeIn 0.2s ease' }}>
                                                <LevelLadder
                                                    levels={dim.levels}
                                                    contentItems={allItems}
                                                    dimensionId={dim.id}
                                                    colorClass={colorClass}
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
