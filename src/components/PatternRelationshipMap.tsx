import { useState, useCallback } from 'react';
import { RELATIONSHIP_MAP } from '../config/patterns';

interface PatternRelationshipMapProps {
    onSelectPattern?: (slug: string) => void;
}

interface NodePos {
    x: number;
    y: number;
    slug: string;
    name: string;
    groupId: string;
    color: string;
}

interface ClusterInfo {
    id: string;
    label: string;
    emoji: string;
    color: string;
    cx: number;
    cy: number;
    rx: number;
    ry: number;
    rotation: number;
}

const PATTERN_DISPLAY_NAMES: Record<string, string> = {
    'chain-of-thought': 'Chain-of-Thought',
    'react': 'ReAct',
    'rewoo': 'ReWOO',
    'tree-of-thoughts': 'Tree-of-Thoughts',
    'reflection': 'Reflection',
    'reflexion': 'Reflexion',
    'prompt-chaining': 'Prompt Chaining',
    'routing': 'Routing',
    'tool-use': 'Tool Use',
    'parallelization': 'Parallelization',
    'evaluator-optimizer': 'Eval-Optimizer',
    'orchestrator-workers': 'Orchestrator-Workers',
    'supervisor': 'Supervisor',
    'swarm-handoff': 'Swarm / Handoff',
    'hierarchical-teams': 'Hierarchical Teams',
    'agent-as-tool': 'Agent-as-Tool',
    'conversation-memory': 'Conversation Memory',
    'semantic-memory': 'Semantic Memory',
    'graphrag-memory': 'GraphRAG Memory',
    'agentic-rag': 'Agentic RAG',
    'guardrails': 'Guardrails',
    'human-in-the-loop': 'Human-in-Loop',
    'sandboxed-execution': 'Sandboxed Exec',
    'retry-with-feedback': 'Retry + Feedback',
    'dynamic-re-planning': 'Dynamic Replan',
    'multi-agent-debate': 'Multi-Agent Debate',
};

const colorHex: Record<string, string> = {
    cyan: '#06b6d4',
    violet: '#8b5cf6',
    pink: '#ec4899',
    emerald: '#10b981',
    amber: '#f59e0b',
};

/**
 * Wide-spread layout — nodes are spaced well apart, labels may extend outside cluster ellipses.
 * ViewBox 1600x650.
 */
