import { useCallback, useEffect, useMemo, useState } from 'react';
import { ThemeContext } from '../hooks/useTheme';

function readTheme() {
  try {
    return localStorage.getItem('eventx_theme') === 'dark' ? 'dark' : 'light';
  } catch {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#080d14' : '#f8fafc');
    try {
      localStorage.setItem('eventx_theme', theme);
    } catch {
      // Theme switching still works when the browser blocks storage.
    }
  }, [theme]);

  useEffect(() => {
    const syncTheme = (event) => {
      if (event.key === 'eventx_theme' || event.key === null) setTheme(readTheme());
    };
    window.addEventListener('storage', syncTheme);
    return () => window.removeEventListener('storage', syncTheme);
  }, []);

  const toggleTheme = useCallback(() => setTheme((current) => current === 'dark' ? 'light' : 'dark'), []);
  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
