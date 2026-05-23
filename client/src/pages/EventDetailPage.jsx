import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarDays, MapPin, Ticket } from 'lucide-react';
import { eventsService } from '../services/events.service';
import { Skeleton } from '../components/ui/Skeleton';
import { formatDate } from '../utils/date';
import { BookingPanel } from '../components/booking/BookingPanel';
import { useEventSocket } from '../hooks/useEventSocket';

export default function EventDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['event', id], queryFn: () => eventsService.detail(id) });
  const event = data?.event;

  const socketHandlers = useMemo(
    () => ({
      'availability-updated': (payload) => {
        if (payload.eventId !== id) return;
        queryClient.setQueryData(['event', id], (current) =>
          current?.event
            ? {
                ...current,
                event: { ...current.event, availableSeats: payload.availableSeats }
              }
            : current
        );
      },
      'event-updated': (updatedEvent) => {
        if (updatedEvent._id === id) queryClient.setQueryData(['event', id], { event: updatedEvent });
      }
    }),
    [id, queryClient]
  );

  useEventSocket(id, socketHandlers);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Skeleton className="h-[28rem] w-full" />
      </main>
    );
  }

  return (
    <main>
      <section className="relative min-h-[26rem]">
        <img src={event.bannerImage} alt={event.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="relative mx-auto flex min-h-[26rem] max-w-7xl flex-col justify-end px-4 pb-10 text-white sm:px-6 lg:px-8">
          <span className="w-max rounded-full bg-white/15 px-3 py-1 text-sm font-semibold backdrop-blur">{event.category}</span>
          <h1 className="mt-4 max-w-4xl text-4xl font-black sm:text-5xl">{event.title}</h1>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_22rem] lg:px-8">
        <div>
          <h2 className="text-2xl font-black">About this event</h2>
          <p className="mt-4 leading-8 text-slate-600 dark:text-slate-300">{event.description}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <p className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm dark:bg-white/5">
              <CalendarDays className="h-5 w-5 text-brand-600" />
              {formatDate(event.date)}<br />{event.time}
            </p>
            <p className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm dark:bg-white/5">
              <MapPin className="h-5 w-5 text-ember" />
              {event.venue}<br />{event.city}
            </p>
            <p className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm dark:bg-white/5">
              <Ticket className="h-5 w-5 text-berry" />
              {event.availableSeats}<br />seats left
            </p>
          </div>
        </div>
        <BookingPanel event={event} />
      </section>
    </main>
  );
}
