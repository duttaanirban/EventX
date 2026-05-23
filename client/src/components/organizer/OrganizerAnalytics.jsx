import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, CartesianGrid, LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { analyticsService } from '../../services/analytics.service';
import { formatCurrency } from '../../utils/currency';
import { MetricCard } from '../dashboard/MetricCard';
import { Skeleton } from '../ui/Skeleton';

export function OrganizerAnalytics() {
  const { data, isLoading } = useQuery({ queryKey: ['organizer-analytics'], queryFn: analyticsService.organizer });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-28" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Total revenue" value={formatCurrency(data.revenue)} tone="brand" />
        <MetricCard label="Tickets sold" value={data.ticketsSold} tone="ember" />
        <MetricCard label="Attendance" value={`${data.attendancePercentage}%`} tone="berry" />
        <MetricCard label="Tracked events" value={data.popularEvents?.length || 0} tone="slate" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
          <h2 className="text-lg font-black">Monthly sales</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthlySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.35)" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Line type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
          <h2 className="text-lg font-black">Popular events</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.popularEvents}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.35)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-8} height={70} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sold" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}
