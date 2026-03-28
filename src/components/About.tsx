import { ScrollReveal } from './ScrollReveal';

export function About() {
    return (
        <section className="section relative overflow-hidden" id="beliefs">
            <div className="gradient-blur gradient-blur-violet absolute -top-32 -left-[5%] opacity-10"></div>

            <div className="container">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch">
                    <ScrollReveal direction="left">
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <span className="badge">tenets</span>
                            </div>

                            <h2 className="mb-6">
                                Our <span className="gradient-text">Beliefs</span>
                            </h2>

                            <p className="text-text-secondary mb-8 leading-relaxed" style={{ fontSize: '0.95rem' }}>
                                LLMs are powerful, but on their own they're unpredictable and fragile. Building reliable agents takes real engineering — constraints, failure handling, testing, and clear system boundaries. We treat agents as software systems, not black boxes.
                            </p>

                            <div className="space-y-6">
                                {[
                                    {
                                        num: '01',
                                        title: 'FIRST PRINCIPLES OVER FRAMEWORKS',
                                        desc: 'Frameworks come and go. Context limits, statelessness, and hallucination don\'t. Master the constraints, not the hype.',
                                    },
                                    {
                                        num: '02',
                                        title: 'DESIGN FOR NON-DETERMINISM',
                                        desc: 'Traditional software gives you guarantees. LLMs don\'t. Architect for the uncertainty, don\'t pretend it away.',
                                    },
                                    {
                                        num: '03',
                                        title: 'MASTER THE TRADE-OFFS',
                                        desc: 'Writing code has never been easier. Making the right architectural trade-off has never been harder. Autonomy vs control, flexibility vs predictability, speed vs safety — every decision demands deep understanding of the constraints underneath.',
                                    },
                                    {
                                        num: '04',
                                        title: 'LEARN BY BUILDING',
                                        desc: 'Reference implementations, battle-tested patterns, and first-principles thinking. No magic prompts. No black boxes. Just engineering.',
                                    },
                                ].map((tenet) => (
                                    <div key={tenet.num}>
                                        <p className="text-text-primary mb-1" style={{ fontSize: '0.95rem' }}>
                                            <span className="font-bold">{tenet.num}. {tenet.title}</span>
                                            {' — '}
                                            <span className="text-text-secondary">{tenet.desc}</span>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal direction="right" delay={0.2}>
                        <div className="code-block h-full flex flex-col">
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60"></div>
                                <span className="text-[0.65rem] font-mono text-text-muted ml-2">tenets.json</span>
                            </div>
                            <pre style={{ fontSize: '0.8rem', lineHeight: '1.7' }}><code>{`{\n`}  <span className="property">"belief"</span>: <span className="string">"engineering {'>'} hype"</span>,{`\n`}  <span className="property">"approach"</span>: <span className="string">"first_principle_thinking"</span>,{`\n`}  <span className="property">"determinism"</span>: <span className="keyword">false</span>,{`\n`}  <span className="property">"accept_constraints"</span>: <span className="keyword">true</span>,{`\n`}  <span className="property">"constraints"</span>: [{`\n`}    <span className="string-warn">"context_limits"</span>,{`\n`}    <span className="string-warn">"stateless_inference"</span>,{`\n`}    <span className="string-warn">"hallucination"</span>,{`\n`}    <span className="string-warn">"no_native_memory"</span>,{`\n`}    <span className="string-warn">"prompt_injection"</span>{`\n`}  ],{`\n`}  <span className="property">"require"</span>: [{`\n`}    <span className="string-require">"context_engineering"</span>,{`\n`}    <span className="string-require">"tool_engineering"</span>,{`\n`}    <span className="string-require">"reusable_patterns"</span>,{`\n`}    <span className="string-require">"security_as_first_class_citizen"</span>,{`\n`}    <span className="string-require">"deliberate_trade_offs"</span>,{`\n`}    <span className="string-require">"traceability_and_auditability"</span>{`\n`}  ],{`\n`}  <span className="property">"reject"</span>: [{`\n`}    <span className="string-reject">"prompt_and_pray"</span>,{`\n`}    <span className="string-reject">"demo_driven_design"</span>,{`\n`}    <span className="string-reject">"unverifiable_autonomy"</span>,{`\n`}    <span className="string-reject">"trust_by_default"</span>{`\n`}  ]{`\n}`}</code></pre>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
}
