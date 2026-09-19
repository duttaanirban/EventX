export function MetricCard({ label, value, tone = 'brand', icon: Icon, surface = 'default', detail }) {
  const tones = {
    brand: 'border-brand-100 bg-brand-50 text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-100',
    ember: 'border-orange-100 bg-orange-50 text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-100',
    berry: 'border-rose-100 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-100',
    slate: 'border-slate-200 bg-white text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white'
  };

  if (surface === 'dashboard') {
    const iconTones = {
      brand: 'bg-teal-400/10 text-teal-300',
      ember: 'bg-orange-400/10 text-orange-300',
      berry: 'bg-rose-400/10 text-rose-300',
      slate: 'bg-sky-400/10 text-sky-300'
    };

    return (
      <article className="min-w-0 rounded-xl border border-white/[0.08] bg-[#101720] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.16)]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
            <p className="mt-2 break-words text-2xl font-bold text-white">{value}</p>
            {detail ? <p className="mt-1 text-xs text-slate-500">{detail}</p> : null}
          </div>
          {Icon ? (
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${iconTones[tone]}`}>
              <Icon weight="duotone" aria-hidden="true" className="h-5 w-5" />
            </span>
          ) : null}
        </div>
      </article>
    );
  }

  return (
    <div className={`rounded-lg border p-5 shadow-sm ${tones[tone]}`}>
      <p className="text-sm font-semibold opacity-80">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}
