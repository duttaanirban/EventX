import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { eventsService } from '../services/events.service';
import { EventCard } from '../components/events/EventCard';
import { EventFilters } from '../components/events/EventFilters';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { useDebounce } from '../hooks/useDebounce';

export default function EventsPage() {
  const [filters, setFilters] = useState({ search: '', category: '', city: '', sort: 'date', page: 1, limit: 9 });
  const debouncedSearch = useDebounce(filters.search);
  const params = useMemo(() => ({ ...filters, search: debouncedSearch || undefined }), [filters, debouncedSearch]);
  const { data, isLoading } = useQuery({ queryKey: ['events', params], queryFn: () => eventsService.list(params) });

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black">Explore events</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Search by category, city, price, and date.</p>
      </div>
      <EventFilters filters={filters} setFilters={setFilters} />
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-80" />)
          : data?.events?.map((event) => <EventCard key={event._id} event={event} />)}
      </div>
      {!isLoading && !data?.events?.length ? (
        <div className="mt-8">
          <EmptyState title="No events match your filters" description="Try clearing search or changing the city/category." />
        </div>
      ) : null}
      {data?.pages > 1 ? (
        <div className="mt-8 flex justify-center gap-3">
          <Button variant="ghost" disabled={filters.page <= 1} onClick={() => setFilters((current) => ({ ...current, page: current.page - 1 }))}>
            Previous
          </Button>
          <Button variant="ghost" disabled={filters.page >= data.pages} onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))}>
            Next
          </Button>
        </div>
      ) : null}
    </main>
  );
}