function computeLayout(): { nodes: NodePos[]; clusters: ClusterInfo[] } {
    const groups = RELATIONSHIP_MAP.groups;
    const nodes: NodePos[] = [];
    const clusters: ClusterInfo[] = [];

    // 3-column, 2-row — clusters sized to be "suggestion bubbles", nodes can extend past edges
    const placements: [number, number, number, number, number][] = [
        [270, 175, 200, 130, -3],   // Reasoning (6 patterns)
        [800, 165, 185, 125, 2],   // Workflow (5 patterns)
        [1330, 175, 190, 128, -2],   // Orchestration (5 patterns)
        [285, 480, 180, 115, 2],   // Memory (4 patterns)
        [780, 490, 165, 110, -2],   // Safety (3 patterns)
        [1280, 480, 175, 115, 1],   // Resilience (3 patterns)
    ];

    // Generous offsets — nodes can go outside cluster boundary
    const patternOffsets: Record<string, [number, number][]> = {
        reasoning: [
            [-120, -65],  // chain-of-thought
            [120, -60],   // react
            [-155, 15],   // rewoo
            [0, -55],     // tree-of-thoughts
            [-65, 65],    // reflection
            [90, 58],     // reflexion
        ],
        workflow: [
            [-110, -60],  // prompt-chaining
            [110, -58],   // routing
            [0, -8],      // tool-use
            [-115, 55],   // parallelization
            [115, 50],    // evaluator-optimizer
        ],
        orchestration: [
            [-108, -60],  // orchestrator-workers
            [108, -55],   // supervisor
            [0, -8],      // swarm-handoff
            [-115, 58],   // hierarchical-teams
            [115, 55],    // agent-as-tool
        ],
        memory: [
            [-100, -48],  // conversation-memory
            [100, -42],   // semantic-memory
            [-95, 48],    // graphrag-memory
            [95, 42],     // agentic-rag
        ],
        safety: [
            [-90, -38],   // guardrails
            [90, -32],    // human-in-the-loop
            [0, 48],      // sandboxed-execution
        ],
        resilience: [
            [-98, -38],   // retry-with-feedback
            [90, -32],    // dynamic-re-planning
            [0, 50],      // multi-agent-debate
        ],
    };

    groups.forEach((group, gi) => {
        const [cx, cy, rx, ry, rotation] = placements[gi] || [800, 325, 200, 130, 0];

        clusters.push({
            id: group.id,
            label: group.label,
            emoji: group.emoji,
            color: group.color,
            cx, cy, rx, ry, rotation,
        });

        const offsets = patternOffsets[group.id] || [];

        group.patterns.forEach((slug, pi) => {
            const [dx, dy] = offsets[pi] || [0, 0];
            const px = cx + dx;
            const py = cy + dy;

            const rad = (rotation * Math.PI) / 180;
            const ddx = px - cx;
            const ddy = py - cy;
            const rotX = cx + ddx * Math.cos(rad) - ddy * Math.sin(rad);
            const rotY = cy + ddx * Math.sin(rad) + ddy * Math.cos(rad);

            nodes.push({
                x: rotX,
                y: rotY,
                slug,
                name: PATTERN_DISPLAY_NAMES[slug] || slug,
                groupId: group.id,
                color: group.color,
            });
        });
    });

    return { nodes, clusters };
}

