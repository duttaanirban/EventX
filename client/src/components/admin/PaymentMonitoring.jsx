import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { analyticsService } from '../../services/analytics.service';
import { paymentsService } from '../../services/payments.service';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Skeleton } from '../ui/Skeleton';

const riskFor = (payment) => {
  if (payment.paymentStatus === 'failed') return { label: 'High', className: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-100' };
  if (payment.amount >= 50000 || payment.ticketCount >= 8) return { label: 'Review', className: 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-100' };
  return { label: 'Normal', className: 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-100' };
};

export function PaymentMonitoring() {
  const [status, setStatus] = useState('');
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['admin-payments'], queryFn: analyticsService.payments });
  const payments = data?.payments || [];

  const refundMutation = useMutation({
    mutationFn: paymentsService.refund,
    onSuccess: () => {
      toast.success('Payment marked as refunded');
      queryClient.invalidateQueries({ queryKey: ['admin-payments'] });
      queryClient.invalidateQueries({ queryKey: ['admin-analytics'] });
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Unable to refund payment')
  });

  const filteredPayments = useMemo(
    () => payments.filter((payment) => !status || payment.paymentStatus === status),
    [payments, status]
  );

  const riskCount = payments.filter((payment) => ['High', 'Review'].includes(riskFor(payment).label)).length;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-black">Payments and fraud monitoring</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{riskCount} transaction(s) need review based on amount, quantity, or failure state.</p>
        </div>
        <Select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Payment status filter" className="sm:max-w-48">
          <option value="">All statuses</option>
          <option value="created">Created</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </Select>
      </div>

      {isLoading ? <Skeleton className="mt-5 h-80" /> : null}
      {!isLoading ? (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[60rem] text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr>
                <th className="py-3">Transaction</th>
                <th className="py-3">Buyer</th>
                <th className="py-3">Event</th>
                <th className="py-3">Amount</th>
                <th className="py-3">Status</th>
                <th className="py-3">Risk</th>
                <th className="py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/10">
              {filteredPayments.map((payment) => {
                const risk = riskFor(payment);
                return (
                  <tr key={payment._id}>
                    <td className="py-3">
                      <p className="font-bold">{payment.razorpayOrderId}</p>
                      <p className="text-xs text-slate-500">{formatDate(payment.createdAt)}</p>
                    </td>
                    <td className="py-3">
                      <p className="font-semibold">{payment.user?.name}</p>
                      <p className="text-slate-500">{payment.user?.email}</p>
                    </td>
                    <td className="py-3">{payment.event?.title}</td>
                    <td className="py-3 font-bold">{formatCurrency(payment.amount)}</td>
                    <td className="py-3 capitalize">{payment.paymentStatus}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${risk.className}`}>
                        {risk.label !== 'Normal' ? <AlertTriangle className="h-3.5 w-3.5" /> : null}
                        {risk.label}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Button
                        variant="ghost"
                        disabled={payment.paymentStatus !== 'paid'}
                        isLoading={refundMutation.isPending}
                        onClick={() => refundMutation.mutate(payment._id)}
                      >
                        <RotateCcw className="h-4 w-4" />
                        Refund
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!filteredPayments.length ? <p className="py-10 text-center text-sm text-slate-500">No payments match this filter.</p> : null}
        </div>
      ) : null}
    </section>
  );
}
