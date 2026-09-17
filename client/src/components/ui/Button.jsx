import { SpinnerGap } from '@phosphor-icons/react';
import { clsx } from 'clsx';

const variants = {
  primary: 'bg-ink text-white hover:bg-black dark:bg-white dark:text-ink dark:hover:bg-slate-200',
  accent: 'bg-teal-500 text-[#031513] shadow-[0_8px_24px_rgba(20,184,166,0.18)] hover:bg-teal-400 hover:shadow-[0_10px_30px_rgba(20,184,166,0.28)]',
  outline: 'border border-white/15 bg-white/[0.04] text-white hover:border-teal-400/40 hover:bg-teal-400/10 hover:text-teal-100',
  nav: 'bg-transparent text-slate-200 hover:bg-white/[0.08] hover:text-white',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10',
  danger: 'bg-berry text-white hover:bg-rose-800'
};

const sizes = {
  default: 'h-11 px-4',
  compact: 'h-10 px-4'
};

export function Button({ children, variant = 'primary', size = 'default', className, isLoading, disabled, ...props }) {
  return (
    <button
      className={clsx(
        'focus-ring inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <SpinnerGap weight="regular" aria-hidden="true" className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
}
