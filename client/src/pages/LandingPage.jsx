import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BadgeCheck, QrCode, ShieldCheck } from 'lucide-react';
import { eventsService } from '../services/events.service';
import { EventCard } from '../components/events/EventCard';
import { HeroSection } from '../components/home/HeroSection';
import { Skeleton } from '../components/ui/Skeleton';

const benefits = [
  { icon: ShieldCheck, title: 'Secure payments', copy: 'Razorpay verification, webhooks, refunds, and audit-friendly payment records.' },
  { icon: QrCode, title: 'Fast check-in', copy: 'Encrypted QR tickets prevent duplicate scans and sync attendance in real time.' },
  { icon: BadgeCheck, title: 'Role-aware SaaS', copy: 'Focused workflows for attendees, organizers, and platform admins.' }
];

export default function LandingPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['featured-events'],
    queryFn: () => eventsService.list({ limit: 3, sort: 'date' })
  });

  return (
    <main>
      <HeroSection />

      <section className="bg-white py-16 dark:bg-white/[0.03]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-3xl font-black">Featured events</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">Discover what is selling now.</p>
            </div>
            <Link to="/events" className="text-sm font-bold text-brand-700 dark:text-brand-100">
              View all events
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {isLoading
              ? Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-80" />)
              : data?.events?.map((event) => <EventCard key={event._id} event={event} />)}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        {benefits.map((item) => (
          <div key={item.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <item.icon className="h-8 w-8 text-brand-600" />
            <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.copy}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
