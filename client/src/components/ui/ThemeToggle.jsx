import { Moon, Sun } from '@phosphor-icons/react';
import { useTheme } from '../../hooks/useTheme';

export function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const label = `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`;

  return (
    <button
      type="button"
      className={`focus-ring grid h-10 w-10 shrink-0 place-items-center rounded-lg text-slate-600 transition hover:bg-slate-900/5 hover:text-teal-700 dark:text-slate-300 dark:hover:bg-white/[0.08] dark:hover:text-teal-300 ${className}`}
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      {theme === 'dark' ? <Sun weight="regular" aria-hidden="true" className="h-5 w-5" /> : <Moon weight="regular" aria-hidden="true" className="h-5 w-5" />}
    </button>
  );
}
