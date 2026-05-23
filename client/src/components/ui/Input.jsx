import { clsx } from 'clsx';

export function Input({ label, error, className, ...props }) {
  return (
    <label className="block">
      {label ? <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span> : null}
      <input
        className={clsx(
          'focus-ring h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 dark:border-white/10 dark:bg-white/5 dark:text-white',
          error && 'border-berry',
          className
        )}
        {...props}
      />
      {error ? <span className="mt-1 block text-xs font-medium text-berry">{error}</span> : null}
    </label>
  );
}
