import { Sun, Moon, Menu, X } from 'lucide-react';
import { config } from '../config';
import { useStore } from '@nanostores/react';
import { theme as themeAtom, toggleTheme } from '../stores/themeStore';
import { useState, useEffect } from 'react';
import { socialIconsMap } from './SocialIcons';

export function Header() {
    const theme = useStore(themeAtom);
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const baseUrl = import.meta.env.BASE_URL || '';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { label: 'Tutorials', href: `${baseUrl}tutorials` },
        { label: 'Learning Path', href: `${baseUrl}learn` },
        { label: 'Patterns', href: `${baseUrl}patterns` },
        { label: 'Team', href: `${baseUrl}team` },
    ];

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
                {/* BRAND */}
                <a href={baseUrl || '/'} className="flex items-center gap-3 no-underline text-inherit opacity-90 hover:opacity-100 transition-opacity flex-shrink-0">
                    <img
                        src={`${baseUrl}logo.png`}
                        alt="Agentic Loops Logo"
                        className="w-8 h-8 object-contain"
                    />
                    <span className="text-base font-semibold tracking-tight text-text-primary">
                        Agentic Loops
                    </span>
                </a>

                <div className="flex-1" />

                {/* NAVIGATION (desktop) */}
                <nav className="hidden md:flex gap-1 items-center">
                    {navLinks.map(({ label, href }) => (
                        <a
                            key={label}
                            href={href}
                            className="py-2 px-3 text-sm font-medium text-text-secondary no-underline transition-colors hover:text-text-primary"
                        >
                            {label}
                        </a>
                    ))}
                </nav>

                <div className="hidden md:block w-px h-5 bg-border" />

                {/* SOCIALS + SEARCH + THEME (desktop) */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="hidden md:flex items-center gap-2">
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
                                    className="text-text-muted hover:text-text-primary transition-colors flex items-center justify-center p-1"
                                >
                                    <Icon size={18} />
                                </a>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => toggleTheme()}
                        aria-label="Toggle theme"
                        className="bg-transparent border-none text-text-muted p-1 transition-colors hover:text-text-primary flex items-center"
                    >
                        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                    </button>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden bg-transparent border-none text-text-secondary p-1 flex items-center"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* MOBILE MENU */}
            {mobileOpen && (
                <div
                    className="md:hidden border-t border-border"
                    style={{ background: 'var(--color-bg-card-solid)' }}
                >
                    <nav className="container px-6 py-4 flex flex-col gap-1">
                        {navLinks.map(({ label, href }) => (
                            <a
                                key={label}
                                href={href}
                                className="px-3 py-2 text-sm text-text-secondary no-underline hover:text-text-primary transition-colors rounded-lg"
                                onClick={() => setMobileOpen(false)}
                            >
                                {label}
                            </a>
                        ))}
                        <div className="h-px bg-border my-2" />
                        <div className="flex items-center gap-3 px-3 py-2">
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
                                        className="text-text-muted hover:text-text-primary transition-colors"
                                    >
                                        <Icon size={18} />
                                    </a>
                                );
                            })}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
