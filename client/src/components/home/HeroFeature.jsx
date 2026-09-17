export function HeroFeature({ icon: Icon, title, copy }) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-teal-400/20 bg-teal-400/10 text-teal-300">
        <Icon weight="duotone" aria-hidden="true" className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-0.5 text-xs leading-5 text-slate-400">{copy}</p>
      </div>
    </div>
  );
}
