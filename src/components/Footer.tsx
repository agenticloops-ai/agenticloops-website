import { socialIconsMap } from './SocialIcons';
import { config } from '../config';

export function Footer() {
    return (
        <footer className="border-t border-border py-16 px-6" style={{ background: 'var(--color-bg-secondary)' }}>
            <div className="container max-w-[600px] mx-auto text-center">
                <h2 className="mb-3 text-text-primary">Stay in the Loop</h2>
                <p className="text-base text-text-muted mb-6">Sign up to get early access to repos, patterns, and engineering deep-dives.</p>
                <div className="flex justify-center mb-10">
                    <a
                        href={config.links.substack}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary text-base px-8 py-3"
                    >
                        Subscribe
                    </a>
                </div>

                <div className="border-t border-border pt-6 flex justify-between items-center">
                    <p className="text-xs text-text-muted m-0">
                        &copy; {new Date().getFullYear()} {config.brand.name} · Built by engineers, for engineers
                    </p>
                    <div className="flex gap-3 items-center">
                        {config.social.map(({ id, label }) => {
                            const Icon = socialIconsMap[id];
                            const url = config.links[id as keyof typeof config.links];
                            if (!Icon || !url) return null;
                            return (
                                <a
                                    key={id}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="text-text-muted hover:text-text-primary transition-colors flex items-center"
                                >
                                    <Icon size={14} strokeWidth={2} />
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </footer>
    );
}
