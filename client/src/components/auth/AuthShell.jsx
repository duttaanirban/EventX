import { ThemeToggle } from '../ui/ThemeToggle';
import { Link } from 'react-router-dom';
import { ArrowLeft, QrCode, ShieldCheck, Ticket } from '@phosphor-icons/react';

const benefits = [
  { icon: ShieldCheck, label: 'Secure payments' },
  { icon: QrCode, label: 'QR ticketing' },
  { icon: Ticket, label: 'Simple event management' }
];

export function AuthShell({ children, panelClassName = '', standalone = false }) {
  return (
    <main
      className={`relative flex items-center overflow-hidden bg-slate-50 dark:bg-[#080d14] p-4 text-slate-900 dark:text-white sm:p-6 lg:p-8 ${
        standalone ? 'min-h-dvh' : 'min-h-[calc(100dvh-4.5rem)]'
      }`}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_42rem_18rem_at_18%_0%,rgba(20,184,166,0.13),transparent_70%)]" />
      <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0b1119] shadow-[0_28px_80px_rgba(0,0,0,0.32)] lg:min-h-[680px] lg:grid-cols-[0.9fr_1.1fr]">
        <Link
          to="/"
          className="focus-ring absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 transition hover:bg-slate-900/5 dark:hover:bg-white/[0.05] hover:text-teal-700 dark:hover:text-teal-200 sm:left-5 sm:top-5"
        >
          <ArrowLeft weight="regular" aria-hidden="true" className="h-4 w-4" />
          Back to home
        </Link>
        <ThemeToggle className="absolute right-4 top-4 z-10 sm:right-5 sm:top-5" />
        <aside className="hidden border-r border-slate-200 dark:border-white/[0.08] px-10 py-14 lg:flex lg:flex-col lg:justify-center xl:px-14">
          <Link to="/" className="focus-ring w-max rounded-lg text-2xl font-bold text-slate-900 dark:text-white">
            Event<span className="text-teal-700 dark:text-teal-400">X</span>
          </Link>
          <h1 className="mt-10 max-w-md text-4xl font-bold leading-tight tracking-normal">
            Your events. Your audience. One platform.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-slate-600 dark:text-slate-400">
            Create, manage, and experience events with secure ticketing, payments, and check-in.
          </p>
          <ul className="mt-9 space-y-4">
            {benefits.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-teal-300/10 bg-teal-400/10 text-teal-700 dark:text-teal-300">
                  <Icon weight="duotone" aria-hidden="true" className="h-5 w-5" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </aside>

        <section className="flex items-center justify-center px-5 pb-8 pt-16 sm:px-10 sm:pb-10 sm:pt-16 lg:px-12 lg:py-12">
          <div className={`w-full max-w-md ${panelClassName}`}>
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
