import { MagnifyingGlass, MapPin } from '@phosphor-icons/react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

export function EventFilters({ filters, setFilters }) {
  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value, page: 1 }));
  const controlClass = '!border-white/10 !bg-[#080e16] !text-white [color-scheme:dark] focus:!border-teal-400/60 focus-visible:!ring-offset-[#101923]';

  return (
    <div className="grid gap-3 rounded-2xl border border-white/[0.08] bg-[#101923] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.15)] sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
      <div className="relative">
        <MagnifyingGlass weight="regular" aria-hidden="true" className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
        <Input
          aria-label="Search events"
          placeholder="Search events"
          value={filters.search}
          onChange={(event) => update('search', event.target.value)}
          className={`${controlClass} pl-9`}
        />
      </div>
      <Select className={controlClass} value={filters.category} onChange={(event) => update('category', event.target.value)} aria-label="Category">
        <option value="">All categories</option>
        <option>Business</option>
        <option>Music</option>
        <option>Technology</option>
        <option>Sports</option>
        <option>Food</option>
      </Select>
      <div className="relative">
        <MapPin weight="regular" aria-hidden="true" className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
        <Input className={`${controlClass} pl-9`} placeholder="City" value={filters.city} onChange={(event) => update('city', event.target.value)} aria-label="City" />
      </div>
      <Select className={controlClass} value={filters.sort} onChange={(event) => update('sort', event.target.value)} aria-label="Sort">
        <option value="date">Soonest</option>
        <option value="price">Price low to high</option>
        <option value="-price">Price high to low</option>
        <option value="createdAt">Newest</option>
      </Select>
    </div>
  );
}
