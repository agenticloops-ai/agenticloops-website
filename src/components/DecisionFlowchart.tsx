import { useState } from 'react';
import { DECISION_FLOWCHART } from '../config/patterns';

interface DecisionFlowchartProps {
    onSelectPattern?: (slug: string) => void;
}

const colorMap: Record<string, { hex: string; glow: string }> = {
    teal: { hex: '#10b981', glow: 'rgba(16,185,129,0.3)' },
    amber: { hex: '#f59e0b', glow: 'rgba(245,158,11,0.3)' },
    violet: { hex: '#8b5cf6', glow: 'rgba(139,92,246,0.3)' },
};

/**
 * SVG-based decision flowchart.
 *
 * Layout: questions as diamonds flowing top-to-bottom along a vertical spine.
 * "Yes" branches right to an answer pill. "No" continues down.
 * Last question shows both Yes and No answers branching right.
 */
export function DecisionFlowchart({ onSelectPattern }: DecisionFlowchartProps) {
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);
    const nodes = DECISION_FLOWCHART.nodes;
    const edges = DECISION_FLOWCHART.edges;

    const getNode = (id: string) => nodes.find(n => n.id === id);

    type Step = {
        question: typeof nodes[0];
        yesTarget: typeof nodes[0] | undefined;
        noTarget: typeof nodes[0] | undefined;
    };

    const steps: Step[] = [];
    const startEdge = edges.find(e => e.from === 'start');
    let currentQ = startEdge ? getNode(startEdge.to) : getNode('q1');

    while (currentQ && currentQ.type === 'question') {
        const outEdges = edges.filter(e => e.from === currentQ!.id);
        const yesEdge = outEdges.find(e => e.label === 'Yes');
        const noEdge = outEdges.find(e => e.label === 'No');
        const yesTarget = yesEdge ? getNode(yesEdge.to) : undefined;
        const noTarget = noEdge ? getNode(noEdge.to) : undefined;
        steps.push({ question: currentQ, yesTarget, noTarget });
        if (noTarget?.type === 'question') {
            currentQ = noTarget;
        } else {
            break;
        }
    }

    // Layout constants
    const diamondW = 140;
    const diamondH = 80;
    const answerW = 240;
    const answerH = 40;
    const stepGap = 40;          // vertical gap between diamond bottom and next diamond top
    const hGap = 60;             // horizontal gap between diamond right corner and answer left edge
    const spineX = 180;          // x center of diamond column
    const answerX = spineX + diamondW / 2 + hGap; // left edge of answer pills
    const stepHeight = diamondH + stepGap;

    // Total height: steps * stepHeight - last stepGap (no gap after last) + extra for final No answer
    const lastStep = steps[steps.length - 1];
    const lastHasNoAnswer = lastStep?.noTarget?.type === 'answer';
    const totalSteps = steps.length;
    const totalH = totalSteps * stepHeight - stepGap + (lastHasNoAnswer ? answerH + 16 : 0) + 20;
    const svgW = answerX + answerW + 30;

    const renderDiamond = (cx: number, cy: number, qText: string, qId: string) => {
        const isHovered = hoveredNode === qId;
        const hw = diamondW / 2;
        const hh = diamondH / 2;
        const points = `${cx},${cy - hh} ${cx + hw},${cy} ${cx},${cy + hh} ${cx - hw},${cy}`;

        // Wrap text at \n
        const lines = qText.replace(/\n/g, ' ').split(' ');
        // Smart line breaking: split roughly in half
        const mid = Math.ceil(lines.length / 2);
        const line1 = lines.slice(0, mid).join(' ');
        const line2 = lines.slice(mid).join(' ');

        return (
            <g
                onMouseEnter={() => setHoveredNode(qId)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ cursor: 'default' }}
            >
                {isHovered && (
                    <polygon
                        points={points}
                        fill="#06b6d4"
                        opacity={0.08}
                        filter="url(#df-glow)"
                    />
                )}
                <polygon
                    points={points}
                    fill="var(--color-bg-card-solid)"
                    stroke="#06b6d4"
                    strokeWidth={isHovered ? 2 : 1.5}
                    strokeOpacity={isHovered ? 0.9 : 0.5}
                    style={{ transition: 'all 0.2s' }}
                />
                {line2 ? (
                    <>
                        <text
                            x={cx} y={cy - 7}
                            fill={isHovered ? '#06b6d4' : 'var(--color-text-primary)'}
                            fontSize="11"
                            fontFamily="'Rajdhani', sans-serif"
                            fontWeight="700"
                            textAnchor="middle"
                            dominantBaseline="central"
                            style={{ transition: 'fill 0.2s', pointerEvents: 'none' }}
                        >{line1}</text>
                        <text
                            x={cx} y={cy + 9}
                            fill={isHovered ? '#06b6d4' : 'var(--color-text-primary)'}
                            fontSize="11"
                            fontFamily="'Rajdhani', sans-serif"
                            fontWeight="700"
                            textAnchor="middle"
                            dominantBaseline="central"
                            style={{ transition: 'fill 0.2s', pointerEvents: 'none' }}
                        >{line2}</text>
                    </>
                ) : (
                    <text
                        x={cx} y={cy}
                        fill={isHovered ? '#06b6d4' : 'var(--color-text-primary)'}
                        fontSize="11"
                        fontFamily="'Rajdhani', sans-serif"
                        fontWeight="700"
                        textAnchor="middle"
                        dominantBaseline="central"
                        style={{ transition: 'fill 0.2s', pointerEvents: 'none' }}
                    >{line1}</text>
                )}
            </g>
        );
    };

    const renderAnswer = (
        x: number, y: number, node: typeof nodes[0], _label: string
    ) => {
        const color = (node as { color?: string }).color || 'teal';
        const colors = colorMap[color] || colorMap.teal;
        const isHovered = hoveredNode === node.id;
        const rh = answerH;
        const rw = answerW;

        return (
            <g
                key={node.id}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => {
                    const slug = (node as { patternSlug?: string }).patternSlug;
                    if (slug && onSelectPattern) onSelectPattern(slug);
                }}
                style={{ cursor: 'pointer' }}
            >
                {isHovered && (
                    <rect
                        x={x - 4} y={y - 4}
                        width={rw + 8} height={rh + 8}
                        rx={6}
                        fill={colors.hex}
                        opacity={0.08}
                        filter="url(#df-glow)"
                    />
                )}
                <rect
                    x={x} y={y}
                    width={rw} height={rh}
                    rx={4}
                    fill={isHovered ? `${colors.hex}18` : 'var(--color-bg-card-solid)'}
                    stroke={colors.hex}
                    strokeWidth={isHovered ? 2 : 1.2}
                    strokeOpacity={isHovered ? 0.9 : 0.35}
                    style={{ transition: 'all 0.2s' }}
                />
                {/* Left accent bar */}
                <rect
                    x={x} y={y}
                    width={4} height={rh}
                    rx={0}
                    fill={colors.hex}
                    opacity={isHovered ? 0.9 : 0.5}
                    style={{ transition: 'opacity 0.2s' }}
                />
                <text
                    x={x + 18} y={y + rh / 2}
                    fill={colors.hex}
                    fontSize="10.5"
                    fontFamily="'Rajdhani', sans-serif"
                    fontWeight="700"
                    dominantBaseline="central"
                    style={{ pointerEvents: 'none', transition: 'fill 0.2s' }}
                >{node.label}</text>
                {/* Arrow icon */}
                <g
                    transform={`translate(${x + rw - 22}, ${y + rh / 2 - 5})`}
                    opacity={isHovered ? 1 : 0.3}
                    style={{ transition: 'opacity 0.2s' }}
                >
                    <line x1="0" y1="5" x2="8" y2="5" stroke={colors.hex} strokeWidth="1.5" />
                    <polyline points="5,2 8,5 5,8" fill="none" stroke={colors.hex} strokeWidth="1.5" />
                </g>
            </g>
        );
    };

    return (
        <div className="df-flow">
            <svg
                viewBox={`0 0 ${svgW} ${totalH}`}
                className="df-svg"
                style={{ width: '100%', maxWidth: `${svgW}px` }}
            >
                <defs>
                    <filter id="df-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {steps.map((step, i) => {
                    const isLast = i === steps.length - 1;
                    const cy = i * stepHeight + diamondH / 2;
                    const cx = spineX;
                    const noIsAnswer = step.noTarget?.type === 'answer';

                    // Diamond right corner position
                    const rightCornerX = cx + diamondW / 2;
                    const rightCornerY = cy;

                    // Answer Y - centered with diamond
                    const answerY = cy - answerH / 2;

                    return (
                        <g key={step.question.id}>
                            {/* Vertical line from previous diamond to this one */}
                            {i > 0 && (
                                <line
                                    x1={cx} y1={(i - 1) * stepHeight + diamondH / 2 + diamondH / 2}
                                    x2={cx} y2={cy - diamondH / 2}
                                    stroke="#06b6d4"
                                    strokeWidth={1.5}
                                    strokeOpacity={0.3}
                                />
                            )}

                            {/* "No" label on vertical connector */}
                            {i > 0 && (
                                <g>
                                    <rect
                                        x={cx - 14} y={(i - 1) * stepHeight + diamondH / 2 + diamondH / 2 + (stepGap - 16) / 2}
                                        width={28} height={16}
                                        rx={8}
                                        fill="var(--color-bg-card-solid)"
                                        stroke="#06b6d4"
                                        strokeWidth={0.8}
                                        strokeOpacity={0.3}
                                    />
                                    <text
                                        x={cx}
                                        y={(i - 1) * stepHeight + diamondH / 2 + diamondH / 2 + stepGap / 2}
                                        fill="#06b6d4"
                                        fontSize="8"
                                        fontFamily="'Azeret Mono', monospace"
                                        fontWeight="700"
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                        opacity={0.6}
                                    >NO</text>
                                </g>
                            )}

                            {/* Diamond */}
                            {renderDiamond(cx, cy, step.question.label, step.question.id)}

                            {/* Horizontal connector: diamond right corner → answer */}
                            {step.yesTarget && (
                                <>
                                    <line
                                        x1={rightCornerX}
                                        y1={rightCornerY}
                                        x2={answerX}
                                        y2={rightCornerY}
                                        stroke="#10b981"
                                        strokeWidth={1.5}
                                        strokeOpacity={0.3}
                                    />
                                    {/* "Yes" label */}
                                    <g>
                                        <rect
                                            x={rightCornerX + (hGap - 32) / 2}
                                            y={rightCornerY - 8}
                                            width={32} height={16}
                                            rx={8}
                                            fill="var(--color-bg-card-solid)"
                                            stroke="#10b981"
                                            strokeWidth={0.8}
                                            strokeOpacity={0.3}
                                        />
                                        <text
                                            x={rightCornerX + hGap / 2}
                                            y={rightCornerY}
                                            fill="#10b981"
                                            fontSize="8"
                                            fontFamily="'Azeret Mono', monospace"
                                            fontWeight="700"
                                            textAnchor="middle"
                                            dominantBaseline="central"
                                            opacity={0.7}
                                        >YES</text>
                                    </g>
                                    {renderAnswer(answerX, answerY, step.yesTarget, 'Yes')}
                                </>
                            )}

                            {/* Last question: also show No answer below the Yes answer */}
                            {isLast && noIsAnswer && step.noTarget && (() => {
                                const noAnswerY = answerY + answerH + 16;
                                const bottomCornerY = cy + diamondH / 2;
                                const noAnswerCenterY = noAnswerY + answerH / 2;
                                return (
                                    <>
                                        {/* Line down from diamond bottom corner */}
                                        <line
                                            x1={cx} y1={bottomCornerY}
                                            x2={cx} y2={noAnswerCenterY}
                                            stroke="#06b6d4"
                                            strokeWidth={1.5}
                                            strokeOpacity={0.3}
                                        />
                                        {/* Turn right to answer */}
                                        <line
                                            x1={cx} y1={noAnswerCenterY}
                                            x2={answerX} y2={noAnswerCenterY}
                                            stroke="#06b6d4"
                                            strokeWidth={1.5}
                                            strokeOpacity={0.3}
                                        />
                                        {/* "No" label on horizontal segment */}
                                        <g>
                                            <rect
                                                x={cx + (answerX - cx - 28) / 2}
                                                y={noAnswerCenterY - 8}
                                                width={28} height={16}
                                                rx={8}
                                                fill="var(--color-bg-card-solid)"
                                                stroke="#06b6d4"
                                                strokeWidth={0.8}
                                                strokeOpacity={0.3}
                                            />
                                            <text
                                                x={cx + (answerX - cx) / 2}
                                                y={noAnswerCenterY}
                                                fill="#06b6d4"
                                                fontSize="8"
                                                fontFamily="'Azeret Mono', monospace"
                                                fontWeight="700"
                                                textAnchor="middle"
                                                dominantBaseline="central"
                                                opacity={0.6}
                                            >NO</text>
                                        </g>
                                        {renderAnswer(answerX, noAnswerY, step.noTarget, 'No')}
                                    </>
                                );
                            })()}
                        </g>
                    );
                })}
            </svg>

            <style>{`
                .df-flow {
                    display: flex;
                    justify-content: center;
                    padding: 0 1rem;
                }
                .df-svg {
                    display: block;
                    height: auto;
                    user-select: none;
                }
                @media (max-width: 640px) {
                    .df-svg {
                        max-width: 100% !important;
                    }
                }
            `}</style>
        </div>
    );
}
