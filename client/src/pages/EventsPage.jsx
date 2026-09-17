import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowCounterClockwise, CalendarX, CaretLeft, CaretRight } from '@phosphor-icons/react';
import { eventsService } from '../services/events.service';
import { EventCard } from '../components/events/EventCard';
import { EventFilters } from '../components/events/EventFilters';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { useDebounce } from '../hooks/useDebounce';

const initialFilters = { search: '', category: '', city: '', sort: 'date', page: 1, limit: 9 };

export default function EventsPage() {
  const [filters, setFilters] = useState(initialFilters);
  const debouncedSearch = useDebounce(filters.search);
  const params = useMemo(() => ({ ...filters, search: debouncedSearch || undefined }), [filters, debouncedSearch]);
  const { data, isLoading, isError } = useQuery({ queryKey: ['events', params], queryFn: () => eventsService.list(params) });
  const hasActiveFilters = Boolean(filters.search || filters.category || filters.city || filters.sort !== 'date');
  const clearFilters = () => setFilters({ ...initialFilters });

  return (
    <main className="min-h-[calc(100dvh-4.5rem)] bg-[#080d14] bg-[radial-gradient(ellipse_45rem_20rem_at_20%_0%,rgba(20,184,166,0.09),transparent)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-7">
        <h1 className="text-3xl font-bold">Explore events</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">Search by category, city, price, and date.</p>
      </div>
      <EventFilters filters={filters} setFilters={setFilters} />
      <div className="mt-5 flex min-h-10 flex-wrap items-center justify-between gap-3 text-sm">
        <p role="status" className="text-slate-400">
          {isLoading ? 'Loading events...' : isError ? 'Events unavailable' : `Showing ${data?.events?.length || 0} events`}
        </p>
        {hasActiveFilters ? (
          <Button variant="nav" size="compact" onClick={clearFilters}>
            <ArrowCounterClockwise weight="regular" aria-hidden="true" className="h-4 w-4" />
            Clear filters
          </Button>
        ) : null}
      </div>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-busy={isLoading}>
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
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
        <p role="alert" className="py-12 text-center text-sm text-slate-400">Unable to load events. Please try again later.</p>
      ) : null}
      {!isLoading && !isError && !data?.events?.length ? (
        <div className="py-14 text-center">
          <CalendarX weight="duotone" aria-hidden="true" className="mx-auto h-10 w-10 text-teal-400" />
          <h2 className="mt-4 text-lg font-semibold">No events found</h2>
          <p className="mt-2 text-sm text-slate-400">Try changing your search or filters.</p>
          <Button variant="outline" className="mt-5" onClick={clearFilters}>
            <ArrowCounterClockwise weight="regular" aria-hidden="true" className="h-4 w-4" />
            Clear filters
          </Button>
        </div>
      ) : null}
      {data?.pages > 1 ? (
        <nav aria-label="Event pagination" className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline" disabled={filters.page <= 1} onClick={() => setFilters((current) => ({ ...current, page: current.page - 1 }))}>
            <CaretLeft weight="regular" aria-hidden="true" className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-xs text-slate-400">Page {filters.page} of {data.pages}</span>
          <Button variant="outline" disabled={filters.page >= data.pages} onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))}>
            Next
            <CaretRight weight="regular" aria-hidden="true" className="h-4 w-4" />
          </Button>
        </nav>
      ) : null}
      </div>
    </main>
  );
}
