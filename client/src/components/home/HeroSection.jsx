import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CreditCard, QrCode, Sparkles, Ticket, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { HeroFeature } from './HeroFeature';
import { HeroStats } from './HeroStats';

const features = [
  { icon: Ticket, title: 'Easy Ticketing', copy: 'Sell tickets in minutes' },
  { icon: CreditCard, title: 'Secure Payments', copy: 'Powered by Razorpay' },
  { icon: QrCode, title: 'QR Check-in', copy: 'Fast & contactless' },
  { icon: Users, title: 'Built for Everyone', copy: 'From meetups to conferences' }
];

export function HeroSection() {
  const { user } = useAuth();
  const createEventPath = user?.role === 'organizer' || user?.role === 'admin' ? '/organizer' : '/register';

  return (
    <section className="relative isolate overflow-hidden bg-[#060a10] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(20,184,166,0.13),transparent_55%),radial-gradient(ellipse_at_82%_50%,rgba(6,182,212,0.15),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative mx-auto grid min-h-[calc(100dvh-4.5rem-1px)] max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 sm:py-12 lg:grid-cols-2 lg:gap-6 lg:px-8 lg:py-12">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1.5 text-sm font-semibold text-teal-200">
            <Sparkles className="h-4 w-4" />
            Smarter Event Experiences
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.08] tracking-normal text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            Bring People Together with{' '}
            <span className="bg-gradient-to-r from-teal-200 via-teal-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(45,212,191,0.18)]">EventX</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            Create, manage, and attend amazing events. Sell tickets, handle payments, issue QR passes, and deliver unforgettable experiences - all in one platform.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/events">
              <Button variant="accent" className="w-full sm:w-auto">
                Browse Events
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to={createEventPath}>
              <Button variant="outline" className="w-full sm:w-auto">Create an Event</Button>
            </Link>
          </div>
          <div className="mt-8 grid max-w-lg gap-x-4 gap-y-5 sm:grid-cols-2">
            {features.map((feature) => <HeroFeature key={feature.title} {...feature} />)}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="relative mx-auto w-full max-w-2xl lg:max-w-none"
        >
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-2 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
            <div className="relative overflow-hidden rounded-xl">
              <img
                src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678"
                alt="A large audience attending a modern EventX conference"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05080d] via-transparent to-black/10" />
              <div className="absolute inset-x-4 bottom-4 sm:inset-x-5 sm:bottom-5">
                <HeroStats />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
