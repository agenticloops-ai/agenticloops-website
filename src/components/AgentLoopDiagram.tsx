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
    const contextColors = ['#60a5fa', '#34d399', '#fbbf24', '#c084fc'];

    const labelStyle = {
        fontSize: '0.75rem',
        color: 'var(--color-text-muted)',
        fontWeight: 500,
        fontFamily: 'var(--font-mono)',
        zIndex: 1,
        whiteSpace: 'nowrap' as const,
        transition: 'opacity 0.3s',
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
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>

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
            `}
                    </style>
                </defs>

                {/* Line 1: Context -> LLM */}
                <line
                    x1={centerX} y1={contextBottomY} x2={centerX} y2={llmTopY}
                    stroke="#8b5cf6"
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
                    stroke="#8b5cf6"
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
                    stroke="#8b5cf6"
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
                color: 'var(--color-accent-violet)',
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
                color: 'var(--color-accent-violet)',
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
                    background: 'var(--color-bg-card-solid)',
                    border: `2px solid ${activeStep === 0 ? 'var(--color-accent-blue)' : 'var(--color-border)'}`,
                    borderRadius: '12px',
                    padding: '1rem',
                    width: `${boxWidth}px`,
                    height: `${contextHeight}px`,
                    transition: 'all 0.3s',
                    boxShadow: activeStep === 0 ? '0 0 20px rgba(59, 130, 246, 0.2)' : 'var(--shadow-sm)',
                    marginBottom: `${gap1}px`,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div className="text-muted" style={{ fontSize: '0.7rem', marginBottom: '0.5rem', fontWeight: 600 }}>Context</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {['System Instructions', 'Tools Definitions'].map((item, i) => (
                            <div
                                key={item}
                                style={{
                                    background: contextColors[i],
                                    color: 'white',
                                    padding: '0.35rem 0.75rem',
                                    borderRadius: '6px',
                                    fontSize: '0.7rem',
                                    fontWeight: 500,
                                }}
                            >
                                {item}
                            </div>
                        ))}

                        <div
                            style={{
                                background: contextColors[2],
                                color: 'white',
                                padding: '0.35rem 0.75rem',
                                borderRadius: '6px',
                                fontSize: '0.7rem',
                                fontWeight: 500,
                                opacity: showUserMessage || activeStep === 0 ? 1 : 0.3,
                                transition: 'opacity 0.5s',
                            }}
                        >
                            User Message
                        </div>

                        <div
                            style={{
                                background: contextColors[3],
                                color: 'white',
                                padding: '0.35rem 0.75rem',
                                borderRadius: '6px',
                                fontSize: '0.7rem',
                                fontWeight: 500,
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
                    background: activeStep === 1 ? 'linear-gradient(135deg, #fef3c7, #fde68a)' : 'linear-gradient(135deg, #fef9c3, #fef08a)',
                    border: `2px solid ${activeStep === 1 ? '#f59e0b' : '#fcd34d'}`,
                    borderRadius: '12px',
                    padding: '1rem 2.5rem',
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: '#78350f',
                    transition: 'all 0.3s',
                    boxShadow: activeStep === 1 ? '0 0 20px rgba(245, 158, 11, 0.3)' : 'var(--shadow-sm)',
                    marginBottom: `${gap2}px`,
                    zIndex: 2,
                    minWidth: '140px',
                    textAlign: 'center',
                }}>
                    LLM
                </div>

                {/* Tools Box */}
                <div style={{
                    background: activeStep === 2 ? 'linear-gradient(135deg, #ede9fe, #ddd6fe)' : 'linear-gradient(135deg, #f3e8ff, #e9d5ff)',
                    border: `2px solid ${activeStep === 2 ? '#8b5cf6' : '#c4b5fd'}`,
                    borderRadius: '12px',
                    padding: '1rem 1.25rem',
                    transition: 'all 0.3s',
                    boxShadow: activeStep === 2 ? '0 0 20px rgba(139, 92, 246, 0.3)' : 'var(--shadow-sm)',
                    width: `${boxWidth}px`,
                    zIndex: 2
                }}>
                    <div style={{ fontSize: '0.75rem', color: '#5b21b6', marginBottom: '0.5rem', fontWeight: 700 }}>Tools</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {tools.map((tool, i) => (
                            <div
                                key={tool}
                                className="font-mono"
                                style={{
                                    background: activeStep === 2 && activeTool === i ? '#7c3aed' : 'rgba(91, 33, 182, 0.2)',
                                    color: activeStep === 2 && activeTool === i ? 'white' : '#3b0764',
                                    padding: '0.45rem 0.75rem',
                                    borderRadius: '6px',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.02em',
                                    transition: 'all 0.3s',
                                }}
                            >
                                {tool}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
