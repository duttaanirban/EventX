import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Minus, Plus, ShieldCheck, Ticket } from '@phosphor-icons/react';
import { bookingsService } from '../../services/bookings.service';
import { paymentsService } from '../../services/payments.service';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/currency';
import { loadRazorpay } from '../../utils/razorpay';
import { Button } from '../ui/Button';

export function BookingPanel({ event }) {
  const [ticketCount, setTicketCount] = useState(1);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const maxTickets = Math.min(10, event.availableSeats);
  const soldSeats = Math.max(event.totalSeats - event.availableSeats, 0);
  const soldPercentage = event.totalSeats ? Math.min((soldSeats / event.totalSeats) * 100, 100) : 0;
  const ticketPrice = event.ticketPrice ? formatCurrency(event.ticketPrice) : 'Free';
  const totalPrice = event.ticketPrice ? formatCurrency(event.ticketPrice * ticketCount) : 'Free';

  const changeCount = (nextValue) => {
    setTicketCount(Math.max(1, Math.min(maxTickets || 1, nextValue)));
  };

  const startCheckout = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/events/${event._id}` } } });
      return;
    }

    setIsCheckingOut(true);
    try {
      await bookingsService.intent({ eventId: event._id, ticketCount });
      const order = await paymentsService.createOrder({ eventId: event._id, ticketCount });
      await loadRazorpay();

      const checkout = new window.Razorpay({
        key: order.key || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'EventX',
        description: event.title,
        order_id: order.orderId,
        prefill: {
          name: user.name,
          email: user.email
        },
        theme: {
          color: '#0d9488'
        },
        handler: async (response) => {
          const { booking } = await paymentsService.verify(response);
          toast.success('Booking confirmed. Your QR ticket is ready.');
          navigate('/bookings', { state: { bookingId: booking._id } });
        },
        modal: {
          ondismiss: () => toast('Checkout closed before payment completion')
        }
      });

      checkout.on('payment.failed', (response) => {
        toast.error(response.error?.description || 'Payment failed');
      });
      checkout.open();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Unable to start checkout');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <aside className="h-max rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111a24] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.28)] sm:p-6 lg:sticky lg:top-24" aria-labelledby="booking-panel-title">
      <p id="booking-panel-title" className="text-sm font-semibold text-slate-600 dark:text-slate-400">Ticket price</p>
      <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">{ticketPrice}</p>

      <div className="mt-6 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-900/5 dark:bg-black/15 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Tickets</p>
            <p className="mt-0.5 text-xs text-slate-500">Up to {maxTickets || 1} per booking</p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5" aria-label="Ticket quantity selector">
            <button
              type="button"
              className="focus-ring grid h-9 w-9 place-items-center rounded-lg border border-slate-200 dark:border-white/10 bg-slate-900/5 dark:bg-white/[0.06] text-slate-700 dark:text-slate-200 transition hover:border-teal-400/40 hover:bg-teal-400/10 hover:text-teal-700 dark:hover:text-teal-200 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => changeCount(ticketCount - 1)}
              disabled={ticketCount <= 1 || isCheckingOut}
              aria-label="Decrease ticket count"
            >
              <Minus weight="bold" aria-hidden="true" className="h-4 w-4" />
            </button>
            <output className="grid h-9 w-10 place-items-center text-sm font-bold text-slate-900 dark:text-white" aria-label={`${ticketCount} tickets`}>
              {ticketCount}
            </output>
            <button
              type="button"
              className="focus-ring grid h-9 w-9 place-items-center rounded-lg border border-slate-200 dark:border-white/10 bg-slate-900/5 dark:bg-white/[0.06] text-slate-700 dark:text-slate-200 transition hover:border-teal-400/40 hover:bg-teal-400/10 hover:text-teal-700 dark:hover:text-teal-200 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => changeCount(ticketCount + 1)}
              disabled={ticketCount >= maxTickets || isCheckingOut}
              aria-label="Increase ticket count"
            >
              <Plus weight="bold" aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-5 space-y-3 border-t border-slate-200 dark:border-white/[0.08] pt-4 text-sm">
          <div className="flex items-center justify-between gap-3 text-slate-600 dark:text-slate-400">
            <span>{ticketPrice} x {ticketCount}</span>
            <span>{ticketCount} {ticketCount === 1 ? 'ticket' : 'tickets'}</span>
          </div>
          <div className="flex items-end justify-between gap-3">
            <span className="font-semibold text-slate-700 dark:text-slate-200">Total</span>
            <span className="text-xl font-bold text-slate-900 dark:text-white">{totalPrice}</span>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <Ticket weight="duotone" aria-hidden="true" className="h-4 w-4 text-teal-700 dark:text-teal-300" />
            Availability
          </span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">{event.availableSeats} seats available</span>
        </div>
        {event.totalSeats ? (
          <div
            className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-900/5 dark:bg-white/[0.07]"
            role="progressbar"
            aria-label="Seats sold"
            aria-valuemin="0"
            aria-valuemax={event.totalSeats}
            aria-valuenow={soldSeats}
          >
            <div className="h-full rounded-full bg-teal-400 transition-[width] duration-300" style={{ width: `${soldPercentage}%` }} />
          </div>
        ) : null}
      </div>

      <Button
        type="button"
        variant="accent"
        className="mt-6 h-12 w-full rounded-xl"
        onClick={startCheckout}
        isLoading={isCheckingOut}
        disabled={!event.availableSeats}
      >
        {!isCheckingOut ? <Ticket weight="bold" aria-hidden="true" className="h-4 w-4" /> : null}
        {event.availableSeats ? 'Book tickets' : 'Sold out'}
      </Button>

      <p className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
        <ShieldCheck weight="duotone" aria-hidden="true" className="h-4 w-4 text-teal-700 dark:text-teal-400" />
        Secure payment powered by Razorpay
      </p>
    </aside>
  );
}
