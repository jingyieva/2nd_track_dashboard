// ::THEME_CONTEXT:: - contextx/theme-context.jsx
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const getPreferredTheme = () => {
    if (typeof window === 'undefined') return 'light';
    return localStorage.getItem('theme') || 'system';
  };

  const [theme, setTheme] = useState(getPreferredTheme);
  const [resolvedTheme, setResolvedTheme] = useState('light');

  const applyTheme = (themeValue) => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    let appliedTheme = themeValue;
    if (themeValue === 'system') {
      appliedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    root.classList.add(appliedTheme);
    setResolvedTheme(appliedTheme);
  };

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== 'system') return;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => applyTheme('system');

    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}