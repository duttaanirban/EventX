import { CalendarX } from '@phosphor-icons/react';

export function EmptyState({ title = 'Nothing here yet', description, children, icon: Icon = CalendarX }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-8 text-center dark:border-white/15 dark:bg-white/[0.03]">
      <Icon weight="duotone" aria-hidden="true" className="mx-auto h-10 w-10 text-teal-700 dark:text-teal-400" />
      <h3 className="mt-3 text-base font-semibold">{title}</h3>
      {description ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p> : null}
      {children ? <div className="mt-5 flex justify-center">{children}</div> : null}
    </div>
  );
}
