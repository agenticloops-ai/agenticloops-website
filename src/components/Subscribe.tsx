import { ArrowRight, Mail, MessageSquare } from 'lucide-react';
import { config } from '../config';
import { ScrollReveal } from './ScrollReveal';

export function Subscribe() {
    return (
        <section className="section" id="subscribe">
            <div className="container">
                <ScrollReveal>
                    <div className="card card-featured max-w-[900px] mx-auto text-center p-12 md:p-16">
                        <div className="icon-box w-14 h-14 mx-auto mb-6">
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

