import { useQuery } from '@tanstack/react-query';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { CalendarDots, CurrencyInr, Gauge, Ticket } from '@phosphor-icons/react';
import { analyticsService } from '../../services/analytics.service';
import { formatCurrency } from '../../utils/currency';
import { MetricCard } from '../dashboard/MetricCard';
import { Button } from '../ui/Button';
import { Skeleton } from '../ui/Skeleton';

const tooltipStyle = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  color: 'var(--text)'
};

export function OrganizerAnalytics({ onOpenEvents }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['organizer-analytics'],
    queryFn: analyticsService.organizer
  });

  if (isLoading) {
    return (
      <div className="space-y-5" aria-busy="true" aria-label="Loading organizer analytics">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-28 !rounded-xl !bg-slate-900/5 dark:!bg-white/5" />)}
        </div>
        <div className="grid gap-5 xl:grid-cols-2">
          <Skeleton className="h-80 !rounded-xl !bg-slate-900/5 dark:!bg-white/5" />
          <Skeleton className="h-80 !rounded-xl !bg-slate-900/5 dark:!bg-white/5" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div role="alert" className="rounded-xl border border-rose-400/20 bg-rose-950/20 px-5 py-8 text-center text-sm text-rose-700 dark:text-rose-100">
        Unable to load organizer analytics. Please try again later.
      </div>
    );
  }

  const monthlySales = data.monthlySales || [];
  const popularEvents = data.popularEvents || [];
  const hasAnalytics = monthlySales.length > 0 || popularEvents.length > 0;

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard surface="dashboard" icon={CurrencyInr} label="Total revenue" value={formatCurrency(data.revenue)} tone="brand" />
        <MetricCard surface="dashboard" icon={Ticket} label="Tickets sold" value={data.ticketsSold} tone="ember" />
        <MetricCard surface="dashboard" icon={Gauge} label="Check-in rate" value={`${data.attendancePercentage}%`} tone="berry" detail="Confirmed bookings checked in" />
        <MetricCard surface="dashboard" icon={CalendarDots} label="Tracked events" value={popularEvents.length} tone="slate" />
      </div>

      {!hasAnalytics ? (
        <section className="flex flex-col items-start justify-between gap-5 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#101720] p-5 sm:flex-row sm:items-center" aria-labelledby="analytics-empty-title">
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-400/10 text-teal-700 dark:text-teal-300">
              <CalendarDots weight="duotone" aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <h2 id="analytics-empty-title" className="text-base font-semibold text-slate-900 dark:text-slate-100">Create your first event</h2>
              <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                Revenue, ticket sales, and check-in analytics will appear here once your event starts receiving bookings.
              </p>
            </div>
          </div>
          <Button type="button" variant="accent" className="w-full shrink-0 rounded-xl sm:w-auto" onClick={onOpenEvents}>
            Create event
          </Button>
        </section>
      ) : (
      <div className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#101720] p-4 shadow-[0_12px_34px_rgba(0,0,0,0.16)] sm:p-5" aria-labelledby="revenue-overview-title">
          <div>
            <h2 id="revenue-overview-title" className="text-base font-semibold text-slate-900 dark:text-slate-100">Revenue overview</h2>
            <p className="mt-1 text-xs text-slate-500">Paid transaction revenue grouped by month</p>
          </div>
          {monthlySales.length ? (
            <div className="mt-5 h-56" role="img" aria-label="Monthly paid revenue chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlySales} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="organizerRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.32} />
                      <stop offset="100%" stopColor="#2dd4bf" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(148,163,184,.14)" />
                  <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value) => [formatCurrency(value), 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="var(--chart-accent)" strokeWidth={2.5} fill="url(#organizerRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <ChartEmptyState message="Revenue will appear after your first paid booking." />
          )}
        </section>

        <section className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#101720] p-4 shadow-[0_12px_34px_rgba(0,0,0,0.16)] sm:p-5" aria-labelledby="ticket-sales-title">
          <div>
            <h2 id="ticket-sales-title" className="text-base font-semibold text-slate-900 dark:text-slate-100">Tickets sold</h2>
            <p className="mt-1 text-xs text-slate-500">Current sold inventory by event</p>
          </div>
          {popularEvents.length ? (
            <div className="mt-5 h-56" role="img" aria-label="Tickets sold by event chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={popularEvents} layout="vertical" margin={{ top: 4, right: 8, left: 4, bottom: 0 }}>
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="rgba(148,163,184,.14)" />
                  <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" width={92} tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(45,212,191,0.05)' }} />
                  <Bar dataKey="sold" name="Tickets sold" fill="var(--chart-accent)" radius={[0, 5, 5, 0]} maxBarSize={22} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <ChartEmptyState message="Ticket sales will appear when you create an event." />
          )}
        </section>
      </div>
      )}
    </div>
  );
}

function ChartEmptyState({ message }) {
  return (
    <div className="mt-5 grid h-56 place-items-center rounded-lg border border-dashed border-slate-200 dark:border-white/10 bg-slate-900/5 dark:bg-black/10 px-5 text-center text-sm text-slate-500">
      {message}
    </div>
  );
}
