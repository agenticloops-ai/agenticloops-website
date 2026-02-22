import { X, ExternalLink, ArrowRight, CheckCircle2, XCircle, Scale, AlertTriangle, Lightbulb, Link2, Globe2 } from 'lucide-react';
import type { PatternData } from '../config/patterns';
import { PATTERN_CATEGORIES } from '../config/patterns';

/** Render inline markdown (bold, italic, code) as React elements */
function renderMd(text: string) {
    // Split on **bold**, *italic*, and `code` patterns
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={i}>{part.slice(1, -1)}</em>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
            return <code key={i} style={{ fontSize: '0.85em', padding: '0.1em 0.3em', background: 'var(--color-bg-tertiary)', borderRadius: '3px' }}>{part.slice(1, -1)}</code>;
        }
        return part;
    });
}

interface PatternPreviewProps {
    pattern: PatternData;
    onClose: () => void;
    onNavigateToPattern: (slug: string) => void;
}

export function PatternPreview({ pattern, onClose, onNavigateToPattern }: PatternPreviewProps) {
    const catConfig = PATTERN_CATEGORIES.find(c => c.id === pattern.category);
    const color = catConfig?.color || 'cyan';

    return (
        <div className="pattern-preview-overlay" onClick={onClose}>
            <div className="pattern-preview-modal" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="pp-header" style={{ borderColor: `var(--palette-${color})` }}>
                    <div className="pp-header-top">
                        <div className="pp-badges">
                            <span className="pp-cat-badge" style={{
                                color: `var(--palette-${color})`,
                                borderColor: `var(--palette-${color})`,
                                background: `color-mix(in srgb, var(--palette-${color}) 10%, transparent)`
                            }}>
                                {pattern.categoryEmoji} {pattern.categoryLabel}
                            </span>
                            <span className="pp-complexity-badge">
                                {pattern.complexity}
                            </span>
                        </div>
                        <button onClick={onClose} className="pp-close" aria-label="Close preview">
                            <X size={20} />
                        </button>
                    </div>
                    <h2 className="pp-title">
                        {pattern.number && <span className="pp-number">{pattern.number}</span>}
                        {pattern.name}
                    </h2>
                    {pattern.alsoKnownAs && (
                        <p className="pp-aka">Also known as: {pattern.alsoKnownAs}</p>
                    )}
                </div>

                {/* Content */}
                <div className="pp-content">
                    {/* Intent */}
                    <div className="pp-section">
                        <div className="pp-section-header">
                            <Lightbulb size={16} />
                            <h3>Intent</h3>
                        </div>
                        <p className="pp-intent">{pattern.intent}</p>
                    </div>

                    {/* Problem & Forces */}
                    {(pattern.problemContext || pattern.forces.length > 0) && (
                        <div className="pp-section">
                            <div className="pp-section-header">
                                <AlertTriangle size={16} />
                                <h3>Problem & Forces</h3>
                            </div>
                            {pattern.problemContext && (
                                <p className="pp-body">{renderMd(pattern.problemContext)}</p>
                            )}
                            {pattern.forces.length > 0 && (
                                <ul className="pp-forces">
                                    {pattern.forces.map((f, i) => (
                                        <li key={i}>{renderMd(f)}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                    {/* Solution */}
                    {pattern.solutionDescription && (
                        <div className="pp-section">
                            <div className="pp-section-header">
                                <CheckCircle2 size={16} />
                                <h3>Solution</h3>
                            </div>
                            <p className="pp-body">{renderMd(pattern.solutionDescription)}</p>
                        </div>
                    )}

                    {/* Trade-offs */}
                    {(pattern.pros.length > 0 || pattern.cons.length > 0) && (
                        <div className="pp-section">
                            <div className="pp-section-header">
                                <Scale size={16} />
                                <h3>Trade-offs</h3>
                            </div>
                            <div className="pp-tradeoffs-grid">
                                {pattern.pros.length > 0 && (
                                    <div className="pp-pros">
                                        <h4><CheckCircle2 size={14} /> Pros</h4>
                                        <ul>
                                            {pattern.pros.map((p, i) => <li key={i}>{renderMd(p)}</li>)}
                                        </ul>
                                    </div>
                                )}
                                {pattern.cons.length > 0 && (
                                    <div className="pp-cons">
                                        <h4><XCircle size={14} /> Cons</h4>
                                        <ul>
                                            {pattern.cons.map((c, i) => <li key={i}>{renderMd(c)}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            {pattern.tradeoffs.length > 0 && (
                                <div className="pp-tradeoffs-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Dimension</th>
                                                <th>Impact</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pattern.tradeoffs.map((t, i) => (
                                                <tr key={i}>
                                                    <td className="pp-dim">{renderMd(t.dimension)}</td>
                                                    <td>{renderMd(t.impact)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* When to Use / When NOT to Use */}
                    {(pattern.whenToUse.length > 0 || pattern.whenNotToUse.length > 0) && (
                        <div className="pp-section">
                            <div className="pp-when-grid">
                                {pattern.whenToUse.length > 0 && (
                                    <div className="pp-when-use">
                                        <h4><CheckCircle2 size={14} /> When to Use</h4>
                                        <ul>
                                            {pattern.whenToUse.map((w, i) => <li key={i}>{renderMd(w)}</li>)}
                                        </ul>
                                    </div>
                                )}
                                {pattern.whenNotToUse.length > 0 && (
                                    <div className="pp-when-not">
                                        <h4><XCircle size={14} /> When NOT to Use</h4>
                                        <ul>
                                            {pattern.whenNotToUse.map((w, i) => <li key={i}>{renderMd(w)}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Use Cases */}
                    {pattern.useCases.length > 0 && (
                        <div className="pp-section">
                            <div className="pp-section-header">
                                <Globe2 size={16} />
                                <h3>Use Cases</h3>
                            </div>
                            <div className="pp-usecases">
                                {pattern.useCases.map((uc, i) => (
                                    <div key={i} className="pp-usecase">
                                        <span className="pp-uc-domain">{uc.domain}</span>
                                        <span className="pp-uc-example">{renderMd(uc.example)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Related Patterns */}
                    {pattern.relations.length > 0 && (
                        <div className="pp-section">
                            <div className="pp-section-header">
                                <Link2 size={16} />
                                <h3>Related Patterns</h3>
                            </div>
                            <div className="pp-relations">
                                {pattern.relations.map((rel, i) => (
                                    <button
                                        key={i}
                                        className="pp-relation-item"
                                        onClick={() => onNavigateToPattern(rel.patternSlug)}
                                    >
                                        <span className="pp-rel-type">{rel.relationship}</span>
                                        <span className="pp-rel-name">{rel.pattern}</span>
                                        <ArrowRight size={14} className="pp-rel-arrow" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="pp-footer">
                    <div className="pp-status">
                        {pattern.status && <span className="pp-status-badge">{pattern.status}</span>}
                        {pattern.lastUpdated && <span className="pp-date">Updated {pattern.lastUpdated}</span>}
                    </div>
                    <a
                        href={pattern.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pp-github-link"
                    >
                        View on GitHub <ExternalLink size={14} />
                    </a>
                </div>
            </div>

            <style>{`
                .pattern-preview-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.6);
                    backdrop-filter: blur(4px);
                    z-index: 1000;
                    display: flex;
                    align-items: flex-start;
                    justify-content: center;
                    padding: 4vh 1rem;
                    overflow-y: auto;
                    animation: ppFadeIn 0.2s ease-out;
                }
                @keyframes ppFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes ppSlideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .pattern-preview-modal {
                    width: 100%;
                    max-width: 720px;
                    background: var(--color-bg-secondary);
                    border: 1.5px solid var(--color-border);
                    box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(6,182,212,0.1);
                    overflow: hidden;
                    animation: ppSlideUp 0.3s cubic-bezier(0.4,0,0.2,1);
                    clip-path: var(--clip-corner-md);
                    margin-bottom: 4vh;
                }
                .pp-header {
                    padding: 1.5rem 1.75rem 1.25rem;
                    border-bottom: 2px solid var(--color-border);
                    border-left: 4px solid;
                    background: linear-gradient(135deg, color-mix(in srgb, var(--color-bg-tertiary) 100%, transparent), var(--color-bg-secondary));
                }
                .pp-header-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 0.75rem;
                }
                .pp-badges {
                    display: flex;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                }
                .pp-cat-badge, .pp-complexity-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.3rem;
                    padding: 0.2rem 0.6rem;
                    font-size: 0.65rem;
                    font-weight: 700;
                    font-family: 'Azeret Mono', monospace;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    border: 1px solid;
                    clip-path: var(--clip-corner-sm);
                }
                .pp-complexity-badge {
                    color: var(--color-text-muted);
                    border-color: var(--color-border);
                    background: color-mix(in srgb, var(--color-bg-tertiary) 50%, transparent);
                }
                .pp-close {
                    background: transparent;
                    border: 1px solid var(--color-border);
                    color: var(--color-text-muted);
                    padding: 0.35rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .pp-close:hover {
                    color: var(--color-accent-cyan);
                    border-color: var(--color-accent-cyan);
                    background: rgba(6,182,212,0.1);
                }
                .pp-title {
                    font-family: 'Inter', sans-serif;
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--color-text-primary);
                    margin: 0;
                    line-height: 1.3;
                }
                .pp-number {
                    color: var(--color-accent-cyan);
                    margin-right: 0.5rem;
                    font-family: 'Azeret Mono', monospace;
                    font-size: 0.9rem;
                }
                .pp-aka {
                    font-family: 'Azeret Mono', monospace;
                    font-size: 0.7rem;
                    color: var(--color-text-muted);
                    margin: 0.5rem 0 0;
                    letter-spacing: 0.03em;
                }
                .pp-content {
                    padding: 0;
                    max-height: 60vh;
                    overflow-y: auto;
                }
                .pp-content::-webkit-scrollbar { width: 6px; }
                .pp-content::-webkit-scrollbar-track { background: transparent; }
                .pp-content::-webkit-scrollbar-thumb { background: var(--color-border); }
                .pp-content::-webkit-scrollbar-thumb:hover { background: var(--color-text-muted); }

                .pp-section {
                    padding: 1.25rem 1.75rem;
                    border-bottom: 1px solid var(--color-border);
                }
                .pp-section:last-child { border-bottom: none; }
                .pp-section-header {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.75rem;
                    color: var(--color-accent-cyan);
                }
                .pp-section-header h3 {
                    font-family: 'Rajdhani', sans-serif;
                    font-size: 0.85rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: var(--color-accent-cyan);
                    margin: 0;
                }
                .pp-intent {
                    font-size: 1rem;
                    color: var(--color-text-primary);
                    line-height: 1.7;
                    margin: 0;
                    font-weight: 500;
                }
                .pp-body {
                    font-size: 0.875rem;
                    color: var(--color-text-secondary);
                    line-height: 1.7;
                    margin: 0;
                }
                .pp-forces {
                    list-style: none;
                    padding: 0;
                    margin: 0.75rem 0 0;
                }
                .pp-forces li {
                    position: relative;
                    padding-left: 1.25rem;
                    margin-bottom: 0.5rem;
                    font-size: 0.8rem;
                    color: var(--color-text-secondary);
                    line-height: 1.6;
                }
                .pp-forces li::before {
                    content: '\u25B8';
                    position: absolute;
                    left: 0;
                    color: var(--color-accent-amber);
                }
                .pp-tradeoffs-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }
                @media (max-width: 640px) {
                    .pp-tradeoffs-grid, .pp-when-grid { grid-template-columns: 1fr; }
                }
                .pp-pros h4, .pp-cons h4, .pp-when-use h4, .pp-when-not h4 {
                    display: flex;
                    align-items: center;
                    gap: 0.35rem;
                    font-family: 'Azeret Mono', monospace;
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin: 0 0 0.5rem;
                }
                .pp-pros h4, .pp-when-use h4 { color: var(--palette-emerald); }
                .pp-cons h4, .pp-when-not h4 { color: #f87171; }
                .pp-pros ul, .pp-cons ul, .pp-when-use ul, .pp-when-not ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                .pp-pros li, .pp-cons li, .pp-when-use li, .pp-when-not li {
                    font-size: 0.8rem;
                    color: var(--color-text-secondary);
                    line-height: 1.6;
                    padding: 0.2rem 0;
                    padding-left: 0.75rem;
                    border-left: 2px solid var(--color-border);
                    margin-bottom: 0.25rem;
                }
                .pp-pros li { border-left-color: color-mix(in srgb, var(--palette-emerald) 40%, transparent); }
                .pp-cons li { border-left-color: color-mix(in srgb, #f87171 40%, transparent); }
                .pp-when-use li { border-left-color: color-mix(in srgb, var(--palette-emerald) 40%, transparent); }
                .pp-when-not li { border-left-color: color-mix(in srgb, #f87171 40%, transparent); }

                .pp-tradeoffs-table {
                    overflow-x: auto;
                }
                .pp-tradeoffs-table table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 0.8rem;
                }
                .pp-tradeoffs-table th {
                    text-align: left;
                    font-family: 'Azeret Mono', monospace;
                    font-size: 0.65rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: var(--color-text-muted);
                    padding: 0.5rem 0.75rem;
                    border-bottom: 1px solid var(--color-border);
                }
                .pp-tradeoffs-table td {
                    padding: 0.5rem 0.75rem;
                    color: var(--color-text-secondary);
                    border-bottom: 1px solid color-mix(in srgb, var(--color-border) 50%, transparent);
                }
                .pp-dim {
                    font-weight: 600;
                    color: var(--color-text-primary);
                }
                .pp-when-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }
                .pp-usecases {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .pp-usecase {
                    display: flex;
                    gap: 0.75rem;
                    align-items: baseline;
                    padding: 0.5rem 0;
                    border-bottom: 1px solid color-mix(in srgb, var(--color-border) 50%, transparent);
                }
                .pp-usecase:last-child { border-bottom: none; }
                .pp-uc-domain {
                    font-family: 'Azeret Mono', monospace;
                    font-size: 0.65rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: var(--color-accent-cyan);
                    white-space: nowrap;
                    flex-shrink: 0;
                    min-width: 100px;
                }
                .pp-uc-example {
                    font-size: 0.8rem;
                    color: var(--color-text-secondary);
                    line-height: 1.5;
                }
                .pp-relations {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }
                .pp-relation-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.4rem 0.75rem;
                    background: color-mix(in srgb, var(--color-bg-tertiary) 60%, transparent);
                    border: 1px solid var(--color-border);
                    cursor: pointer;
                    transition: all 0.2s;
                    clip-path: var(--clip-corner-sm);
                    font-family: inherit;
                }
                .pp-relation-item:hover {
                    border-color: var(--color-accent-cyan);
                    background: rgba(6,182,212,0.08);
                }
                .pp-rel-type {
                    font-family: 'Azeret Mono', monospace;
                    font-size: 0.6rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: var(--color-text-muted);
                }
                .pp-rel-name {
                    font-family: 'Rajdhani', sans-serif;
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: var(--color-text-primary);
                }
                .pp-rel-arrow {
                    color: var(--color-accent-cyan);
                    opacity: 0;
                    transition: opacity 0.2s;
                }
                .pp-relation-item:hover .pp-rel-arrow { opacity: 1; }

                .pp-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 1.75rem;
                    border-top: 2px solid var(--color-border);
                    background: var(--color-bg-tertiary);
                }
                .pp-status {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                .pp-status-badge {
                    font-family: 'Azeret Mono', monospace;
                    font-size: 0.65rem;
                    color: var(--color-text-muted);
                }
                .pp-date {
                    font-family: 'Azeret Mono', monospace;
                    font-size: 0.6rem;
                    color: var(--color-text-muted);
                    opacity: 0.7;
                }
                .pp-github-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    font-family: 'Azeret Mono', monospace;
                    font-size: 0.7rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: var(--color-accent-cyan);
                    text-decoration: none;
                    transition: all 0.2s;
                    padding: 0.35rem 0.75rem;
                    border: 1px solid var(--color-accent-cyan);
                    clip-path: var(--clip-corner-sm);
                }
                .pp-github-link:hover {
                    background: var(--color-accent-cyan);
                    color: #000;
                }
            `}</style>
        </div>
    );
}
