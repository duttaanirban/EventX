import { Search } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

export function EventFilters({ filters, setFilters }) {
  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value, page: 1 }));

  return (
    <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
        <Input
          aria-label="Search events"
          placeholder="Search events"
          value={filters.search}
          onChange={(event) => update('search', event.target.value)}
          className="pl-9"
        />
      </div>
      <Select value={filters.category} onChange={(event) => update('category', event.target.value)} aria-label="Category">
        <option value="">All categories</option>
        <option>Business</option>
        <option>Music</option>
        <option>Technology</option>
        <option>Sports</option>
        <option>Food</option>
      </Select>
      <Input placeholder="City" value={filters.city} onChange={(event) => update('city', event.target.value)} aria-label="City" />
      <Select value={filters.sort} onChange={(event) => update('sort', event.target.value)} aria-label="Sort">
        <option value="date">Soonest</option>
        <option value="price">Price low to high</option>
        <option value="-price">Price high to low</option>
        <option value="createdAt">Newest</option>
      </Select>
    </div>
  );
}
