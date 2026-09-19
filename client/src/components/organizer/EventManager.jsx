import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  CalendarDots,
  MapPin,
  PencilSimple,
  Plus,
  Ticket,
  Trash,
  Users,
  X
} from '@phosphor-icons/react';
import { eventsService } from '../../services/events.service';
import { bookingsService } from '../../services/bookings.service';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { Skeleton } from '../ui/Skeleton';
import { EventForm } from './EventForm';

export function EventManager() {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [attendeeEvent, setAttendeeEvent] = useState(null);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['organizer-events'],
    queryFn: eventsService.mine
  });
  const events = data?.events || [];

  const createMutation = useMutation({
    mutationFn: eventsService.create,
    onSuccess: () => {
      toast.success('Event created');
      setIsCreating(false);
      queryClient.invalidateQueries({ queryKey: ['organizer-events'] });
      queryClient.invalidateQueries({ queryKey: ['organizer-analytics'] });
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Unable to create event')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => eventsService.update(id, payload),
    onSuccess: () => {
      toast.success('Event updated');
      setEditingEvent(null);
      queryClient.invalidateQueries({ queryKey: ['organizer-events'] });
      queryClient.invalidateQueries({ queryKey: ['organizer-analytics'] });
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Unable to update event')
  });

  const deleteMutation = useMutation({
    mutationFn: eventsService.remove,
    onSuccess: () => {
      toast.success('Event deleted');
      queryClient.invalidateQueries({ queryKey: ['organizer-events'] });
      queryClient.invalidateQueries({ queryKey: ['organizer-analytics'] });
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Unable to delete event')
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Your events</h2>
          <p className="mt-1 text-sm text-slate-500">
            {isLoading ? 'Loading event inventory...' : `${events.length} ${events.length === 1 ? 'event' : 'events'} in your workspace`}
          </p>
        </div>
        <Button type="button" variant="accent" className="rounded-xl" onClick={() => setIsCreating(true)}>
          <Plus weight="bold" aria-hidden="true" className="h-4 w-4" />
          Create event
        </Button>
      </div>

      {isCreating ? (
        <EventForm
          onSubmit={(values) => createMutation.mutate(values)}
          onCancel={() => setIsCreating(false)}
          isSubmitting={createMutation.isPending}
        />
      ) : null}

      {editingEvent ? (
        <EventForm
          event={editingEvent}
          onSubmit={(values) => updateMutation.mutate({ id: editingEvent._id, payload: values })}
          onCancel={() => setEditingEvent(null)}
          isSubmitting={updateMutation.isPending}
        />
      ) : null}

      {isLoading ? (
        <div className="grid gap-3" aria-busy="true" aria-label="Loading events">
          {Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-32 !rounded-xl !bg-white/5" />)}
        </div>
      ) : null}

      {!isLoading && isError ? (
        <div role="alert" className="rounded-xl border border-rose-400/20 bg-rose-950/20 p-5 text-center text-sm text-rose-100">
          Unable to load your events. Please try again later.
        </div>
      ) : null}

      {!isLoading && !isError && !events.length ? (
        <EmptyState title="No events created" description="Create your first event to start selling tickets.">
          <Button type="button" variant="accent" onClick={() => setIsCreating(true)}>
            <Plus weight="bold" aria-hidden="true" className="h-4 w-4" />
            Create event
          </Button>
        </EmptyState>
      ) : null}

      <div className="grid gap-3">
        {events.map((event) => {
          const sold = event.totalSeats - event.availableSeats;
          const soldPercentage = event.totalSeats ? Math.min((sold / event.totalSeats) * 100, 100) : 0;

          return (
            <article key={event._id} className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#101720]">
              <div className="grid gap-4 p-4 md:grid-cols-[7rem_minmax(0,1fr)_auto] md:items-center">
                <img src={event.bannerImage} alt={event.title + ' banner'} className="aspect-video h-full max-h-24 w-full rounded-lg object-cover md:aspect-auto md:w-28" />

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-teal-300/15 bg-teal-400/10 px-2.5 py-1 text-[0.7rem] font-semibold text-teal-200">
                      {event.category}
                    </span>
                    <span className="text-xs font-medium text-slate-500">{formatCurrency(event.ticketPrice)}</span>
                  </div>
                  <h3 className="mt-2 truncate text-base font-semibold text-slate-100">{event.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDots weight="duotone" aria-hidden="true" className="h-4 w-4 text-teal-300" />
                      {formatDate(event.date)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin weight="duotone" aria-hidden="true" className="h-4 w-4 text-sky-300" />
                      {event.city}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Ticket weight="duotone" aria-hidden="true" className="h-4 w-4 text-orange-300" />
                      {sold} sold / {event.totalSeats}
                    </span>
                  </div>
                  <div className="mt-3 h-1.5 max-w-md overflow-hidden rounded-full bg-white/[0.07]" aria-hidden="true">
                    <div className="h-full rounded-full bg-teal-400" style={{ width: `${soldPercentage}%` }} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 md:justify-end">
                  <Button type="button" size="compact" variant="nav" className="border border-white/10" onClick={() => setAttendeeEvent(event)}>
                    <Users weight="regular" aria-hidden="true" className="h-4 w-4" />
                    Attendees
                  </Button>
                  <Button type="button" size="compact" variant="nav" className="border border-white/10" onClick={() => setEditingEvent(event)}>
                    <PencilSimple weight="regular" aria-hidden="true" className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    size="compact"
                    variant="danger"
                    onClick={() => deleteMutation.mutate(event._id)}
                    isLoading={deleteMutation.isPending}
                  >
                    <Trash weight="regular" aria-hidden="true" className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>

              {attendeeEvent?._id === event._id ? (
                <AttendeeList event={event} onClose={() => setAttendeeEvent(null)} />
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function AttendeeList({ event, onClose }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['event-attendees', event._id],
    queryFn: () => bookingsService.event(event._id)
  });
  const bookings = data?.bookings || [];

  return (
    <section className="border-t border-white/[0.08] bg-black/10 px-4 py-4" aria-labelledby={`attendees-${event._id}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h4 id={`attendees-${event._id}`} className="text-sm font-semibold text-slate-100">Attendees</h4>
          <p className="mt-0.5 text-xs text-slate-500">{event.title}</p>
        </div>
        <button type="button" onClick={onClose} className="focus-ring grid h-9 w-9 place-items-center rounded-lg text-slate-400 transition hover:bg-white/[0.06] hover:text-white" aria-label="Close attendee list">
          <X weight="regular" aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>

      {isLoading ? <Skeleton className="mt-4 h-24 !bg-white/5" /> : null}
      {!isLoading && isError ? <p role="alert" className="mt-4 text-sm text-rose-300">Unable to load attendees.</p> : null}
      {!isLoading && !isError && !bookings.length ? <p className="mt-4 text-sm text-slate-500">No confirmed bookings yet.</p> : null}

      {!isLoading && !isError && bookings.length ? (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="border-b border-white/[0.08] text-xs uppercase text-slate-500">
              <tr>
                <th scope="col" className="px-3 py-2.5 font-semibold">Name</th>
                <th scope="col" className="px-3 py-2.5 font-semibold">Email</th>
                <th scope="col" className="px-3 py-2.5 font-semibold">Tickets</th>
                <th scope="col" className="px-3 py-2.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {bookings.map((booking) => (
                <tr key={booking._id} className="text-slate-300">
                  <td className="px-3 py-3 font-medium text-slate-100">{booking.user?.name}</td>
                  <td className="px-3 py-3 text-slate-400">{booking.user?.email}</td>
                  <td className="px-3 py-3">{booking.ticketCount}</td>
                  <td className="px-3 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      booking.checkedIn ? 'bg-teal-400/10 text-teal-200' : 'bg-white/[0.06] text-slate-300'
                    }`}>
                      {booking.checkedIn ? 'Checked in' : booking.bookingStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