export function PatternRelationshipMap({ onSelectPattern }: PatternRelationshipMapProps) {
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);

    const { nodes, clusters } = computeLayout();
    const viewBox = '-20 -10 1640 650';

    const getNode = useCallback((slug: string) => nodes.find(n => n.slug === slug), [nodes]);

    const isHighlighted = (slug: string) => {
        if (!hoveredNode) return true;
        if (slug === hoveredNode) return true;
        return RELATIONSHIP_MAP.edges.some(
            e => (e.from === hoveredNode && e.to === slug) || (e.to === hoveredNode && e.from === slug)
        );
    };

    const isEdgeHighlighted = (from: string, to: string) => {
        if (!hoveredNode) return false;
        return from === hoveredNode || to === hoveredNode;
    };

    const NODE_R = 4.5;

    const renderEdge = (edge: typeof RELATIONSHIP_MAP.edges[0], i: number) => {
        const fromNode = getNode(edge.from);
        const toNode = getNode(edge.to);
        if (!fromNode || !toNode) return null;

        const highlighted = isEdgeHighlighted(edge.from, edge.to);
        const dimmed = hoveredNode && !highlighted;
        const col = colorHex[fromNode.color] || '#06b6d4';

        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const ux = dx / dist;
        const uy = dy / dist;
        const sx = fromNode.x + ux * (NODE_R + 3);
        const sy = fromNode.y + uy * (NODE_R + 3);
        const ex = toNode.x - ux * (NODE_R + 5);
        const ey = toNode.y - uy * (NODE_R + 5);

        // Gentle curve
        const curvature = Math.min(0.15, 30 / dist);
        const cpx = (sx + ex) / 2 - dy * curvature;
        const cpy = (sy + ey) / 2 + dx * curvature;

        const midX = (sx + ex) / 2 - dy * curvature * 0.5;
        const midY = (sy + ey) / 2 + dx * curvature * 0.5;

        const isDashed = edge.verb === 'alternative';

        return (
            <g key={i} style={{ transition: 'opacity 0.35s' }} opacity={dimmed ? 0.04 : 1}>
                {/* Glow behind highlighted edges */}
                {highlighted && (
                    <path
                        d={`M ${sx} ${sy} Q ${cpx} ${cpy} ${ex} ${ey}`}
                        fill="none"
                        stroke={col}
                        strokeWidth={4}
                        opacity={0.08}
                        filter="url(#prm-glow)"
                    />
                )}
                <path
                    d={`M ${sx} ${sy} Q ${cpx} ${cpy} ${ex} ${ey}`}
                    fill="none"
                    stroke={col}
                    strokeWidth={highlighted ? 1.5 : 0.8}
                    strokeDasharray={isDashed ? '5 3' : undefined}
                    strokeOpacity={highlighted ? 0.75 : 0.2}
                    markerEnd={`url(#prm-arrow-${fromNode.color})`}
                    className={highlighted ? 'prm-edge-animated' : ''}
                    style={{ transition: 'stroke-width 0.2s, stroke-opacity 0.2s' }}
                />
                {/* Verb label — only show on hover */}
                {highlighted && (
                    <g style={{ transition: 'opacity 0.3s' }}>
                        <rect
                            x={midX - 32}
                            y={midY - 7}
                            width={64}
                            height={14}
                            rx={7}
                            fill="var(--color-bg-card-solid)"
                            stroke={col}
                            strokeWidth={0.6}
                            strokeOpacity={0.4}
                        />
                        <text
                            x={midX}
                            y={midY + 0.5}
                            fill={col}
                            fontSize="6.5"
                            fontFamily="'Azeret Mono', monospace"
                            fontWeight="600"
                            textAnchor="middle"
                            dominantBaseline="central"
                        >
                            {edge.verb}
                        </text>
                    </g>
                )}
            </g>
        );
    };

    const renderCluster = (cluster: ClusterInfo) => {
        const col = colorHex[cluster.color] || '#06b6d4';
        const isActiveGroup = hoveredNode
            ? nodes.some(n => n.groupId === cluster.id && n.slug === hoveredNode)
            : false;

        const patternId = `prm-dots-${cluster.id}`;

        return (
            <g key={cluster.id} style={{ transition: 'opacity 0.3s' }}>
                <defs>
                    <pattern id={patternId} x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="0.5" fill={col} opacity={isActiveGroup ? 0.1 : 0.035} />
                    </pattern>
                </defs>

                {isActiveGroup && (
                    <ellipse
                        cx={cluster.cx} cy={cluster.cy}
                        rx={cluster.rx + 6} ry={cluster.ry + 6}
                        fill={col} opacity={0.025}
                        transform={`rotate(${cluster.rotation} ${cluster.cx} ${cluster.cy})`}
                        filter="url(#prm-glow)"
                    />
                )}

                <ellipse
                    cx={cluster.cx} cy={cluster.cy}
                    rx={cluster.rx} ry={cluster.ry}
                    fill={`url(#${patternId})`}
                    transform={`rotate(${cluster.rotation} ${cluster.cx} ${cluster.cy})`}
                />

                <ellipse
                    cx={cluster.cx} cy={cluster.cy}
                    rx={cluster.rx} ry={cluster.ry}
                    fill={col}
                    opacity={isActiveGroup ? 0.04 : 0.012}
                    transform={`rotate(${cluster.rotation} ${cluster.cx} ${cluster.cy})`}
                    style={{ transition: 'opacity 0.3s' }}
                />

                <ellipse
                    cx={cluster.cx} cy={cluster.cy}
                    rx={cluster.rx} ry={cluster.ry}
                    fill="none" stroke={col}
                    strokeWidth={0.8}
                    strokeOpacity={isActiveGroup ? 0.2 : 0.07}
                    strokeDasharray="5 4"
                    transform={`rotate(${cluster.rotation} ${cluster.cx} ${cluster.cy})`}
                    style={{ transition: 'stroke-opacity 0.3s' }}
                />

                {/* Label at top for top-row clusters, bottom for bottom-row */}
                {(() => {
                    const isBottomRow = ['memory', 'safety', 'resilience'].includes(cluster.id);
                    const labelY = isBottomRow
                        ? cluster.cy + cluster.ry - 10
                        : cluster.cy - cluster.ry + 16;
                    return (
                        <text
                            x={cluster.cx}
                            y={labelY}
                            fill={col}
                            fontSize="9.5"
                            fontFamily="'Rajdhani', sans-serif"
                            fontWeight="700"
                            textAnchor="middle"
                            opacity={isActiveGroup ? 0.8 : 0.4}
                            letterSpacing="0.08em"
                            style={{ transition: 'opacity 0.3s' }}
                        >
                            {cluster.emoji} {cluster.label.toUpperCase()}
                        </text>
                    );
                })()}
            </g>
        );
    };

    return (
        <div className="prm-wrap">
            <svg
                viewBox={viewBox}
                className="prm-svg"
                onMouseLeave={() => setHoveredNode(null)}
            >
                <defs>
                    {Object.entries(colorHex).map(([name, hex]) => (
                        <marker key={name} id={`prm-arrow-${name}`} markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
                            <path d="M 0 0.5 L 6 2.5 L 0 4.5 Z" fill={hex} opacity="0.5" />
                        </marker>
                    ))}
                    <filter id="prm-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="8" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {clusters.map(renderCluster)}
                {RELATIONSHIP_MAP.edges.map(renderEdge)}

                {/* Compact dot + label nodes */}
                {nodes.map((node) => {
                    const hl = isHighlighted(node.slug);
                    const isHovered = hoveredNode === node.slug;
                    const col = colorHex[node.color] || '#06b6d4';

                    return (
                        <g
                            key={node.slug}
                            style={{
                                cursor: 'pointer',
                                transition: 'opacity 0.25s',
                                opacity: hl ? 1 : 0.08,
                            }}
                            onMouseEnter={() => setHoveredNode(node.slug)}
                            onMouseLeave={() => setHoveredNode(null)}
                            onClick={(e) => {
                                e.stopPropagation();
                                setHoveredNode(null);
                                onSelectPattern?.(node.slug);
                            }}
                        >
                            {isHovered && (
                                <circle
                                    cx={node.x} cy={node.y} r={16}
                                    fill={col} opacity={0.08}
                                    filter="url(#prm-glow)"
                                />
                            )}

                            <circle
                                cx={node.x}
                                cy={node.y}
                                r={isHovered ? NODE_R + 1.5 : NODE_R}
                                fill={isHovered ? col : `${col}44`}
                                stroke={col}
                                strokeWidth={isHovered ? 1.8 : 1}
                                strokeOpacity={isHovered ? 1 : 0.5}
                                style={{ transition: 'all 0.2s' }}
                            />

                            <circle
                                cx={node.x}
                                cy={node.y}
                                r={1.5}
                                fill={isHovered ? '#fff' : col}
                                opacity={isHovered ? 0.9 : 0.4}
                                style={{ transition: 'all 0.2s' }}
                            />

                            <text
                                x={node.x}
                                y={node.y + (NODE_R + 11)}
                                fill={isHovered ? col : (hl ? 'var(--color-text-primary)' : `${col}77`)}
                                fontSize={isHovered ? '9' : '8'}
                                fontFamily="'Rajdhani', sans-serif"
                                fontWeight={isHovered ? '700' : '600'}
                                textAnchor="middle"
                                dominantBaseline="central"
                                style={{ transition: 'all 0.2s', pointerEvents: 'none' }}
                            >
                                {node.name}
                            </text>
                        </g>
                    );
                })}
            </svg>

            <style>{`
                .prm-wrap {
                    position: relative;
                    overflow: hidden;
                }
                .prm-svg {
                    width: 100%;
                    height: 680px;
                    display: block;
                    user-select: none;
                }
                @media (max-width: 768px) {
                    .prm-svg { height: 440px; }
                }

                .prm-edge-animated {
                    stroke-dasharray: 6 3;
                    animation: prmEdgeFlow 0.8s linear infinite;
                }
                @keyframes prmEdgeFlow {
                    to { stroke-dashoffset: -9; }
                }
            `}</style>
        </div>
    );
}
