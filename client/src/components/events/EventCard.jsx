import { Link } from 'react-router-dom';
import { CalendarDays, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';

export function EventCard({ event }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft dark:border-white/10 dark:bg-white/5"
    >
      <Link to={`/events/${event._id}`} className="block">
        <img src={event.bannerImage} alt={event.title} className="h-44 w-full object-cover" loading="lazy" />
        <div className="p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-100">
              {event.category}
            </span>
            <span className="text-sm font-bold text-ink dark:text-white">{formatCurrency(event.ticketPrice)}</span>
          </div>
          <h3 className="mt-3 line-clamp-2 text-lg font-bold">{event.title}</h3>
          <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <p className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-brand-600" />
              {formatDate(event.date)} at {event.time}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-ember" />
              {event.venue}, {event.city}
            </p>
          </div>
          <div className="mt-4 h-2 rounded-full bg-slate-100 dark:bg-white/10">
            <div
              className="h-2 rounded-full bg-brand-600"
              style={{ width: `${Math.max(8, ((event.totalSeats - event.availableSeats) / event.totalSeats) * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-xs font-medium text-slate-500">{event.availableSeats} seats left</p>
        </div>
      </Link>
    </motion.article>
  );
}
