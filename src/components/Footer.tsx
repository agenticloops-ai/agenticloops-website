import { socialIconsMap } from './SocialIcons';
import { config } from '../config';

export function Footer() {
    return (
        <footer className="bg-bg-secondary border-t border-border py-8 px-6 mt-auto">
            <div className="container max-w-[1200px] mx-auto">
                <div className="flex justify-between items-center flex-wrap gap-6">
                    {/* Copyright & Motto */}
                    <div className="flex flex-col gap-1">
                        <p className="font-mono text-xs text-text-muted tracking-wide m-0">
                            © {new Date().getFullYear()} {config.brand.name}
                        </p>
                        <p className="font-mono text-[0.7rem] text-text-muted opacity-60 tracking-wide m-0">
                            Built by engineers, for engineers
                        </p>
                    </div>

                    {/* Social Icons */}
                    <div className="flex gap-5 items-center">
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
                                    <Icon size={18} strokeWidth={2} />
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </footer>
    );
}

