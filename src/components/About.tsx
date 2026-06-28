import { ScrollReveal } from './ScrollReveal';

export function About() {
    return (
        <section className="section section-alt relative overflow-hidden" id="tenets">
            <div className="container">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                    <ScrollReveal direction="left">
                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <span className="badge">tenets</span>
                            </div>

                            <h2 className="mb-8 border-l-[3px] border-accent pl-5">
                                Our <span className="gradient-text">Beliefs</span>
                            </h2>

                            <p className="font-display text-xl mb-6 text-text-primary leading-snug">
                                Building AI agents is engineering, not magic.
                            </p>

                            <p className="body-text mb-8">
                                LLMs are powerful, but on their own they're unpredictable and fragile. Building reliable agents takes real engineering — constraints, failure handling, testing, and clear system boundaries. We treat agents as software systems, not black boxes.
                            </p>

                            <div className="flex flex-col gap-5">
                                <div>
                                    <span className="font-display text-base text-text-primary font-semibold">01. First principles over frameworks</span>
                                    <span className="body-text"> — Frameworks come and go. Context limits, statelessness, and hallucination don't. Master the constraints, not the hype.</span>
                                </div>
                                <div>
                                    <span className="font-display text-base text-text-primary font-semibold">02. Design for non-determinism</span>
                                    <span className="body-text"> — Traditional software gives you guarantees. LLMs don't. Architect for the uncertainty, don't pretend it away.</span>
                                </div>
                                <div>
                                    <span className="font-display text-base text-text-primary font-semibold">03. Master the trade-offs</span>
                                    <span className="body-text"> — Writing code has never been easier. Making the right architectural trade-off has never been harder. Autonomy vs control, flexibility vs predictability, speed vs safety — every decision demands deep understanding of the constraints underneath.</span>
                                </div>
                                <div>
                                    <span className="font-display text-base text-text-primary font-semibold">04. Learn by building</span>
                                    <span className="body-text"> — Reference implementations, battle-tested patterns, and first-principles thinking. No magic prompts. No black boxes. Just engineering.</span>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal direction="right" delay={0.1}>
                        <div className="relative lg:mt-[4.5rem]">
                            <div className="code-block relative !p-0">
                                {/* File header bar */}
                                <div className="h-10 bg-subtle border-b border-border flex items-center px-4 rounded-t-card">
                                    <div className="label">tenets.json</div>
                                </div>
                                <pre className="p-5">
                                    {`{`}
                                    {'\n'}  <span className="property">"belief"</span>: <span className="string">"engineering {'>'} hype"</span>,
                                    {'\n'}  <span className="property">"approach"</span>: <span className="string">"first_principle_thinking"</span>,
                                    {'\n'}  <span className="property">"determinism"</span>: <span className="keyword">false</span>,
                                    {'\n'}  <span className="property">"accept_constraints"</span>: <span className="keyword">true</span>,
                                    {'\n'}  <span className="property">"constraints"</span>: [
                                    {'\n'}    <span className="string-warn">"context_limits"</span>,
                                    {'\n'}    <span className="string-warn">"stateless_inference"</span>,
                                    {'\n'}    <span className="string-warn">"hallucination"</span>,
                                    {'\n'}    <span className="string-warn">"no_native_memory"</span>,
                                    {'\n'}    <span className="string-warn">"prompt_injection"</span>
                                    {'\n'}  ],
                                    {'\n'}  <span className="property">"require"</span>: [
                                    {'\n'}    <span className="string-require">"context_engineering"</span>,
                                    {'\n'}    <span className="string-require">"tool_engineering"</span>,
                                    {'\n'}    <span className="string-require">"reusable_patterns"</span>,
                                    {'\n'}    <span className="string-require">"security_as_first_class_citizen"</span>,
                                    {'\n'}    <span className="string-require">"deliberate_trade_offs"</span>,
                                    {'\n'}    <span className="string-require">"traceability_and_auditability"</span>
                                    {'\n'}  ],
                                    {'\n'}  <span className="property">"reject"</span>: [
                                    {'\n'}    <span className="string-reject">"prompt_and_pray"</span>,
                                    {'\n'}    <span className="string-reject">"demo_driven_design"</span>,
                                    {'\n'}    <span className="string-reject">"unverifiable_autonomy"</span>,
                                    {'\n'}    <span className="string-reject">"trust_by_default"</span>
                                    {'\n'}  ]
                                    {'\n'}{`}`}
                                </pre>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
}

