import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, SealCheck, QrCode, ShieldCheck } from '@phosphor-icons/react';
import { eventsService } from '../services/events.service';
import { EventCard } from '../components/events/EventCard';
import { HeroSection } from '../components/home/HeroSection';
import { Skeleton } from '../components/ui/Skeleton';

const benefits = [
  { icon: ShieldCheck, title: 'Secure payments', copy: 'Razorpay verification, webhooks, refunds, and audit-friendly payment records.' },
  { icon: QrCode, title: 'Fast check-in', copy: 'Encrypted QR tickets prevent duplicate scans and sync attendance in real time.' },
  { icon: SealCheck, title: 'Role-aware SaaS', copy: 'Focused workflows for attendees, organizers, and platform admins.' }
];

export default function LandingPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['featured-events'],
    queryFn: () => eventsService.list({ limit: 3, sort: 'date' })
  });

  return (
    <main>
      <HeroSection />

      <section aria-labelledby="upcoming-events-heading" className="border-t border-white/[0.06] bg-[#080d14] py-10 text-white sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 id="upcoming-events-heading" className="text-2xl font-bold">Upcoming Events</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">Discover and be part of amazing events around you.</p>
            </div>
            <Link to="/events" className="focus-ring inline-flex w-fit shrink-0 items-center gap-2 rounded-md py-2 text-sm font-semibold text-teal-300 transition-colors hover:text-teal-200">
              View all events
              <ArrowRight weight="bold" aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-80" />)
              : data?.events?.map((event) => <EventCard key={event._id} event={event} variant="featured" />)}
          </div>
          {!isLoading && isError ? <p role="alert" className="py-6 text-sm text-slate-400">Unable to load events. Please try again later.</p> : null}
          {!isLoading && !isError && !data?.events?.length ? <p role="status" className="py-6 text-sm text-slate-400">No upcoming events available right now.</p> : null}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        {benefits.map((item) => (
          <div key={item.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <item.icon weight="regular" aria-hidden="true" className="h-8 w-8 text-brand-600" />
            <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.copy}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
