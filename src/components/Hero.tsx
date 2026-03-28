import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { AgentLoopHorizontal } from './AgentLoopHorizontal';

const tabs = [
    {
        id: 'tutorials',
        label: 'Tutorials',
        title: 'Tutorials',
        description: 'Hands-on modules from basics to production — learn by building real agents.',
        href: 'tutorials',
        cta: 'Start',
    },
    {
        id: 'learning-path',
        label: 'Learning Path',
        title: 'Learning Path',
        description: 'Eight capability dimensions and personalized learning plans for your goal.',
        href: 'learn',
        cta: 'Explore',
    },
    {
        id: 'patterns',
        label: 'Patterns',
        title: 'Patterns',
        description: 'Battle-tested architecture patterns with diagrams, trade-offs, and code.',
        href: 'patterns',
        cta: 'Browse',
    },
];

export function Hero() {
    const baseUrl = import.meta.env.BASE_URL || '';
    const [activeTab, setActiveTab] = useState(0);

    return (
        <section className="section hero-section overflow-hidden relative" style={{ paddingTop: '5rem', paddingBottom: '2rem' }}>
            <div className="gradient-blur gradient-blur-blue absolute top-32 -right-[5%]"></div>
            <div className="gradient-blur gradient-blur-violet absolute -bottom-32 -left-[5%]"></div>

            <div className="container relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-8 lg:gap-10 items-center">

                    {/* Left: Content */}
                    <div>
                        <ScrollReveal direction="left">
                            <h1 className="mb-4">
                                Open-source learning<br />
                                for{' '}
                                <span className="gradient-text">agentic AI</span>
                                <br />
                                engineering.
                            </h1>
                        </ScrollReveal>

                        <ScrollReveal direction="left" delay={0.1}>
                            <p className="text-text-secondary mb-6 max-w-[480px] lead-text">
                                Design patterns, system architecture, and
                                production-grade implementations for software
                                engineers building autonomous AI systems.
                            </p>
                        </ScrollReveal>
                    </div>

                    {/* Right: Agent Loop Diagram */}
                    <ScrollReveal direction="right" delay={0.2}>
                        <div className="flex justify-center items-center">
                            <div className="relative p-4 border border-border rounded-xl" style={{
                                background: '#1e2a3a',
                                boxShadow: '0 0 60px rgba(6, 182, 212, 0.08), 0 0 120px rgba(139, 92, 246, 0.05)',
                            }}>
                                <div className="relative">
                                    <AgentLoopHorizontal />
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>

                {/* Three Ways In — integrated below */}
                <ScrollReveal delay={0.3}>
                    <div className="mt-10 pt-8 border-t border-border">
                        <h2 className="text-center text-lg font-semibold mb-4">Three ways in</h2>

                        {/* Tab bar */}
                        <div className="mx-auto mb-4">
                            <div className="flex border border-border rounded-lg overflow-hidden" style={{ background: 'var(--color-bg-secondary)' }}>
                                {tabs.map((tab, i) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(i)}
                                        className={`flex-1 py-2.5 px-3 text-sm font-medium transition-colors border-none cursor-pointer`}
                                        style={{
                                            background: activeTab === i ? 'var(--color-accent-primary)' : 'transparent',
                                            color: activeTab === i ? '#ffffff' : 'var(--color-text-muted)',
                                        }}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tab content cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mx-auto">
                            {tabs.map((tab, i) => (
                                <a
                                    key={tab.id}
                                    href={`${baseUrl}${tab.href}`}
                                    className="card p-4 no-underline text-inherit group block"
                                    style={activeTab === i ? { borderColor: 'var(--color-accent-primary)' } : {}}
                                    onMouseEnter={() => setActiveTab(i)}
                                >
                                    <h3 className="text-sm font-semibold mb-1.5 text-text-primary">{tab.title}</h3>
                                    <p className="text-xs text-text-secondary leading-relaxed m-0 mb-2">{tab.description}</p>
                                    <span className="link-action text-xs">
                                        {tab.cta} <ArrowRight size={11} />
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
