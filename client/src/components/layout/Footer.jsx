import { Link } from 'react-router-dom';
import { CalendarDots } from '@phosphor-icons/react';

const columns = [
  {
    title: 'Product',
    items: [
      { label: 'Events', to: '/events' },
      { label: 'Organize', to: '/organizer' },
      { label: 'Tickets', to: '/bookings' },
      { label: 'Check-in' }
    ]
  },
  { title: 'Company', items: [{ label: 'About' }, { label: 'Contact' }, { label: 'Careers' }] },
  { title: 'Resources', items: [{ label: 'Help Center' }, { label: 'Documentation' }, { label: 'Privacy' }, { label: 'Terms' }] }
];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#05090f] pb-6 pt-12 text-slate-400 sm:pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="sm:col-span-3 lg:col-span-1">
            <Link to="/" aria-label="EventX home" className="focus-ring inline-flex items-center gap-2.5 rounded-lg text-xl font-black tracking-normal text-white">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-500 text-[#041311]">
                <CalendarDots weight="regular" aria-hidden="true" className="h-5 w-5" />
              </span>
              EventX
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6">Create, manage, and experience better events with EventX.</p>
          </div>
          {columns.map(({ title, items }) => (
            <div key={title} className="min-w-0">
              <h2 className="text-sm font-semibold text-white">{title}</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6">
                {items.map(({ label, to }) => (
                  <li key={label}>
                    {to ? (
                      <Link to={to} className="focus-ring rounded-sm transition-colors hover:text-teal-300">{label}</Link>
                    ) : (
                      <span>{label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-white/[0.06] pt-6 text-xs leading-5 sm:mt-12">
          <p>&copy; {new Date().getFullYear()} EventX</p>
        </div>
      </div>
    </footer>
  );
}
