import { useEffect, useState } from 'react';

export function AgentLoopDiagram() {
    const [activeStep, setActiveStep] = useState(0);
    const [activeTool, setActiveTool] = useState(0);
    const [showToolResult, setShowToolResult] = useState(false);
    const [showUserMessage, setShowUserMessage] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep(prev => {
                const next = (prev + 1) % 4;
                if (next === 0) {
                    setShowToolResult(false);
                    setShowUserMessage(true);
                }
                if (next === 3) setShowToolResult(true);
                return next;
            });
        }, 1800);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (activeStep === 2) {
            setActiveTool(prev => (prev + 1) % 3);
        }
    }, [activeStep]);

    const tools = ['web_search()', 'execute_code()', 'read_file()'];

    const labelStyle = {
        fontSize: '0.75rem',
        color: 'var(--color-text-secondary)',
        fontWeight: 500,
        fontFamily: "'JetBrains Mono', monospace",
        zIndex: 1,
        whiteSpace: 'nowrap' as const,
        transition: 'opacity 0.3s',
    };

    const chipStyle = {
        background: 'var(--color-subtle)',
        color: 'var(--color-text-secondary)',
        border: '1px solid var(--color-border)',
        padding: '0.35rem 0.75rem',
        borderRadius: 'var(--radius-input)',
        fontSize: '0.7rem',
        fontWeight: 500,
    };

    // Layout Constants
    const containerWidth = 400;
    const centerX = containerWidth / 2; // 200
    const boxWidth = 260;
    const boxLeftX = centerX - (boxWidth / 2); // 70

    // Vertical positions
    const contextTopY = 20;
    const contextHeight = 190;
    const contextBottomY = contextTopY + contextHeight; // 210

    const gap1 = 50;
    const llmTopY = contextBottomY + gap1; // 260
    const llmHeight = 60; // Approx
    const llmBottomY = llmTopY + llmHeight; // 320

    const gap2 = 60;
    const toolsTopY = llmBottomY + gap2; // 380
    const toolsHeight = 130; // Approx

    // Loop Connection Points
    // Exit from Left side of Tools box
    const loopStartY = toolsTopY + (toolsHeight / 2);

    // Enter Left side of Context box at Tool Result position
    const loopEndY = 155;

    return (
        <div style={{
            position: 'relative',
            width: `${containerWidth}px`,
            height: '560px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: `${contextTopY}px`
        }}>
            {/* SVG Overlay for ALL lines */}
            <svg style={{
                position: 'absolute',
                left: '0',
                top: '0',
                width: '100%',
                height: '100%',
                overflow: 'visible',
                pointerEvents: 'none',
                zIndex: 3
            }}>
                <defs>
                    <style>
                        {`
              .flow-line {
                stroke-dasharray: 5 5;
                animation: dash 1s linear infinite;
              }
              @keyframes dash {
                to {
                  stroke-dashoffset: -10;
                }
              }
              @media (prefers-reduced-motion: reduce) {
                .flow-line {
                  animation: none;
                }
              }
            `}
                    </style>
                </defs>

                {/* Line 1: Context -> LLM */}
                <line
                    x1={centerX} y1={contextBottomY} x2={centerX} y2={llmTopY}
                    stroke="var(--color-accent)"
                    strokeWidth="2"
                    strokeDasharray="5 5"
                    className="flow-line"
                    style={{
                        opacity: activeStep === 1 ? 1 : 0.2,
                        transition: 'opacity 0.3s'
                    }}
                />

                {/* Line 2: LLM -> Tools */}
                <line
                    x1={centerX} y1={llmBottomY} x2={centerX} y2={toolsTopY}
                    stroke="var(--color-accent)"
                    strokeWidth="2"
                    strokeDasharray="5 5"
                    className="flow-line"
                    style={{
                        opacity: activeStep === 2 ? 1 : 0.2,
                        transition: 'opacity 0.3s'
                    }}
                />

                {/* Line 3: Loop (Tools Side -> Context Side) */}
                <path
                    d={`M ${boxLeftX} ${loopStartY}
             L ${boxLeftX - 40} ${loopStartY}
             L ${boxLeftX - 40} ${loopEndY}
             L ${boxLeftX} ${loopEndY}`}
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth="2"
                    strokeDasharray="5 5"
                    className="flow-line"
                    style={{
                        opacity: activeStep === 3 ? 1 : 0.2,
                        transition: 'opacity 0.3s'
                    }}
                />
            </svg>

            {/* LABELS */}

            {/* "decides what to do" */}
            <div style={{
                position: 'absolute',
                top: `${(llmBottomY + toolsTopY) / 2}px`,
                left: `${centerX + 20}px`,
                transform: 'translateY(-50%)',
                ...labelStyle,
                opacity: activeStep === 2 ? 1 : 0,
            }}>
                decides what to do
            </div>

            {/* "add result to context" */}
            <div style={{
                position: 'absolute',
                left: `${boxLeftX - 100}px`,
                top: `${(loopStartY + loopEndY) / 2}px`,
                transform: 'translateY(-50%) rotate(-90deg)',
                ...labelStyle,
                opacity: activeStep === 3 ? 1 : 0,
            }}>
                add result to context
            </div>

            {/* "repeat until done" */}
            <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                ...labelStyle,
                opacity: 1,
            }}>
                <div style={{ fontSize: '1rem' }}>↺</div>
                repeat until done
            </div>

            {/* BOXES */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                zIndex: 1,
            }}>
                {/* Context Box */}
                <div style={{
                    background: 'var(--color-surface)',
                    border: `1px solid ${activeStep === 0 ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-card)',
                    padding: '1rem',
                    width: `${boxWidth}px`,
                    height: `${contextHeight}px`,
                    transition: 'border-color 0.3s',
                    marginBottom: `${gap1}px`,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div className="text-muted" style={{ fontSize: '0.7rem', marginBottom: '0.5rem', fontWeight: 600 }}>Context</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {['System Instructions', 'Tools Definitions'].map((item) => (
                            <div key={item} style={chipStyle}>
                                {item}
                            </div>
                        ))}

                        <div
                            style={{
                                ...chipStyle,
                                opacity: showUserMessage || activeStep === 0 ? 1 : 0.3,
                                transition: 'opacity 0.5s',
                            }}
                        >
                            User Message
                        </div>

                        <div
                            style={{
                                ...chipStyle,
                                opacity: showToolResult ? 1 : 0,
                                transition: 'opacity 0.5s',
                            }}
                        >
                            Tool Result
                        </div>
                    </div>
                </div>

                {/* LLM Box */}
                <div style={{
                    background: 'var(--color-surface)',
                    border: `1px solid ${activeStep === 1 ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-card)',
                    padding: '1rem 2.5rem',
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: 'var(--color-text-primary)',
                    transition: 'border-color 0.3s',
                    marginBottom: `${gap2}px`,
                    zIndex: 2,
                    minWidth: '140px',
                    textAlign: 'center',
                }}>
                    LLM
                </div>

                {/* Tools Box */}
                <div style={{
                    background: 'var(--color-surface)',
                    border: `1px solid ${activeStep === 2 ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-card)',
                    padding: '1rem 1.25rem',
                    transition: 'border-color 0.3s',
                    width: `${boxWidth}px`,
                    zIndex: 2
                }}>
                    <div className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>Tools</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {tools.map((tool, i) => {
                            const active = activeStep === 2 && activeTool === i;
                            return (
                                <div
                                    key={tool}
                                    className="font-mono"
                                    style={{
                                        background: active ? 'var(--color-accent)' : 'var(--color-subtle)',
                                        color: active ? '#ffffff' : 'var(--color-text-secondary)',
                                        border: `1px solid ${active ? 'var(--color-accent)' : 'var(--color-border)'}`,
                                        padding: '0.45rem 0.75rem',
                                        borderRadius: 'var(--radius-input)',
                                        fontSize: '0.8rem',
                                        fontWeight: 500,
                                        letterSpacing: '0',
                                        transition: 'background-color 0.3s, color 0.3s, border-color 0.3s',
                                    }}
                                >
                                    {tool}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
