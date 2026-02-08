import { BookOpen, ArrowRight } from 'lucide-react';
import { Github } from './BrandIcons';
import { config } from '../config';
import { ScrollReveal } from './ScrollReveal';
import { AgentLoopDiagram } from './AgentLoopDiagram';

export function Hero() {
    return (
        <section className="section min-h-screen flex items-center overflow-hidden relative">
            {/* Background Gradient Blurs */}
            <div className="gradient-blur gradient-blur-blue absolute top-32 -right-[5%]"></div>
            <div className="gradient-blur gradient-blur-violet absolute -bottom-32 -left-[5%]"></div>

            <div className="container relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-20 items-center">

                    {/* Left: Content */}
                    <div>
                        <ScrollReveal direction="left" delay={0.4}>
                            <div className="code-comment mb-4">
                                // TODO: Join growing community of engineers building AI agents
                            </div>
                        </ScrollReveal>

                        <ScrollReveal direction="left">
                            <div className="mb-10 flex flex-wrap gap-3 items-center">
                                <span className="badge">
                                    <span className="badge-dot"></span>
                                    code first
                                </span>
                                <span className="badge">
                                    no hype
                                </span>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal direction="left" delay={0.1}>
                            <h1 className="mb-8 relative inline-block">
                                <div className="absolute -top-5 -left-2.5 w-1 h-[120%] bg-gradient-to-b from-accent-cyan to-accent-teal shadow-[0_0_20px_var(--color-accent-cyan)]"></div>
                                <span className="gradient-text">Agentic</span><br />Loops
                            </h1>
                        </ScrollReveal>

                        <ScrollReveal direction="left" delay={0.2}>
                            <p className="lead-text mb-12 max-w-[600px]">
                                {config.content.heroSubheadline}
                            </p>
                        </ScrollReveal>

                        <ScrollReveal direction="left" delay={0.3}>
                            <div className="flex flex-wrap gap-4">
                                <a
                                    href={config.links.github}
                                    className="btn-primary"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => {
                                        if (typeof window.gtag === 'function') {
                                            window.gtag('event', 'click_hero_source', {
                                                event_category: 'engagement',
                                                event_label: 'hero_source_code'
                                            });
                                        }
                                    }}
                                >
                                    <Github size={20} />
                                    Source Code
                                    <ArrowRight size={18} />
                                </a>
                                <a
                                    href={config.links.substack}
                                    className="btn-secondary"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => {
                                        if (typeof window.gtag === 'function') {
                                            window.gtag('event', 'click_hero_blog', {
                                                event_category: 'engagement',
                                                event_label: 'hero_engineering_blog'
                                            });
                                        }
                                    }}
                                >
                                    <BookOpen size={20} />
                                    Engineering Blog
                                    <ArrowRight size={18} />
                                </a>
                            </div>
                        </ScrollReveal>

                    </div>

                    {/* Right: Agent Loop Diagram */}
                    <ScrollReveal direction="right" delay={0.2}>
                        <div className="hidden lg:flex justify-center items-center relative">
                            <div
                                className="absolute -top-5 -right-5 w-[100px] h-[100px] border-2 border-accent-cyan opacity-30"
                                style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}
                            ></div>
                            <div
                                className="relative p-8 border-2 border-border-accent bg-accent-cyan/[0.03]"
                                style={{
                                    clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
                                    boxShadow: 'var(--shadow-glow)'
                                }}
                            >
                                <AgentLoopDiagram />
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>


        </section>
    );
}