import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

const tabs = [
    {
        id: 'learning-path',
        label: 'Learning Path',
        title: 'Learning Path',
        description: 'Learning design patterns, create architecture for software engineers building autonomous AI systems.',
        href: 'learn',
        cta: 'Explore',
    },
    {
        id: 'tutorials',
        label: 'Tutorials',
        title: 'Tutorials',
        description: 'Watching tutorials, live productions, live coding and continuous the production-grade implementations documentation.',
        href: 'tutorials',
        cta: 'Start',
    },
    {
        id: 'patterns',
        label: 'Patterns',
        title: 'Patterns',
        description: 'Provides more production-grade information for software engineers building autonomous AI systems.',
        href: 'patterns',
        cta: 'Browse',
    },
];

export function ThreeWaysIn() {
    const baseUrl = import.meta.env.BASE_URL || '';
    const [activeTab, setActiveTab] = useState(0);

    return (
        <section className="section relative overflow-hidden" id="three-ways-in" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
            <div className="container">
                <ScrollReveal>
                    <div className="text-center mb-10">
                        <h2 className="mb-2 text-xl">Three ways in</h2>
                    </div>
                </ScrollReveal>

                <ScrollReveal delay={0.1}>
                    <div className="max-w-[800px] mx-auto">
                        {/* Tab bar */}
                        <div className="flex border border-border rounded-lg overflow-hidden mb-0" style={{ background: 'var(--color-bg-secondary)' }}>
                            {tabs.map((tab, i) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(i)}
                                    className={`flex-1 py-3 px-4 text-sm font-medium transition-colors border-none cursor-pointer ${
                                        activeTab === i
                                            ? 'text-text-primary'
                                            : 'text-text-muted hover:text-text-secondary'
                                    }`}
                                    style={{
                                        background: activeTab === i ? 'var(--color-accent-primary)' : 'transparent',
                                        color: activeTab === i ? '#ffffff' : undefined,
                                    }}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab content */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                            {tabs.map((tab, i) => {
                                return (
                                    <a
                                        key={tab.id}
                                        href={`${baseUrl}${tab.href}`}
                                        className={`card p-5 no-underline text-inherit group block ${
                                            activeTab === i ? 'border-accent-cyan' : ''
                                        }`}
                                        style={activeTab === i ? { borderColor: 'var(--color-accent-primary)' } : {}}
                                        onMouseEnter={() => setActiveTab(i)}
                                    >
                                        <h3 className="text-sm font-semibold mb-2 text-text-primary">{tab.title}</h3>
                                        <p className="text-xs text-text-secondary leading-relaxed m-0 mb-3">
                                            {tab.description}
                                        </p>
                                        <span className="link-action text-xs">
                                            {tab.cta} <ArrowRight size={12} />
                                        </span>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
