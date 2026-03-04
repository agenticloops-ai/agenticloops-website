import { ScrollReveal } from './ScrollReveal';

export function About() {
    return (
        <section className="section relative overflow-hidden" id="beliefs">
            <div className="gradient-blur gradient-blur-violet absolute -top-32 -left-[5%] opacity-10"></div>

            <div className="container">
                <ScrollReveal>
                    <div className="text-center mb-16">
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="w-10 h-0.5" style={{ background: 'var(--color-accent-primary)' }}></div>
                            <span className="badge">what we believe</span>
                            <div className="w-10 h-0.5" style={{ background: 'var(--color-accent-primary)' }}></div>
                        </div>

                        <h2 className="mb-4">
                            Building AI agents is engineering, not magic.
                        </h2>
                        <p className="body-text max-w-[600px] mx-auto">
                            LLMs are powerful, but on their own they're unpredictable and fragile. We treat agents as software systems, not black boxes.
                        </p>
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[900px] mx-auto">
                    {[
                        {
                            num: '01',
                            title: 'First principles over frameworks',
                            desc: 'Frameworks come and go. Context limits, statelessness, and hallucination don\'t. Master the constraints, not the hype.',
                        },
                        {
                            num: '02',
                            title: 'Design for non-determinism',
                            desc: 'Traditional software gives you guarantees. LLMs don\'t. Architect for the uncertainty, don\'t pretend it away.',
                        },
                        {
                            num: '03',
                            title: 'Master the trade-offs',
                            desc: 'Autonomy vs control, flexibility vs predictability, speed vs safety — every decision demands deep understanding of the constraints underneath.',
                        },
                        {
                            num: '04',
                            title: 'Learn by building',
                            desc: 'Reference implementations, battle-tested patterns, and first-principles thinking. No magic prompts. No black boxes. Just engineering.',
                        },
                    ].map((tenet, i) => (
                        <ScrollReveal key={tenet.num} direction="up" delay={i * 0.08}>
                            <div className="card h-full p-6">
                                <div className="text-xs font-mono text-text-muted mb-3">{tenet.num}</div>
                                <h3 className="text-base font-semibold mb-3 text-text-primary">{tenet.title}</h3>
                                <p className="text-sm text-text-secondary leading-relaxed m-0">{tenet.desc}</p>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
