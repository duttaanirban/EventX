import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight, CalendarDots, CalendarPlus, ChartLineUp, CheckCircle,
  CreditCard, FlowArrow, Lightning, MagnifyingGlass, QrCode,
  ShieldCheck, Ticket, Users, UsersThree
} from '@phosphor-icons/react';
import { useAuth } from '../context/AuthContext';
import { HeroFeature } from '../components/home/HeroFeature';

const purposes = [
  { icon: MagnifyingGlass, title: 'Discover Events', copy: 'Find events by category, city, and interest, with the soonest events first.' },
  { icon: CalendarPlus, title: 'Organize With Ease', copy: 'Create events, manage attendees, monitor ticket sales, and track performance.' },
  { icon: Ticket, title: 'Better Event Experiences', copy: 'Secure booking, digital tickets, QR check-in, and simple attendee workflows.' }
];

const capabilities = [
  { icon: MagnifyingGlass, title: 'Event Discovery', copy: 'Browse events by category and city, sort by date or price, and view ticket availability.' },
  { icon: Ticket, title: 'Secure Ticket Booking', copy: 'Book tickets and manage your bookings through a simple attendee experience.' },
  { icon: CreditCard, title: 'Razorpay Payments', copy: 'Pay securely for tickets through Razorpay, with payment verification built into booking.' },
  { icon: QrCode, title: 'QR Check-in', copy: 'Access digital QR tickets and validate them at the door for faster attendee check-ins.' },
  { icon: ChartLineUp, title: 'Organizer Analytics', copy: 'Track event performance, bookings, revenue, and attendance from your dashboard.' },
  { icon: ShieldCheck, title: 'Platform Administration', copy: 'Manage users, monitor payments, and review platform-level analytics from the admin console.' }
];

const roles = [
  { icon: Users, label: 'Attendees', title: 'For Attendees', items: ['Discover events', 'Book tickets', 'Manage bookings', 'Access QR tickets', 'Experience faster check-in'] },
  { icon: CalendarDots, label: 'Organizers', title: 'For Organizers', items: ['Create and manage events', 'Track ticket sales', 'View analytics', 'Manage attendees', 'Scan QR tickets'] },
  { icon: ShieldCheck, label: 'Admins', title: 'For Administrators', items: ['Manage users', 'Monitor payments', 'Review platform analytics', 'Oversee platform operations'] }
];

const technologies = ['React', 'Vite', 'Tailwind CSS', 'TanStack Query', 'Phosphor Icons', 'Framer Motion', 'Recharts', 'Node.js', 'Express', 'MongoDB', 'Razorpay', 'Socket.IO'];
const highlights = [
  { icon: FlowArrow, title: 'Unified workflow', copy: 'From discovery to check-in.' },
  { icon: Lightning, title: 'Real-time operations', copy: 'Live availability and check-in updates.' },
  { icon: UsersThree, title: 'Role-based experience', copy: 'Tools that fit your part in the event.' }
];
const container = 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8';
const card = 'min-w-0 rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/[0.08] dark:bg-[#101923]';
const muted = 'text-sm leading-6 text-slate-600 dark:text-slate-400';
const heading = 'text-2xl font-bold tracking-normal sm:text-3xl';
const linkButton = 'focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition duration-200';

function FeatureIcon({ icon: Icon }) {
  return (
    <span className="inline-grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-teal-300/15 bg-teal-400/10 text-teal-700 dark:text-teal-300">
      <Icon weight="duotone" aria-hidden="true" className="h-6 w-6" />
    </span>
  );
}

