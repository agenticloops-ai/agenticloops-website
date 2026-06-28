import { atom } from 'nanostores';

export type Theme = 'light' | 'dark';

export const theme = atom<Theme>('light');

function applyTheme(value: Theme) {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('dark', value === 'dark');
}

export function toggleTheme() {
    const newTheme = theme.get() === 'light' ? 'dark' : 'light';
    theme.set(newTheme);
    applyTheme(newTheme);

    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('theme', newTheme);
    }
}

export function initTheme() {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('theme') as Theme | null;
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initial = saved ?? system;
    theme.set(initial);
    applyTheme(initial);
}
