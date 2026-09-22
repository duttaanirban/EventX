import { useId } from 'react';
import { clsx } from 'clsx';

export function Input({ label, error, className, icon: Icon, endAdornment, tone = 'default', ...props }) {
  const generatedId = useId();
  const inputId = props.id || generatedId;
  const errorId = `${inputId}-error`;
  const describedBy = [props['aria-describedby'], error ? errorId : null].filter(Boolean).join(' ') || undefined;
  const isDark = tone === 'dark';

  return (
    <div className="block">
      {label ? (
        <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
        </label>
      ) : null}
      <div className="relative">
        {Icon ? (
          <Icon
            weight="regular"
            aria-hidden="true"
            className={clsx('pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2', isDark ? 'text-slate-500' : 'text-slate-600 dark:text-slate-400')}
          />
        ) : null}
        <input
          {...props}
          id={inputId}
          aria-invalid={error ? 'true' : props['aria-invalid']}
          aria-describedby={describedBy}
          className={clsx(
            'focus-ring h-12 w-full rounded-xl border px-3 text-sm shadow-sm transition placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-60',
            isDark
              ? 'border-slate-200 dark:border-white/10 bg-slate-900/5 dark:bg-white/[0.045] text-slate-900 dark:text-white hover:border-slate-200 dark:hover:border-white/20 focus:border-teal-400/60'
              : 'border-slate-200 bg-white text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white',
            Icon && 'pl-10',
            endAdornment && 'pr-12',
            error && 'border-rose-500/70 focus:border-rose-400',
            className
          )}
        />
        {endAdornment ? <div className="absolute right-1.5 top-1/2 -translate-y-1/2">{endAdornment}</div> : null}
      </div>
      {error ? <span id={errorId} role="alert" className="mt-1.5 block text-xs font-medium text-rose-700 dark:text-rose-400">{error}</span> : null}
    </div>
  );
}
