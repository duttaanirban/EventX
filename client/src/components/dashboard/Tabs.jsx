import { clsx } from 'clsx';

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-lg border border-slate-200 bg-white p-1 shadow-sm dark:border-white/10 dark:bg-white/5">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={clsx(
            'focus-ring inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg px-4 text-sm font-bold transition',
            active === tab.id
              ? 'bg-ink text-white dark:bg-white dark:text-ink'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10'
          )}
          onClick={() => onChange(tab.id)}
        >
          {tab.icon ? <tab.icon className="h-4 w-4" /> : null}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
