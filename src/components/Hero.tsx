import { ArrowRight, ChevronDown } from 'lucide-react';
import { config } from '../config';
import { ScrollReveal } from './ScrollReveal';
import { AgentLoopDiagram } from './AgentLoopDiagram';

export function Hero() {
    const baseUrl = import.meta.env.BASE_URL || '';

    return (
        <section className="section hero-section min-h-screen flex items-center overflow-hidden relative">
            <div className="gradient-blur gradient-blur-blue absolute top-32 -right-[5%]"></div>
            <div className="gradient-blur gradient-blur-violet absolute -bottom-32 -left-[5%]"></div>

            <div className="container relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-20 items-center">

                    {/* Left: Content */}
                    <div>
                        <ScrollReveal direction="left">
                            <div className="mb-8 flex flex-wrap gap-3 items-center">
                                <span className="badge">
                                    open source
                                </span>
                                <span className="badge">
                                    production-grade
                                </span>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal direction="left" delay={0.1}>
                            <h1 className="mb-6">
                                Open-source learning for{' '}
                                <span className="gradient-text">agentic AI</span>{' '}
                                engineering.
                            </h1>
                        </ScrollReveal>

                        <ScrollReveal direction="left" delay={0.2}>
                            <p className="lead-text mb-10 max-w-[540px]">
                                {config.content.heroSubheadline}
                            </p>
                        </ScrollReveal>

                        <ScrollReveal direction="left" delay={0.3}>
                            <div className="flex flex-wrap gap-3">
                                <a
                                    href={`${baseUrl}learn`}
                                    className="btn-primary"
                                >
                                    Start Learning
                                    <ArrowRight size={16} />
                                </a>
                                <a
                                    href={`${baseUrl}patterns`}
                                    className="btn-secondary"
                                >
                                    Browse Patterns
                                </a>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Right: Agent Loop Diagram */}
                    <ScrollReveal direction="right" delay={0.2}>
                        <div className="flex justify-center items-center">
                            <div className="relative p-4 lg:p-6 border border-border rounded-xl bg-bg-card origin-top scale-[0.75] sm:scale-[0.85] lg:scale-100">
                                <AgentLoopDiagram />
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>

            {/* Scroll Indicator */}
            <a
                href="#beliefs"
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted hover:text-text-primary transition-colors no-underline"
                aria-label="Scroll to content"
            >
                <ChevronDown size={20} className="animate-bounce-slow" />
            </a>
        </section>
    );
}
