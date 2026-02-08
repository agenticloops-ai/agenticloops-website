/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx,astro}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                mono: ['Azeret Mono', 'JetBrains Mono', 'monospace'],
                display: ['Rajdhani', 'sans-serif'],
            },
            colors: {
                // Map to CSS variables for theme support
                bg: {
                    primary: 'var(--color-bg-primary)',
                    secondary: 'var(--color-bg-secondary)',
                    tertiary: 'var(--color-bg-tertiary)',
                    card: 'var(--color-bg-card-solid)',
                },
                border: {
                    DEFAULT: 'var(--color-border)',
                    hover: 'var(--color-border-hover)',
                    accent: 'var(--color-border-accent)',
                },
                text: {
                    primary: 'var(--color-text-primary)',
                    secondary: 'var(--color-text-secondary)',
                    muted: 'var(--color-text-muted)',
                },
                accent: {
                    cyan: 'var(--color-accent-cyan)',
                    teal: 'var(--color-accent-teal)',
                    amber: 'var(--color-accent-amber)',
                },
            },
            letterSpacing: {
                wider: '0.1em',
                widest: '0.15em',
            },
        },
    },
    plugins: [],
}
