import { atom } from 'nanostores';

export type Theme = 'light' | 'dark';

export const theme = atom<Theme>('light');

export function toggleTheme() {
    const newTheme = theme.get() === 'light' ? 'dark' : 'light';
    theme.set(newTheme);

    if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }
}

export function initTheme() {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('theme') as Theme;
        const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const initial = saved || system;
        theme.set(initial);
        document.documentElement.setAttribute('data-theme', initial);
    }
}
