import { Link } from 'react-router-dom';
import { ArrowRight, BookmarkSimple, CalendarDots, MapPin, Users } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';

export function EventCard({ event, variant = 'default' }) {
  if (variant === 'featured') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="group h-full min-w-0 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#101720] text-slate-900 dark:text-white transition-shadow duration-200 hover:border-teal-400/20 hover:shadow-[0_12px_32px_rgba(0,0,0,0.25)]"
      >
        <Link
          to={`/events/${event._id}`}
          className="focus-ring flex h-full flex-col overflow-hidden rounded-xl transition-transform duration-200 motion-safe:group-hover:-translate-y-1"
        >
          <div className="relative aspect-video shrink-0 overflow-hidden">
            <img
              src={event.bannerImage}
              alt={event.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-105"
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#101720]/80 via-transparent to-black/20" />
            <span className="absolute left-3 top-3 max-w-[calc(100%-4.5rem)] truncate rounded-full border border-teal-300/15 bg-teal-950/85 px-2.5 py-1 text-xs font-semibold text-teal-200 backdrop-blur-md">
              {event.category}
            </span>
            <span aria-hidden="true" className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-black/35 text-white/80 backdrop-blur-md">
              <BookmarkSimple weight="regular" className="h-4 w-4" />
            </span>
          </div>
          <div className="flex flex-1 flex-col p-4">
            <h3 className="min-h-12 break-words line-clamp-2 text-base font-semibold leading-6">{event.title}</h3>
            <div className="mt-3 space-y-2 text-sm leading-5 text-slate-600 dark:text-slate-400">
              <p className="flex items-start gap-2">
                <CalendarDots weight="duotone" aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-teal-700 dark:text-teal-400" />
                <span className="min-w-0 break-words">{formatDate(event.date)} at {event.time}</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin weight="duotone" aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-teal-700 dark:text-teal-400" />
                <span className="min-w-0 break-words">{event.venue}, {event.city}</span>
              </p>
            </div>
            <div className="mt-auto pt-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="break-words text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(event.ticketPrice)}</span>
                <span className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <Users weight="duotone" aria-hidden="true" className="h-4 w-4 shrink-0 text-teal-700 dark:text-teal-400" />
                  {event.availableSeats} seats left
                </span>
              </div>
              <div aria-hidden="true" className="mt-3 h-1 overflow-hidden rounded-full bg-slate-900/5 dark:bg-white/[0.08]">
                <div
                  className="h-1 rounded-full bg-teal-400"
                  style={{ width: `${Math.max(8, ((event.totalSeats - event.availableSeats) / event.totalSeats) * 100)}%` }}
                />
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-200 dark:border-white/[0.06] pt-3 text-sm font-semibold text-teal-700 dark:text-teal-300 group-hover:text-teal-700 dark:group-hover:text-teal-200">
                <span>View Details</span>
                <ArrowRight weight="bold" aria-hidden="true" className="h-4 w-4 shrink-0" />
              </div>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

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
              <CalendarDots weight="regular" aria-hidden="true" className="h-4 w-4 text-brand-600" />
              {formatDate(event.date)} at {event.time}
            </p>
            <p className="flex items-center gap-2">
              <MapPin weight="regular" aria-hidden="true" className="h-4 w-4 text-ember" />
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
