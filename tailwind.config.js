/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx,astro}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'ui-monospace', 'SF Mono', 'monospace'],
                display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            colors: {
                paper: 'var(--color-paper)',
                surface: 'var(--color-surface)',
                subtle: 'var(--color-subtle)',
                bg: {
                    primary: 'var(--color-paper)',
                    secondary: 'var(--color-subtle)',
                    tertiary: 'var(--color-subtle)',
                    card: 'var(--color-surface)',
                },
                border: {
                    DEFAULT: 'var(--color-border)',
                    hover: 'var(--color-border-hover)',
                    accent: 'var(--color-accent)',
                },
                text: {
                    primary: 'var(--color-text-primary)',
                    secondary: 'var(--color-text-secondary)',
                    muted: 'var(--color-text-tertiary)',
                },
                accent: {
                    DEFAULT: 'var(--color-accent)',
                    hover: 'var(--color-accent-hover)',
                    // back-compat aliases — all resolve to the single slate accent
                    cyan: 'var(--color-accent)',
                    teal: 'var(--color-accent)',
                    amber: 'var(--color-warn)',
                },
                success: 'var(--color-success)',
                warn: 'var(--color-warn)',
                error: 'var(--color-error)',
                viz: {
                    1: 'var(--color-viz-1)',
                    2: 'var(--color-viz-2)',
                    3: 'var(--color-viz-3)',
                    4: 'var(--color-viz-4)',
                    5: 'var(--color-viz-5)',
                },
            },
            borderRadius: {
                card: 'var(--radius-card)',
                input: 'var(--radius-input)',
            },
            letterSpacing: {
                wider: '0.04em',
                widest: '0.08em',
            },
        },
    },
    plugins: [],
}
