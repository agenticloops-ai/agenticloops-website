import { ScrollReveal } from './ScrollReveal';

export function About() {
    return (
        <section className="section relative overflow-hidden" id="principles">
            {/* Background Gradient Blurs */}
            <div className="gradient-blur gradient-blur-violet absolute -top-32 -left-[5%] opacity-15"></div>
            <div className="gradient-blur gradient-blur-blue absolute -bottom-32 -right-[5%] opacity-15"></div>

            {/* Section Header Accent */}
            <div
                className="absolute top-0 left-0 w-[300px] h-1 shadow-[0_0_20px_var(--color-accent-cyan)]"
                style={{ background: 'var(--color-accent-gradient)' }}
            ></div>

            <div className="container">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <ScrollReveal direction="left">
                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <span className="badge">principles</span>
                            </div>

                            <h2 className="mb-8 relative">
                                <div className="absolute -left-6 top-0 w-1.5 h-full bg-accent-amber shadow-[0_0_15px_var(--color-accent-amber)]"></div>
                                Our <span className="gradient-text">Beliefs</span>
                            </h2>

                            <p className="font-display text-xl mb-6 text-text-primary uppercase tracking-wide leading-tight">
                                Building AI agents is engineering, not magic.
                            </p>

                            <p className="body-text mb-5">
                                AI agents are <strong>changing how we build software</strong>, and the full impact is still hard to measure. But one thing is clear — <strong>this technology is not going away</strong>.
                            </p>

                            <p className="body-text mb-5">
                                We should <strong>adapt</strong> instead of saying “it’s not ready yet.” If we wait until everything is stable, we may <strong>lose time and fall behind</strong> engineers who already learned how to use it well.
                            </p>

                            <p className="body-text mb-5">
                                The good news is that <strong>building agents is still engineering</strong>. LLMs can help a lot, but they can also be wrong and hard to trust. To make an agent useful, we need <strong>clear contracts, error handling, logging/tracing, tests, and security.</strong>
                            </p>

                            <p className="body-text font-medium">
                                This community is for <strong>engineers who want to learn by building</strong>. We are learning and sharing experiments, reference projects, and <strong>practical patterns</strong> that make agents more reliable and easier to maintain. We focus on simple, repeatable methods - not magic prompts or blind trust. If you want to <strong>understand how agents work</strong> and run them safely in real systems, you're in the right place.
                            </p>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal direction="right" delay={0.1}>
                        <div className="relative">
                            <div className="code-block relative">
                                {/* Terminal Header Bar */}
                                <div className="absolute top-0 left-0 right-0 h-10 bg-accent-cyan/10 border-b-2 border-accent-cyan flex items-center justify-between px-4">
                                    <div className="label text-accent-cyan font-bold">
                                        MANIFESTO.json
                                    </div>
                                </div>
                                <div className="pt-[50px]"></div>
                                <pre>
                                    {`{`}
                                    {'\n'}  <span className="property">"belief"</span>: <span className="string">"Engineering {'>'} hype"</span>,
                                    {'\n'}  <span className="property">"focus"</span>: [
                                    {'\n'}    <span className="string">"Production readiness"</span>,
                                    {'\n'}    <span className="string">"Predictable behavior"</span>,
                                    {'\n'}    <span className="string">"Traceability and auditability"</span>,
                                    {'\n'}    <span className="string">"Reusable patterns"</span>,
                                    {'\n'}    <span className="string">"Failure handling and recovery"</span>
                                    {'\n'}  ],
                                    {'\n'}  <span className="property">"anti_patterns"</span>: [
                                    {'\n'}    <span className="string">"Black-box decisions"</span>,
                                    {'\n'}    <span className="string">"Prompt-only reliability"</span>,
                                    {'\n'}    <span className="string">"Hidden state and surprises"</span>,
                                    {'\n'}    <span className="string">"Autonomy without control"</span>,
                                    {'\n'}    <span className="string">"Systems you can't debug"</span>
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

