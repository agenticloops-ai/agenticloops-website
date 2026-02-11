import { ArrowRight, Mail, MessageSquare } from 'lucide-react';
import { config } from '../config';
import { ScrollReveal } from './ScrollReveal';

export function Subscribe() {
    return (
        <section className="section relative overflow-hidden" id="subscribe">
            {/* Background Gradient Blurs */}
            <div className="gradient-blur gradient-blur-blue absolute bottom-20 -right-[5%] opacity-15"></div>
            <div className="gradient-blur gradient-blur-violet absolute -top-32 -left-[5%] opacity-15"></div>
            {/* Section Header Accent */}
            <div className="absolute top-0 left-0 w-[300px] h-1 shadow-[0_0_20px_var(--color-accent-cyan)]"
                style={{ background: 'var(--color-accent-gradient)' }}></div>

            <div className="container">
                <ScrollReveal>
                    <div className="card max-w-[900px] mx-auto text-center p-12 md:p-16 border-2 border-accent-cyan"
                        style={{
                            background: 'linear-gradient(135deg, var(--color-bg-card), var(--color-bg-card-solid))',
                            boxShadow: 'var(--shadow-lg), var(--shadow-glow)',
                            clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))',
                            borderColor: 'var(--color-accent-cyan)'
                        }}>
                        <div className="icon-box w-14 h-14 mx-auto mb-6 rounded-2xl">
                            <Mail size={26} />
                        </div>

                        <h2 className="mb-4">
                            Stay in the <span className="gradient-text">Loop</span>
                        </h2>
                        <p className="text-secondary mb-10 max-w-[500px] mx-auto text-lg">
                            {config.content.subscribeText}
                        </p>

                        <div className="flex justify-center gap-4 flex-wrap">
                            <a
                                href={config.links.substack}
                                className="btn-primary"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => {
                                    if (typeof window.gtag === 'function') {
                                        window.gtag('event', 'click_subscribe_main', {
                                            event_category: 'conversion',
                                            event_label: 'subscribe_main'
                                        });
                                    }
                                }}
                            >
                                Get Early Access <ArrowRight size={16} />
                            </a>
                            <a
                                href={config.links.discussions}
                                className="btn-secondary"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => {
                                    if (typeof window.gtag === 'function') {
                                        window.gtag('event', 'click_discussion_main', {
                                            event_category: 'engagement',
                                            event_label: 'discussion_main'
                                        });
                                    }
                                }}
                            >
                                <MessageSquare size={18} />
                                Join Discussion
                            </a>
                        </div>

                        <p className="text-muted mt-8 text-sm">
                            Engineering-first. Production-grade. No magic.
                        </p>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}

