import { socialIconsMap } from './SocialIcons';
import { config } from '../config';

export function Footer() {
    const baseUrl = import.meta.env.BASE_URL || '';

    return (
        <footer className="border-t border-border py-8 px-6 mt-auto" style={{ background: 'var(--color-bg-secondary)' }}>
            <div className="container max-w-[1200px] mx-auto">
                <div className="flex justify-between items-center flex-wrap gap-6">
                    <div className="flex flex-col gap-1">
                        <p className="text-xs text-text-muted m-0">
                            &copy; {new Date().getFullYear()} {config.brand.name}
                        </p>
                        <p className="text-xs text-text-muted opacity-60 m-0">
                            Built by engineers, for engineers
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <nav className="hidden md:flex items-center gap-4 text-xs text-text-muted">
                            <a href={`${baseUrl}learn`} className="no-underline text-text-muted hover:text-text-primary transition-colors">Learn</a>
                            <a href={`${baseUrl}tutorials`} className="no-underline text-text-muted hover:text-text-primary transition-colors">Tutorials</a>
                            <a href={`${baseUrl}patterns`} className="no-underline text-text-muted hover:text-text-primary transition-colors">Patterns</a>
                            <a href={`${baseUrl}team`} className="no-underline text-text-muted hover:text-text-primary transition-colors">Team</a>
                        </nav>

                        <div className="flex gap-4 items-center">
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
                                        className="text-text-muted hover:text-text-primary transition-colors flex items-center justify-center"
                                    >
                                        <Icon size={16} strokeWidth={2} />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
