import { CalendarX } from 'lucide-react';

export function EmptyState({ title = 'Nothing here yet', description }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center dark:border-white/15">
      <CalendarX className="mx-auto h-9 w-9 text-slate-400" />
      <h3 className="mt-3 text-base font-semibold">{title}</h3>
      {description ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p> : null}
    </div>
  );
}
