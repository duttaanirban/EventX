import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowRight, BadgeCheck, QrCode, ShieldCheck, Sparkles } from 'lucide-react';
import { eventsService } from '../services/events.service';
import { EventCard } from '../components/events/EventCard';
import { Button } from '../components/ui/Button';
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
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
        <div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-3 py-1 text-sm font-semibold text-brand-700 shadow-sm dark:border-brand-500/20 dark:bg-white/5 dark:text-brand-100">
              <Sparkles className="h-4 w-4" />
              Smart event ticketing for teams that move fast
            </span>
            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-tight tracking-normal text-ink dark:text-white sm:text-6xl">
              EventX
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Launch events, collect payments, issue QR tickets, and run check-in from one polished platform built for real operations.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/events">
                <Button variant="accent" className="w-full sm:w-auto">
                  Browse events
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="ghost" className="w-full sm:w-auto">
                  Start organizing
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678"
            alt="Conference audience at a modern event"
            className="aspect-[4/3] w-full rounded-lg object-cover shadow-soft"
          />
          <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2 rounded-lg bg-white/90 p-3 text-center shadow-soft backdrop-blur dark:bg-[#15171d]/90">
            <div>
              <p className="text-xl font-black">24k</p>
              <p className="text-xs text-slate-500">Tickets</p>
            </div>
            <div>
              <p className="text-xl font-black">98%</p>
              <p className="text-xs text-slate-500">Scan rate</p>
            </div>
            <div>
              <p className="text-xl font-black">3 min</p>
              <p className="text-xs text-slate-500">Setup</p>
            </div>
          </div>
        </div>
      </section>

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
