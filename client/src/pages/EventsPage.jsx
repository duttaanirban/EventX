import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowCounterClockwise, CalendarX, CaretLeft, CaretRight, FunnelSimple, X } from '@phosphor-icons/react';
import { eventsService } from '../services/events.service';
import { EventCard } from '../components/events/EventCard';
import { EventFilters } from '../components/events/EventFilters';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { useDebounce } from '../hooks/useDebounce';

const initialFilters = { search: '', category: '', city: '', sort: 'date', page: 1, limit: 9 };

export default function EventsPage() {
  const [filters, setFilters] = useState(initialFilters);
  const debouncedSearch = useDebounce(filters.search);
  const params = useMemo(() => ({ ...filters, search: debouncedSearch || undefined }), [filters, debouncedSearch]);
  const { data, isLoading, isError } = useQuery({ queryKey: ['events', params], queryFn: () => eventsService.list(params) });
  const hasActiveFilters = Boolean(filters.search || filters.category || filters.city || filters.sort !== 'date');
  const clearFilters = () => setFilters({ ...initialFilters });
  const clearFilter = (key) => setFilters((current) => ({ ...current, [key]: initialFilters[key], page: 1 }));
  const totalEvents = data?.total;
  const visibleEvents = data?.events?.length || 0;
  const resultSummary = isLoading
    ? 'Loading events...'
    : isError
      ? 'Events unavailable'
      : typeof totalEvents === 'number'
        ? `${totalEvents} ${totalEvents === 1 ? 'event' : 'events'} found`
        : `Showing ${visibleEvents} ${visibleEvents === 1 ? 'event' : 'events'}`;
  const activeChips = [
    filters.search ? { key: 'search', label: `Search: ${filters.search}` } : null,
    filters.category ? { key: 'category', label: filters.category } : null,
    filters.city ? { key: 'city', label: filters.city } : null,
    filters.sort !== 'date' ? { key: 'sort', label: `Sort: ${sortLabels[filters.sort]}` } : null
  ].filter(Boolean);

  return (
    <main className="min-h-[calc(100dvh-4.5rem)] overflow-hidden bg-[#080d14] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[4.5rem] h-72 bg-[radial-gradient(ellipse_46rem_18rem_at_18%_0%,rgba(20,184,166,0.13),transparent_68%),radial-gradient(ellipse_36rem_16rem_at_88%_10%,rgba(56,189,248,0.08),transparent_66%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-12 lg:px-8">
        <header className="mb-6 max-w-2xl">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal-300/15 bg-teal-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-teal-200">
            <FunnelSimple weight="regular" aria-hidden="true" className="h-3.5 w-3.5" />
            Discover Events
          </p>
          <h1 className="text-3xl font-bold tracking-normal sm:text-4xl">Explore Events</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">Find events that match your interests, location, and schedule.</p>
        </header>
        <EventFilters filters={filters} setFilters={setFilters} />
        {activeChips.length ? (
          <div className="mt-4 flex flex-wrap gap-2" aria-label="Active filters">
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={() => clearFilter(chip.key)}
                className="focus-ring inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-teal-400/40 hover:bg-teal-400/10 hover:text-teal-100"
              >
                <span className="truncate">{chip.label}</span>
                <X weight="bold" aria-hidden="true" className="h-3 w-3 shrink-0" />
              </button>
            ))}
          </div>
        ) : null}
        <div className="mt-6 flex min-h-10 flex-wrap items-center justify-between gap-3 text-sm">
          <p role="status" className="text-slate-400">
            {resultSummary}
          </p>
          {hasActiveFilters ? (
            <Button variant="nav" size="compact" onClick={clearFilters} className="rounded-xl border border-white/10 bg-white/[0.03]">
              <ArrowCounterClockwise weight="regular" aria-hidden="true" className="h-4 w-4" />
              Clear filters
            </Button>
          ) : null}
        </div>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-busy={isLoading}>
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
              <div key={index} aria-hidden="true" className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#101720]">
                <Skeleton className="aspect-video !rounded-none !bg-white/5" />
                <div className="space-y-4 p-4">
                  <Skeleton className="h-12 !bg-white/5" />
                  <Skeleton className="h-5 w-3/4 !bg-white/5" />
                  <Skeleton className="h-5 w-2/3 !bg-white/5" />
                  <Skeleton className="h-20 !bg-white/5" />
                </div>
              </div>
            ))
            : data?.events?.map((event) => <EventCard key={event._id} event={event} variant="featured" />)}
        </div>
        {!isLoading && isError ? (
          <div role="alert" className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-950/20 p-6 text-center text-sm text-rose-100">
            Unable to load events. Please try again later.
          </div>
        ) : null}
        {!isLoading && !isError && !data?.events?.length ? (
          <div className="py-10">
            <EmptyState icon={CalendarX} title="No events found" description="Try changing your search or filters.">
              <Button variant="outline" onClick={clearFilters}>
                <ArrowCounterClockwise weight="regular" aria-hidden="true" className="h-4 w-4" />
                Clear filters
              </Button>
            </EmptyState>
          </div>
        ) : null}
        {data?.pages > 1 ? (
          <nav aria-label="Event pagination" className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button variant="outline" className="rounded-xl" disabled={filters.page <= 1} onClick={() => setFilters((current) => ({ ...current, page: current.page - 1 }))}>
              <CaretLeft weight="regular" aria-hidden="true" className="h-4 w-4" />
              Previous
            </Button>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-slate-400">Page {filters.page} of {data.pages}</span>
            <Button variant="outline" className="rounded-xl" disabled={filters.page >= data.pages} onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))}>
              Next
              <CaretRight weight="regular" aria-hidden="true" className="h-4 w-4" />
            </Button>
          </nav>
        ) : null}
      </div>
    </main>
  );
}

const sortLabels = {
  date: 'Soonest',
  price: 'Price low to high',
  '-price': 'Price high to low',
  createdAt: 'Newest'
};
