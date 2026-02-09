import { ScrollReveal } from './ScrollReveal';

export function About() {
    return (
        <section className="section relative overflow-hidden" id="tenets">
            {/* Background Gradient Blurs */}
            <div className="gradient-blur gradient-blur-violet absolute -top-32 -left-[5%] opacity-15"></div>
            <div className="gradient-blur gradient-blur-blue absolute -bottom-32 -right-[5%] opacity-15"></div>

            {/* Section Header Accent */}
            <div
                className="absolute top-0 left-0 w-[300px] h-1 shadow-[0_0_20px_var(--color-accent-cyan)]"
                style={{ background: 'var(--color-accent-gradient)' }}
            ></div>

            <div className="container">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                    <ScrollReveal direction="left">
                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <span className="badge">tenets</span>
                            </div>

                            <h2 className="mb-8 relative">
                                <div className="absolute -left-6 top-0 w-1.5 h-full bg-accent-amber shadow-[0_0_15px_var(--color-accent-amber)]"></div>
                                Our <span className="gradient-text">Beliefs</span>
                            </h2>

                            <p className="font-display text-xl mb-6 text-text-primary uppercase tracking-wide leading-tight">
                                Building AI agents is engineering, not magic.
                            </p>

                            <p className="body-text mb-8">
                                You can't unit test intuition. LLMs don't give you guarantees — the same input can trigger different tools, different reasoning, different outcomes. Reliable agents aren't prompted into existence. They're engineered.
                            </p>

                            <div className="flex flex-col gap-5">
                                <div>
                                    <span className="font-display text-base text-text-primary uppercase tracking-wide font-bold">01. First principles over frameworks</span>
                                    <span className="body-text"> — Frameworks come and go. Context limits, statelessness, and hallucination don't. Master the constraints, not the hype.</span>
                                </div>
                                <div>
                                    <span className="font-display text-base text-text-primary uppercase tracking-wide font-bold">02. Design for non-determinism</span>
                                    <span className="body-text"> — Traditional software gives you guarantees. LLMs don't. Architect for the uncertainty, don't pretend it away.</span>
                                </div>
                                <div>
                                    <span className="font-display text-base text-text-primary uppercase tracking-wide font-bold">03. Trade-offs are the job</span>
                                    <span className="body-text"> — Writing code has never been easier. Making the right architectural trade-off has never been harder. Autonomy vs control, flexibility vs predictability, speed vs safety — every decision demands deep understanding of the constraints underneath.</span>
                                </div>
                                <div>
                                    <span className="font-display text-base text-text-primary uppercase tracking-wide font-bold">04. Learn by building</span>
                                    <span className="body-text"> — Reference implementations, battle-tested patterns, and first-principles thinking. No magic prompts. No black boxes. Just engineering.</span>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal direction="right" delay={0.1}>
                        <div className="relative lg:mt-[4.5rem]">
                            <div className="code-block relative">
                                {/* Terminal Header Bar */}
                                <div className="absolute top-0 left-0 right-0 h-10 bg-accent-cyan/10 border-b-2 border-accent-cyan flex items-center justify-between px-4">
                                    <div className="label text-accent-cyan font-bold">
                                        TENETS.json
                                    </div>
                                </div>
                                <div className="pt-[50px]"></div>
                                <pre>
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

                            {/* Decorative Technical Corner */}
                            <div
                                className="absolute -bottom-2.5 -right-2.5 w-[60px] h-[60px] border-r-2 border-b-2 border-accent-amber opacity-40"
                            ></div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
}

