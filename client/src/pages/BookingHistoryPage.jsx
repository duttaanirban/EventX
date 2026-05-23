import { useQuery } from '@tanstack/react-query';
import { bookingsService } from '../services/bookings.service';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { formatDate } from '../utils/date';

export default function BookingHistoryPage() {
  const { data, isLoading } = useQuery({ queryKey: ['my-bookings'], queryFn: bookingsService.mine });
  const bookings = data?.bookings || [];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black">My tickets</h1>
      <div className="mt-6 space-y-4">
        {isLoading ? Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-32" />) : null}
        {!isLoading && !bookings.length ? <EmptyState title="No tickets yet" description="Book an event and your QR tickets will appear here." /> : null}
        {bookings.map((booking) => (
          <article key={booking._id} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5 sm:grid-cols-[1fr_8rem]">
            <div>
              <h2 className="text-lg font-bold">{booking.event?.title}</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{formatDate(booking.event?.date)} · {booking.ticketCount} ticket(s)</p>
              <p className="mt-2 text-sm font-semibold text-brand-700 dark:text-brand-100">{booking.checkedIn ? 'Checked in' : booking.bookingStatus}</p>
            </div>
            {booking.qrCode ? <img src={booking.qrCode} alt={`QR ticket for ${booking.event?.title}`} className="h-32 w-32 rounded-lg bg-white p-2" /> : null}
          </article>
        ))}
      </div>
    </main>
  );
}
