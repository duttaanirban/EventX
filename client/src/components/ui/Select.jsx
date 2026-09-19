import { clsx } from 'clsx';

export function Select({ label, error, children, className, tone = 'default', ...props }) {
  const isDark = tone === 'dark';

  return (
    <label className="block">
      {label ? <span className={clsx('mb-2 block text-sm font-medium', isDark ? 'text-slate-200' : 'text-slate-700 dark:text-slate-200')}>{label}</span> : null}
      <select
        className={clsx(
          'focus-ring h-12 w-full rounded-xl border px-3 text-sm shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60',
          isDark
            ? 'border-white/10 bg-[#151e29] text-white hover:border-white/20 focus:border-teal-400/60'
            : 'border-slate-200 bg-white text-slate-900 dark:border-white/10 dark:bg-[#1c2028] dark:text-white',
          error && 'border-rose-500/70',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="mt-1.5 block text-xs font-medium text-rose-400">{error}</span> : null}
    </label>
  );
}
