import { ArrowsDownUp, MagnifyingGlass, MapPin, SquaresFour } from '@phosphor-icons/react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

export function EventFilters({ filters, setFilters }) {
  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value, page: 1 }));
  const controlClass =
    '!h-12 !rounded-xl !border-slate-200 dark:!border-white/10 !bg-slate-50 dark:!bg-[#080e16] !text-slate-900 dark:!text-white !shadow-none [color-scheme:light] dark:[color-scheme:dark] placeholder:!text-slate-500 hover:!border-slate-200 dark:hover:!border-white/20 focus:!border-teal-400/60 focus-visible:!ring-teal-400 focus-visible:!ring-offset-white dark:focus-visible:!ring-offset-[#101923]';
  const iconClass = 'pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 dark:text-slate-400';

  return (
    <section
      aria-label="Event filters"
      className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white/95 dark:bg-[#101923]/95 p-3 shadow-[0_18px_48px_rgba(0,0,0,0.24)] ring-1 ring-slate-200 dark:ring-white/[0.02] backdrop-blur sm:p-4"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1fr]">
        <div className="relative min-w-0">
          <MagnifyingGlass weight="regular" aria-hidden="true" className={iconClass} />
          <Input
            aria-label="Search events"
            type="search"
            placeholder="Search events"
            value={filters.search}
            onChange={(event) => update('search', event.target.value)}
            className={`${controlClass} !pl-10`}
          />
        </div>
        <div className="relative min-w-0">
          <SquaresFour weight="regular" aria-hidden="true" className={iconClass} />
          <Select className={`${controlClass} !pl-10`} value={filters.category} onChange={(event) => update('category', event.target.value)} aria-label="Category">
            <option value="">All categories</option>
            <option>Business</option>
            <option>Music</option>
            <option>Technology</option>
            <option>Sports</option>
            <option>Food</option>
          </Select>
        </div>
        <div className="relative min-w-0">
          <MapPin weight="regular" aria-hidden="true" className={iconClass} />
          <Input className={`${controlClass} !pl-10`} placeholder="City" value={filters.city} onChange={(event) => update('city', event.target.value)} aria-label="City" />
        </div>
        <div className="relative min-w-0">
          <ArrowsDownUp weight="regular" aria-hidden="true" className={iconClass} />
          <Select className={`${controlClass} !pl-10`} value={filters.sort} onChange={(event) => update('sort', event.target.value)} aria-label="Sort events">
            <option value="date">Soonest</option>
            <option value="price">Price low to high</option>
            <option value="-price">Price high to low</option>
            <option value="createdAt">Newest</option>
          </Select>
        </div>
      </div>
    </section>
  );
}
