import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Buildings,
  CalendarDots,
  Clock,
  MapPin,
  Ticket,
  UserCircle,
  Users
} from '@phosphor-icons/react';
import { eventsService } from '../services/events.service';
import { Skeleton } from '../components/ui/Skeleton';
import { formatDate } from '../utils/date';
import { BookingPanel } from '../components/booking/BookingPanel';
import { useEventSocket } from '../hooks/useEventSocket';

export default function EventDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventsService.detail(id)
  });
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

  if (isLoading) return <EventDetailSkeleton />;

  if (isError || !event) {
    const message = error?.response?.data?.message || error?.message || 'Unable to load this event.';

    return (
      <main className="min-h-[calc(100dvh-4.5rem)] bg-[#080d14] text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <BackToEvents />
          <div role="alert" className="mt-8 rounded-2xl border border-rose-400/20 bg-rose-950/20 px-6 py-12 text-center">
            <h1 className="text-2xl font-bold">Event unavailable</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-rose-100/80">{message}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100dvh-4.5rem)] overflow-hidden bg-[#080d14] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[4.5rem] h-72 bg-[radial-gradient(ellipse_46rem_18rem_at_18%_0%,rgba(20,184,166,0.12),transparent_68%),radial-gradient(ellipse_34rem_16rem_at_88%_10%,rgba(56,189,248,0.07),transparent_66%)]" />
      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <BackToEvents />

        <section className="relative mt-5 aspect-[16/10] min-h-72 overflow-hidden rounded-2xl border border-white/10 bg-[#101720] sm:aspect-[16/8] lg:aspect-[16/7]" aria-labelledby="event-title">
          {event.bannerImage ? (
            <img src={event.bannerImage} alt={`${event.title} event banner`} className="absolute inset-0 h-full w-full object-cover" />
          ) : null}
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#05080d] via-black/35 to-black/10" />
          <div className="relative flex h-full flex-col justify-end p-5 sm:p-8 lg:p-10">
            {event.category ? (
              <span className="w-max max-w-full truncate rounded-full border border-teal-300/20 bg-teal-950/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-teal-100 backdrop-blur-md">
                {event.category}
              </span>
            ) : null}
            <h1 id="event-title" className="mt-3 max-w-4xl break-words text-3xl font-bold leading-tight tracking-normal sm:text-4xl lg:text-5xl">
              {event.title}
            </h1>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-200">
              <span className="inline-flex items-center gap-2">
                <CalendarDots weight="duotone" aria-hidden="true" className="h-4 w-4 text-teal-300" />
                {formatDate(event.date)}
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin weight="duotone" aria-hidden="true" className="h-4 w-4 text-teal-300" />
                {[event.venue, event.city].filter(Boolean).join(', ')}
              </span>
            </div>
          </div>
        </section>

        <section className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="min-w-0">
            <section aria-labelledby="about-event">
              <h2 id="about-event" className="text-2xl font-bold">About this event</h2>
              <p className="mt-4 max-w-3xl whitespace-pre-line break-words text-base leading-8 text-slate-300">{event.description}</p>
            </section>

            <section className="mt-9" aria-labelledby="event-details">
              <h2 id="event-details" className="text-lg font-semibold">Event details</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <EventInfoCard icon={CalendarDots} label="Date" value={formatDate(event.date)} detail={event.time} detailIcon={Clock} />
                <EventInfoCard icon={MapPin} label="Location" value={event.venue} detail={event.city} />
                <EventInfoCard icon={Users} label="Availability" value={`${event.availableSeats} seats available`} detail={`${event.totalSeats} total seats`} />
                <EventInfoCard icon={Ticket} label="Category" value={event.category} />
              </div>
            </section>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {event.organizer?.name ? (
                <section className="rounded-xl border border-white/[0.08] bg-[#101720] p-5" aria-labelledby="event-host">
                  <div className="flex items-center gap-3">
                    {event.organizer.avatar ? (
                      <img src={event.organizer.avatar} alt="" className="h-11 w-11 rounded-full border border-white/10 object-cover" />
                    ) : (
                      <span className="grid h-11 w-11 place-items-center rounded-full bg-teal-400/10 text-teal-300">
                        <UserCircle weight="duotone" aria-hidden="true" className="h-6 w-6" />
                      </span>
                    )}
                    <div className="min-w-0">
                      <h2 id="event-host" className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Hosted by</h2>
                      <p className="mt-1 truncate font-semibold text-slate-100">{event.organizer.name}</p>
                    </div>
                  </div>
                </section>
              ) : null}

              {event.venue || event.city ? (
                <section className="rounded-xl border border-white/[0.08] bg-[#101720] p-5" aria-labelledby="event-venue">
                  <div className="flex items-start gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sky-400/10 text-sky-300">
                      <Buildings weight="duotone" aria-hidden="true" className="h-6 w-6" />
                    </span>
                    <div className="min-w-0">
                      <h2 id="event-venue" className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Venue</h2>
                      <p className="mt-1 break-words font-semibold text-slate-100">{event.venue}</p>
                      {event.city ? <p className="mt-1 text-sm text-slate-400">{event.city}</p> : null}
                    </div>
                  </div>
                </section>
              ) : null}
            </div>
          </div>

          <BookingPanel event={event} />
        </section>
      </div>
    </main>
  );
}

function BackToEvents() {
  return (
    <Link to="/events" className="focus-ring inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-slate-400 transition hover:bg-white/[0.05] hover:text-teal-200">
      <ArrowLeft weight="regular" aria-hidden="true" className="h-4 w-4" />
      Back to events
    </Link>
  );
}

function EventInfoCard({ icon: Icon, label, value, detail, detailIcon: DetailIcon }) {
  if (!value) return null;

  return (
    <article className="flex min-h-28 items-start gap-3 rounded-xl border border-white/[0.08] bg-[#101720] p-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-400/10 text-teal-300">
        <Icon weight="duotone" aria-hidden="true" className="h-5 w-5" />
      </span>
      <div className="min-w-0 pt-0.5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold leading-5 text-slate-100">{value}</p>
        {detail ? (
          <p className="mt-1 flex items-center gap-1.5 break-words text-sm text-slate-400">
            {DetailIcon ? <DetailIcon weight="duotone" aria-hidden="true" className="h-3.5 w-3.5 shrink-0" /> : null}
            {detail}
          </p>
        ) : null}
      </div>
    </article>
  );
}

function EventDetailSkeleton() {
  return (
    <main className="min-h-[calc(100dvh-4.5rem)] bg-[#080d14] text-white" aria-busy="true" aria-label="Loading event details">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <Skeleton className="h-9 w-32 !bg-white/5" />
        <Skeleton className="mt-5 aspect-[16/10] min-h-72 w-full !rounded-2xl !bg-white/5 sm:aspect-[16/8] lg:aspect-[16/7]" />
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
          <div>
            <Skeleton className="h-8 w-52 !bg-white/5" />
            <Skeleton className="mt-4 h-24 w-full !bg-white/5" />
            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-28 !rounded-xl !bg-white/5" />)}
            </div>
          </div>
          <Skeleton className="h-[27rem] !rounded-2xl !bg-white/5" />
        </div>
      </div>
    </main>
  );
}
