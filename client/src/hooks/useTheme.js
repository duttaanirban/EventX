import { useEffect, useState } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(localStorage.getItem('eventx_theme') || 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('eventx_theme', theme);
  }, [theme]);

  return { theme, setTheme, toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')) };
}
