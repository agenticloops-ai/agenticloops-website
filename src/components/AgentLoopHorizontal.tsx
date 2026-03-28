import { useEffect, useState } from 'react';

export function AgentLoopHorizontal() {
    const [activeStep, setActiveStep] = useState(0);
    const [activeTool, setActiveTool] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep(prev => (prev + 1) % 4);
        }, 1800);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (activeStep === 2) {
            setActiveTool(prev => (prev + 1) % 3);
        }
    }, [activeStep]);

    const tools = ['web_search()', 'execute_code()', 'read_file()'];

    const w = 560;
    const h = 280;

    // Compact box sizes
    const ctxW = 170, ctxH = 140;
    const llmW = 100, llmH = 60;
    const toolW = 170, toolH = 140;

    // Positions
    const rowY = 55;
    const ctxX = 0;
    const llmX = ctxW + 30;
    const llmY = rowY + (ctxH - llmH) / 2;
    const toolX = llmX + llmW + 30;

    return (
        <div style={{ position: 'relative', width: `${w}px`, height: `${h}px` }}>
            {/* SVG arrows */}
            <svg style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none', zIndex: 3 }}>
                <defs>
                    <style>{`
                        .hflow { stroke-dasharray: 5 5; animation: hdash 1s linear infinite; }
                        @keyframes hdash { to { stroke-dashoffset: -10; } }
                    `}</style>
                    <marker id="ah" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
                        <polygon points="0 0, 6 2.5, 0 5" fill="#8b5cf6" />
                    </marker>
                    <marker id="ah-up" markerWidth="6" markerHeight="5" refX="2.5" refY="0" orient="-90">
                        <polygon points="0 0, 6 2.5, 0 5" fill="#8b5cf6" />
                    </marker>
                </defs>

                {/* Context → LLM */}
                <line
                    x1={ctxX + ctxW} y1={llmY + llmH / 2}
                    x2={llmX} y2={llmY + llmH / 2}
                    stroke="#8b5cf6" strokeWidth="2" className="hflow" markerEnd="url(#ah)"
                    style={{ opacity: activeStep === 1 ? 1 : 0.15, transition: 'opacity 0.3s' }}
                />

                {/* LLM → Tools */}
                <line
                    x1={llmX + llmW} y1={llmY + llmH / 2}
                    x2={toolX} y2={llmY + llmH / 2}
                    stroke="#8b5cf6" strokeWidth="2" className="hflow" markerEnd="url(#ah)"
                    style={{ opacity: activeStep === 2 ? 1 : 0.15, transition: 'opacity 0.3s' }}
                />

                {/* Loop back: Tools bottom → Context bottom */}
                <path
                    d={`M ${toolX + toolW / 2} ${rowY + toolH}
                        L ${toolX + toolW / 2} ${rowY + toolH + 22}
                        L ${ctxX + ctxW / 2} ${rowY + toolH + 22}
                        L ${ctxX + ctxW / 2} ${rowY + ctxH}`}
                    fill="none" stroke="#8b5cf6" strokeWidth="2" className="hflow"
                    markerEnd="url(#ah-up)"
                    style={{ opacity: activeStep === 3 ? 1 : 0.15, transition: 'opacity 0.3s' }}
                />
            </svg>

            {/* "repeat until done" label */}
            <div style={{
                position: 'absolute',
                bottom: '0px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
                fontFamily: 'var(--font-mono)',
                display: 'flex', alignItems: 'center', gap: '0.3rem',
                opacity: activeStep === 3 ? 1 : 0.3,
                transition: 'opacity 0.3s',
            }}>
                <span style={{ fontSize: '0.8rem' }}>↺</span> repeat until done
            </div>

            {/* Step labels */}
            <div style={{ position: 'absolute', left: `${ctxX}px`, top: `${rowY - 28}px`, width: `${ctxW}px`, textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, lineHeight: '1.2', color: activeStep === 0 ? 'var(--color-accent-primary)' : 'var(--color-text-muted)', opacity: activeStep === 0 ? 1 : 0.3, transition: 'all 0.3s' }}>
                ① gather context
            </div>
            <div style={{ position: 'absolute', left: `${llmX}px`, top: `${llmY - 38}px`, width: `${llmW}px`, textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, lineHeight: '1.2', color: activeStep === 1 ? '#f59e0b' : 'var(--color-text-muted)', opacity: activeStep === 1 ? 1 : 0.3, transition: 'all 0.3s' }}>
                ② plan &<br />decide
            </div>
            <div style={{ position: 'absolute', left: `${toolX}px`, top: `${rowY - 28}px`, width: `${toolW}px`, textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, lineHeight: '1.2', color: activeStep === 2 ? '#8b5cf6' : 'var(--color-text-muted)', opacity: activeStep === 2 ? 1 : 0.3, transition: 'all 0.3s' }}>
                ③ execute tool
            </div>

            {/* Context Box */}
            <div style={{
                position: 'absolute', left: `${ctxX}px`, top: `${rowY}px`,
                width: `${ctxW}px`, height: `${ctxH}px`,
                background: 'var(--color-bg-card-solid)',
                border: `2px solid ${activeStep === 0 || activeStep === 3 ? 'var(--color-accent-primary)' : 'var(--color-border)'}`,
                borderRadius: '10px', padding: '0.6rem',
                transition: 'all 0.3s',
                boxShadow: 'none',
                display: 'flex', flexDirection: 'column', zIndex: 2,
            }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '0.3rem' }}>Context</div>
                {[
                    { label: 'System', color: '#3b82f6', show: true },
                    { label: 'Tools Def', color: '#34d399', show: true },
                    { label: 'User Msg', color: '#fbbf24', show: true },
                    { label: 'Tool Result', color: '#c084fc', show: activeStep === 3 || activeStep === 0 },
                ].map((item) => (
                    <div key={item.label} style={{
                        background: item.color, color: 'white',
                        padding: '0.2rem 0.4rem', borderRadius: '3px',
                        fontSize: '0.65rem', fontWeight: 500,
                        marginBottom: '0.15rem',
                        opacity: item.show ? 1 : 0.2,
                        transition: 'opacity 0.5s',
                    }}>{item.label}</div>
                ))}
            </div>

            {/* LLM Box — compact */}
            <div style={{
                position: 'absolute', left: `${llmX}px`, top: `${llmY}px`,
                width: `${llmW}px`, height: `${llmH}px`,
                background: activeStep === 1 ? '#fde68a' : '#fef9c3',
                border: `2px solid ${activeStep === 1 ? '#f59e0b' : '#fcd34d'}`,
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s',
                boxShadow: 'none',
                zIndex: 2,
            }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#78350f' }}>LLM</div>
            </div>

            {/* Tools Box */}
            <div style={{
                position: 'absolute', left: `${toolX}px`, top: `${rowY}px`,
                width: `${toolW}px`, height: `${toolH}px`,
                background: activeStep === 2 ? '#ddd6fe' : '#e9d5ff',
                border: `2px solid ${activeStep === 2 ? '#8b5cf6' : '#c4b5fd'}`,
                borderRadius: '10px', padding: '0.6rem',
                transition: 'all 0.3s',
                boxShadow: 'none',
                zIndex: 2,
            }}>
                <div style={{ fontSize: '0.55rem', color: '#5b21b6', marginBottom: '0.3rem', fontWeight: 700 }}>Tools</div>
                {tools.map((tool, i) => (
                    <div key={tool} className="font-mono" style={{
                        background: activeStep === 2 && activeTool === i ? '#7c3aed' : 'rgba(91, 33, 182, 0.12)',
                        color: activeStep === 2 && activeTool === i ? 'white' : '#3b0764',
                        padding: '0.2rem 0.4rem', borderRadius: '3px',
                        fontSize: '0.7rem', fontWeight: 600,
                        marginBottom: '0.15rem',
                        transition: 'all 0.3s',
                    }}>{tool}</div>
                ))}
            </div>
        </div>
    );
}