export default function AboutPage() {
  const { user } = useAuth();
  const reduceMotion = useReducedMotion();
  const createEventPath = user?.role === 'organizer' || user?.role === 'admin' ? '/organizer' : '/register';

  return (
    <main className="bg-slate-50 text-slate-900 dark:bg-[#080d14] dark:text-white">
      <section aria-labelledby="about-heading" className="relative isolate overflow-hidden border-b border-slate-200 dark:border-white/[0.06] dark:bg-[#060a10]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(20,184,166,0.14),transparent_70%)]" />
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className={`${container} py-12 text-center sm:py-16`}
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-200">
            <CalendarDots weight="duotone" aria-hidden="true" className="h-4 w-4" />
            About EventX
          </p>
          <h1 id="about-heading" className="mx-auto mt-5 max-w-4xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
            Making Events Easier to{' '}
            <span className="bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-700 bg-clip-text text-transparent dark:from-teal-200 dark:via-teal-300 dark:to-cyan-300">Create, Manage, and Experience</span>
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
            EventX is an event management and ticketing platform designed to bring attendees, organizers, and administrators into one seamless experience.
          </p>
          <p className={`mx-auto mt-3 max-w-3xl ${muted}`}>
            From discovering events and booking tickets to secure payments, QR-based check-ins, event management, and platform analytics, EventX brings the complete event workflow into one place.
          </p>
        </motion.div>
      </section>

      <section aria-labelledby="purpose-heading" className={`${container} py-10 sm:py-12`}>
        <div className="max-w-3xl">
          <h2 id="purpose-heading" className={heading}>Our Purpose</h2>
          <p className={`mt-3 ${muted}`}>
            Planning and attending events often involves multiple disconnected tools for registration, payments, ticketing, communication, and check-in. EventX aims to simplify that process by providing a unified platform for the complete event lifecycle.
          </p>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {purposes.map((purpose) => (
            <div key={purpose.title} className={card}><HeroFeature {...purpose} /></div>
          ))}
        </div>
      </section>

      <section aria-labelledby="capabilities-heading" className="border-y border-slate-200 bg-slate-100 py-10 dark:border-white/[0.06] dark:bg-[#0a1018] sm:py-12">
        <div className={container}>
          <h2 id="capabilities-heading" className={heading}>Built for the Complete Event Journey</h2>
          <p className={`mt-3 ${muted}`}>The tools to move from finding an event to welcoming people through the door.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map(({ icon, title, copy }) => (
              <article key={title} className={`${card} transition duration-200 hover:border-teal-400/30 motion-safe:hover:-translate-y-1`}>
                <FeatureIcon icon={icon} />
                <h3 className="mt-4 text-base font-semibold">{title}</h3>
                <p className={`mt-2 ${muted}`}>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="roles-heading" className={`${container} py-10 sm:py-12`}>
        <h2 id="roles-heading" className={heading}>One Platform. Three Experiences.</h2>
        <p className={`mt-3 ${muted}`}>A shared event journey, with the right tools for each role.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map(({ icon, label, title, items }) => (
            <article key={label} className={card}>
              <div className="flex items-center gap-3">
                <FeatureIcon icon={icon} />
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-700 dark:text-teal-300">{label}</p>
              </div>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <ul className="mt-4 space-y-3">
                {items.map((item) => (
                  <li key={item} className={`flex items-start gap-2 ${muted}`}>
                    <CheckCircle weight="regular" aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-teal-700 dark:text-teal-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="technology-heading" className={`${container} pb-10 sm:pb-12`}>
        <div className="rounded-2xl border border-slate-200 bg-slate-100 p-6 dark:border-white/[0.08] dark:bg-white/[0.02] sm:p-8">
          <h2 id="technology-heading" className="text-xl font-bold sm:text-2xl">Built With Modern Technology</h2>
          <p className={`mt-2 ${muted}`}>A connected stack supporting the interface, event data, payments, and live updates.</p>
          <ul aria-label="EventX technology stack" className="mt-5 flex flex-wrap gap-2">
            {technologies.map((technology) => (
              <li key={technology} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">{technology}</li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="lifecycle-heading" className={`${container} pb-10 sm:pb-12`}>
        <div className="max-w-3xl">
          <h2 id="lifecycle-heading" className={heading}>Designed Around the Entire Event Lifecycle</h2>
          <p className={`mt-3 ${muted}`}>
            Instead of treating event discovery, booking, payments, check-in, and management as separate experiences, EventX connects them into one workflow. This makes the platform useful for everyone involved in an event — from the person discovering it to the organizer running it.
          </p>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((highlight) => <HeroFeature key={highlight.title} {...highlight} />)}
        </div>
      </section>

      <section aria-labelledby="about-cta-heading" className={`${container} pb-12 sm:pb-16`}>
        <div className="rounded-2xl border border-teal-500/20 bg-teal-500/[0.06] px-6 py-9 text-center sm:px-10 sm:py-10">
          <h2 id="about-cta-heading" className={heading}>Ready to Experience EventX?</h2>
          <p className={`mt-3 ${muted}`}>Discover upcoming events or start creating your own.</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/events" className={`${linkButton} bg-teal-500 text-[#031513] shadow-[0_8px_24px_rgba(20,184,166,0.18)] hover:bg-teal-400`}>
              Explore Events <ArrowRight weight="bold" aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link to={createEventPath} className={`${linkButton} border border-slate-200 bg-slate-900/5 hover:border-teal-400/40 hover:bg-teal-400/10 dark:border-white/15 dark:bg-white/[0.04]`}>
              <CalendarPlus weight="regular" aria-hidden="true" className="h-4 w-4" /> Create an Event
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
