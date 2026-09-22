import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from '@phosphor-icons/react';
import { eventsService } from '../services/events.service';
import { EventCard } from '../components/events/EventCard';
import { HeroSection } from '../components/home/HeroSection';
import { WhyEventX } from '../components/home/WhyEventX';
import { Skeleton } from '../components/ui/Skeleton';

export default function LandingPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['featured-events'],
    queryFn: () => eventsService.list({ limit: 3, sort: 'date' })
  });

  return (
    <main>
      <HeroSection />

      <section aria-labelledby="upcoming-events-heading" className="border-t border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-[#080d14] py-10 text-slate-900 dark:text-white sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 id="upcoming-events-heading" className="text-2xl font-bold">Upcoming Events</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">Discover and be part of amazing events around you.</p>
            </div>
            <Link to="/events" className="focus-ring inline-flex w-fit shrink-0 items-center gap-2 rounded-md py-2 text-sm font-semibold text-teal-700 dark:text-teal-300 transition-colors hover:text-teal-700 dark:hover:text-teal-200">
              View all events
              <ArrowRight weight="bold" aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-80" />)
              : data?.events?.map((event) => <EventCard key={event._id} event={event} variant="featured" />)}
          </div>
          {!isLoading && isError ? <p role="alert" className="py-6 text-sm text-slate-600 dark:text-slate-400">Unable to load events. Please try again later.</p> : null}
          {!isLoading && !isError && !data?.events?.length ? <p role="status" className="py-6 text-sm text-slate-600 dark:text-slate-400">No upcoming events available right now.</p> : null}
        </div>
      </section>

      <WhyEventX />
    </main>
  );
}
