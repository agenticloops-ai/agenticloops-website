import { ArrowRight, Mail, MessageSquare } from 'lucide-react';
import { config } from '../config';
import { ScrollReveal } from './ScrollReveal';

export function Subscribe() {
    return (
        <section className="section relative overflow-hidden" id="subscribe">
            <div className="gradient-blur gradient-blur-blue absolute bottom-20 -right-[5%] opacity-10"></div>

            <div className="container">
                <ScrollReveal>
                    <div className="card max-w-[800px] mx-auto text-center p-10 md:p-14">
                        <div className="icon-box w-12 h-12 mx-auto mb-6">
                            <Mail size={22} />
                        </div>

                        <h2 className="mb-4">
                            Stay in the Loop
                        </h2>
                        <p className="text-text-secondary mb-8 max-w-[480px] mx-auto">
                            {config.content.subscribeText}
                        </p>

                        <div className="flex justify-center gap-3 flex-wrap">
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
                                <MessageSquare size={16} />
                                Join Discussion
                            </a>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
