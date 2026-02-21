import { Sun, Moon } from 'lucide-react';
import { config } from '../config';
import { useStore } from '@nanostores/react';
import { theme as themeAtom, toggleTheme } from '../stores/themeStore';
import { useState, useEffect } from 'react';
import { socialIconsMap } from './SocialIcons';
import Search from './Search';

export function Header() {
    const theme = useStore(themeAtom);
    const [scrolled, setScrolled] = useState(false);
    const baseUrl = import.meta.env.BASE_URL || '';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        // Check verify initial scroll position
        handleScroll();

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className="fixed top-0 left-0 right-0 z-[100] h-[60px] transition-all duration-300"
            style={{
                background: scrolled ? 'var(--header-bg)' : 'transparent',
                backdropFilter: scrolled ? 'blur(12px)' : 'none',
                borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
            }}
        >
            <div className="container h-full px-6 flex items-center justify-between gap-4">
                {/* ZONE 1: BRAND */}
                <a href={baseUrl || '/'} className="flex items-center gap-3 no-underline text-inherit opacity-90 hover:opacity-100 transition-opacity flex-shrink-0">
                    <img
                        src={`${baseUrl}logo.png`}
                        alt="Agentic Loops Logo"
                        className="w-9 h-9 object-contain"
                    />
                    <span className="md:inline text-lg font-bold tracking-tight text-text-primary">
                        Agentic Loops
                    </span>
                </a>

                {/* ZONE 2: SPACER */}
                <div className="flex-1" />

                {/* ZONE 3: NAVIGATION */}
                <nav className="hidden-mobile flex gap-4 items-center">
                    {[
                        { label: 'Tenets', href: `${baseUrl}#tenets` },
                        { label: 'Team', href: `${baseUrl}#team` },
                        { label: 'Patterns', href: `${baseUrl}patterns` },
                        { label: 'Tutorials', href: `${baseUrl}#topics` },
                    ].map(({ label, href }) => (
                        <a
                            key={label}
                            href={href}
                            className="py-2 px-2 text-sm font-medium text-text-secondary no-underline transition-colors hover:text-accent-cyan"
                        >
                            {label}
                        </a>
                    ))}
                </nav>

                <div className="hidden md:block w-px h-6 bg-border" />

                {/* ZONE 4: SOCIALS + THEME */}
                <div className="flex items-center gap-5 flex-shrink-0">
                    <div className="hidden md:flex items-center gap-3">
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
                                    className="text-text-secondary hover:text-accent-cyan transition-colors flex items-center justify-center"
                                >
                                    <Icon size={20} />
                                </a>
                            );
                        })}
                    </div>

                    <Search />

                    <button
                        onClick={() => toggleTheme()}
                        aria-label="Toggle theme"
                        className="bg-transparent border-none text-text-secondary p-1 transition-colors hover:text-accent-cyan flex items-center"
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                </div>
            </div>
        </header>
    );
}

