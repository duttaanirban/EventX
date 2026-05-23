import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Edit, Plus, Trash2, Users } from 'lucide-react';
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
  const { data, isLoading } = useQuery({ queryKey: ['organizer-events'], queryFn: eventsService.mine });
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
          <h2 className="text-2xl font-black">Events</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Create, update, and monitor your event inventory.</p>
        </div>
        <Button variant="accent" onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4" />
          New event
        </Button>
      </div>

      {isCreating ? (
        <EventForm onSubmit={(values) => createMutation.mutate(values)} onCancel={() => setIsCreating(false)} isSubmitting={createMutation.isPending} />
      ) : null}

      {editingEvent ? (
        <EventForm
          event={editingEvent}
          onSubmit={(values) => updateMutation.mutate({ id: editingEvent._id, payload: values })}
          onCancel={() => setEditingEvent(null)}
          isSubmitting={updateMutation.isPending}
        />
      ) : null}

      {isLoading ? Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-28" />) : null}
      {!isLoading && !events.length ? <EmptyState title="No events created" description="Create your first event to start selling tickets." /> : null}

      <div className="grid gap-4">
        {events.map((event) => (
          <article key={event._id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="grid gap-4 md:grid-cols-[8rem_1fr_auto] md:items-center">
              <img src={event.bannerImage} alt={event.title} className="h-28 w-full rounded-lg object-cover md:w-32" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-brand-700 dark:text-brand-100">{event.category}</p>
                <h3 className="mt-1 text-lg font-black">{event.title}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {formatDate(event.date)} · {event.city} · {formatCurrency(event.ticketPrice)}
                </p>
                <p className="mt-2 text-sm font-semibold">{event.totalSeats - event.availableSeats} sold · {event.availableSeats} available</p>
              </div>
              <div className="flex flex-wrap gap-2 md:justify-end">
                <Button variant="ghost" onClick={() => setAttendeeEvent(event)}>
                  <Users className="h-4 w-4" />
                  Attendees
                </Button>
                <Button variant="ghost" onClick={() => setEditingEvent(event)}>
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button variant="danger" onClick={() => deleteMutation.mutate(event._id)} isLoading={deleteMutation.isPending}>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
            {attendeeEvent?._id === event._id ? <AttendeeList event={event} onClose={() => setAttendeeEvent(null)} /> : null}
          </article>
        ))}
      </div>
    </div>
  );
}

function AttendeeList({ event, onClose }) {
  const { data, isLoading } = useQuery({
    queryKey: ['event-attendees', event._id],
    queryFn: () => bookingsService.event(event._id)
  });
  const bookings = data?.bookings || [];

  return (
    <div className="mt-4 border-t border-slate-200 pt-4 dark:border-white/10">
      <div className="flex items-center justify-between">
        <h4 className="font-black">Attendees</h4>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>
      {isLoading ? <Skeleton className="mt-3 h-24" /> : null}
      {!isLoading && !bookings.length ? <p className="mt-3 text-sm text-slate-500">No confirmed bookings yet.</p> : null}
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead className="text-xs uppercase text-slate-500">
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Email</th>
              <th className="py-2">Tickets</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/10">
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td className="py-3 font-semibold">{booking.user?.name}</td>
                <td className="py-3 text-slate-600 dark:text-slate-300">{booking.user?.email}</td>
                <td className="py-3">{booking.ticketCount}</td>
                <td className="py-3">{booking.checkedIn ? 'Checked in' : booking.bookingStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
