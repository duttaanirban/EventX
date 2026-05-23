import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

const variants = {
  primary: 'bg-ink text-white hover:bg-black dark:bg-white dark:text-ink dark:hover:bg-slate-200',
  accent: 'bg-brand-600 text-white hover:bg-brand-700',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10',
  danger: 'bg-berry text-white hover:bg-rose-800'
};

export function Button({ children, variant = 'primary', className, isLoading, disabled, ...props }) {
  return (
    <button
      className={clsx(
        'focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
}
