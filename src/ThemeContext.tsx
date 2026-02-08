import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useStore } from '@nanostores/react';
import { theme as themeAtom, toggleTheme as toggleThemeAtom, initTheme, type Theme } from './stores/themeStore';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const theme = useStore(themeAtom);

    useEffect(() => {
        initTheme();
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme: toggleThemeAtom }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        // Fallback for when used outside of Provider (if possible, or just default behavior)
        // But for migration safety we'll keep the throw if strict, or maybe return direct store access?
        // Let's stick to the throw for now to catch issues.
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
