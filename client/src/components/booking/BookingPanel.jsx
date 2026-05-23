import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Minus, Plus, ShieldCheck, Ticket } from 'lucide-react';
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
    <aside className="h-max rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-white/5">
      <p className="text-sm font-semibold text-slate-500">Ticket price</p>
      <p className="mt-1 text-3xl font-black">{formatCurrency(event.ticketPrice)}</p>
      <div className="mt-5 rounded-lg bg-slate-50 p-4 dark:bg-white/5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Tickets</span>
          <div className="flex items-center gap-2">
            <button
              className="focus-ring grid h-9 w-9 place-items-center rounded-lg bg-white shadow-sm disabled:opacity-40 dark:bg-white/10"
              onClick={() => changeCount(ticketCount - 1)}
              disabled={ticketCount <= 1 || isCheckingOut}
              aria-label="Decrease ticket count"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="grid h-9 w-10 place-items-center rounded-lg text-sm font-black">{ticketCount}</span>
            <button
              className="focus-ring grid h-9 w-9 place-items-center rounded-lg bg-white shadow-sm disabled:opacity-40 dark:bg-white/10"
              onClick={() => changeCount(ticketCount + 1)}
              disabled={ticketCount >= maxTickets || isCheckingOut}
              aria-label="Increase ticket count"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 text-sm dark:border-white/10">
          <span>Total</span>
          <span className="text-lg font-black">{formatCurrency(event.ticketPrice * ticketCount)}</span>
        </div>
      </div>
      <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
        <p className="flex items-center gap-2">
          <Ticket className="h-4 w-4 text-brand-600" />
          {event.availableSeats} seats available
        </p>
        <p className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-brand-600" />
          Razorpay secured checkout
        </p>
      </div>
      <Button variant="accent" className="mt-5 w-full" onClick={startCheckout} isLoading={isCheckingOut} disabled={!event.availableSeats}>
        {event.availableSeats ? 'Book tickets' : 'Sold out'}
      </Button>
    </aside>
  );
}
