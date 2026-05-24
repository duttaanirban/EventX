import { useQuery } from '@tanstack/react-query';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { analyticsService } from '../../services/analytics.service';
import { formatCurrency } from '../../utils/currency';
import { MetricCard } from '../dashboard/MetricCard';
import { Skeleton } from '../ui/Skeleton';

const colors = ['#0d9488', '#f97316', '#be123c'];

export function AdminAnalytics() {
  const { data, isLoading } = useQuery({ queryKey: ['admin-analytics'], queryFn: analyticsService.admin });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-28" />)}
      </div>
    );
  }

  const chartData = [
    { name: 'Users', value: data.totalUsers },
    { name: 'Organizers', value: data.totalOrganizers },
    { name: 'Transactions', value: data.totalTransactions }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Users" value={data.totalUsers} tone="brand" />
        <MetricCard label="Organizers" value={data.totalOrganizers} tone="ember" />
        <MetricCard label="Transactions" value={data.totalTransactions} tone="berry" />
        <MetricCard label="Platform revenue" value={formatCurrency(data.platformRevenue)} tone="slate" />
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
        <h2 className="text-lg font-black">Platform mix</h2>
        <div className="mt-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={4}>
                {chartData.map((entry, index) => (
                  <Cell key={entry.name} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
