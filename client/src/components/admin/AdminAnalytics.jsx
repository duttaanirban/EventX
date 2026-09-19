import { useQuery } from '@tanstack/react-query';
import { CreditCard, CurrencyInr, UserGear, Users } from '@phosphor-icons/react';
import { analyticsService } from '../../services/analytics.service';
import { formatCurrency } from '../../utils/currency';
import { MetricCard } from '../dashboard/MetricCard';
import { Skeleton } from '../ui/Skeleton';

export function AdminAnalytics() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: analyticsService.admin
  });

  if (isLoading) {
    return (
      <div className="space-y-5" aria-busy="true" aria-label="Loading admin analytics">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-28 !rounded-xl !bg-white/5" />)}
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <Skeleton className="h-44 !rounded-xl !bg-white/5" />
          <Skeleton className="h-44 !rounded-xl !bg-white/5" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div role="alert" className="rounded-xl border border-rose-400/20 bg-rose-950/20 px-5 py-8 text-center text-sm text-rose-100">
        Unable to load platform analytics. Please try again later.
      </div>
    );
  }

  const accountTotal = data.totalUsers + data.totalOrganizers;
  const attendeeShare = accountTotal ? (data.totalUsers / accountTotal) * 100 : 0;
  const organizerShare = accountTotal ? (data.totalOrganizers / accountTotal) * 100 : 0;

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard surface="dashboard" icon={Users} label="Attendee accounts" value={data.totalUsers} tone="brand" />
        <MetricCard surface="dashboard" icon={UserGear} label="Organizer accounts" value={data.totalOrganizers} tone="ember" />
        <MetricCard surface="dashboard" icon={CreditCard} label="Payment records" value={data.totalTransactions} tone="berry" />
        <MetricCard surface="dashboard" icon={CurrencyInr} label="Paid revenue" value={formatCurrency(data.platformRevenue)} tone="slate" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-xl border border-white/[0.08] bg-[#101720] p-5" aria-labelledby="account-composition-title">
          <h2 id="account-composition-title" className="text-base font-semibold text-slate-100">Account composition</h2>
          <p className="mt-1 text-xs text-slate-500">Attendee and organizer accounts currently on the platform</p>
          <div className="mt-6 flex h-2.5 overflow-hidden rounded-full bg-white/[0.06]" aria-hidden="true">
            <span className="bg-teal-400" style={{ width: `${attendeeShare}%` }} />
            <span className="bg-orange-400" style={{ width: `${organizerShare}%` }} />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4">
            <div>
              <p className="flex items-center gap-2 text-xs text-slate-500">
                <span className="h-2 w-2 rounded-full bg-teal-400" aria-hidden="true" />
                Attendees
              </p>
              <p className="mt-1 text-xl font-bold text-white">{data.totalUsers}</p>
            </div>
            <div>
              <p className="flex items-center gap-2 text-xs text-slate-500">
                <span className="h-2 w-2 rounded-full bg-orange-400" aria-hidden="true" />
                Organizers
              </p>
              <p className="mt-1 text-xl font-bold text-white">{data.totalOrganizers}</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-white/[0.08] bg-[#101720] p-5" aria-labelledby="payment-summary-title">
          <h2 id="payment-summary-title" className="text-base font-semibold text-slate-100">Payment summary</h2>
          <p className="mt-1 text-xs text-slate-500">Current payment records and revenue from paid transactions</p>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-white/[0.07] bg-black/10 p-4">
              <p className="text-xs font-medium text-slate-500">Records</p>
              <p className="mt-2 text-xl font-bold text-white">{data.totalTransactions}</p>
            </div>
            <div className="rounded-lg border border-white/[0.07] bg-black/10 p-4">
              <p className="text-xs font-medium text-slate-500">Paid revenue</p>
              <p className="mt-2 break-words text-xl font-bold text-white">{formatCurrency(data.platformRevenue)}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
