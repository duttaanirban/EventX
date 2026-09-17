import { ChartLineUp, CreditCard, QrCode, UsersThree } from '@phosphor-icons/react';

const features = [
  {
    icon: CreditCard,
    title: 'Secure Payments',
    description: 'Accept payments with confidence using Razorpay-powered transactions, verification, refunds, and reliable payment tracking.'
  },
  {
    icon: QrCode,
    title: 'Fast QR Check-in',
    description: 'Scan encrypted QR tickets in seconds and keep attendance synchronized in real time.'
  },
  {
    icon: UsersThree,
    title: 'Built for Every Role',
    description: 'Purpose-built workflows for attendees, organizers, and platform administrators.'
  },
  {
    icon: ChartLineUp,
    title: 'Real-time Insights',
    description: 'Track ticket sales, attendance, revenue, and event performance from one place.'
  }
];

export function WhyEventX() {
  return (
    <section aria-labelledby="why-eventx-heading" className="border-t border-white/[0.06] bg-[#0a1018] py-12 text-white sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 id="why-eventx-heading" className="text-2xl font-bold">Why EventX</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">Everything you need to create, manage, and scale memorable events.</p>
        </div>
        <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="group relative isolate h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101923] p-6 transition duration-200 hover:border-teal-400/20 hover:shadow-[0_12px_32px_rgba(0,0,0,0.2)] motion-safe:hover:-translate-y-1"
            >
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(20,184,166,0.12),transparent_75%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-teal-300/15 bg-teal-400/10 text-teal-300">
                <Icon weight="duotone" aria-hidden="true" className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-base font-semibold leading-6">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
