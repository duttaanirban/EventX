import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ArrowCounterClockwise, WarningCircle } from '@phosphor-icons/react';
import { analyticsService } from '../../services/analytics.service';
import { paymentsService } from '../../services/payments.service';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Skeleton } from '../ui/Skeleton';

const riskFor = (payment) => {
  if (payment.paymentStatus === 'failed') return { label: 'High', className: 'bg-rose-400/10 text-rose-700 dark:text-rose-200' };
  if (payment.amount >= 50000 || payment.ticketCount >= 8) return { label: 'Review', className: 'bg-orange-400/10 text-orange-700 dark:text-orange-200' };
  return { label: 'Normal', className: 'bg-teal-400/10 text-teal-700 dark:text-teal-200' };
};

const statusClasses = {
  created: 'bg-sky-400/10 text-sky-700 dark:text-sky-200',
  paid: 'bg-teal-400/10 text-teal-700 dark:text-teal-200',
  failed: 'bg-rose-400/10 text-rose-700 dark:text-rose-200',
  refunded: 'bg-violet-400/10 text-violet-700 dark:text-violet-200'
};

export function PaymentMonitoring() {
  const [status, setStatus] = useState('');
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-payments'],
    queryFn: analyticsService.payments
  });
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
    <section className="overflow-hidden rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#101720]" aria-labelledby="payment-monitoring-title">
      <div className="border-b border-slate-200 dark:border-white/[0.08] p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="payment-monitoring-title" className="text-base font-semibold text-slate-900 dark:text-slate-100">Transactions</h2>
            <p className="mt-1 text-sm text-slate-500">
              {riskCount} {riskCount === 1 ? 'transaction needs' : 'transactions need'} review based on amount, quantity, or failure state.
            </p>
          </div>
          <Select
            tone="dark"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            aria-label="Payment status filter"
            className="sm:min-w-48"
          >
            <option value="">All statuses</option>
            <option value="created">Created</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </Select>
        </div>
      </div>

      {isLoading ? <Skeleton className="m-5 h-80 !bg-slate-900/5 dark:!bg-white/5" /> : null}
      {!isLoading && isError ? (
        <div role="alert" className="m-5 rounded-xl border border-rose-400/20 bg-rose-950/20 p-5 text-center text-sm text-rose-700 dark:text-rose-100">
          Unable to load payment records.
        </div>
      ) : null}

      {!isLoading && !isError ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[68rem] text-left text-sm">
            <thead className="border-b border-slate-200 dark:border-white/[0.08] bg-slate-900/5 dark:bg-black/10 text-xs uppercase text-slate-500">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">Transaction</th>
                <th scope="col" className="px-4 py-3 font-semibold">Buyer</th>
                <th scope="col" className="px-4 py-3 font-semibold">Event</th>
                <th scope="col" className="px-4 py-3 font-semibold">Amount</th>
                <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                <th scope="col" className="px-4 py-3 font-semibold">Risk</th>
                <th scope="col" className="px-5 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/[0.06]">
              {filteredPayments.map((payment) => {
                const risk = riskFor(payment);
                const isRefunding = refundMutation.isPending && refundMutation.variables === payment._id;

                return (
                  <tr key={payment._id} className="text-slate-600 dark:text-slate-300 transition hover:bg-slate-900/5 dark:hover:bg-white/[0.025]">
                    <td className="px-5 py-3.5">
                      <p className="max-w-52 truncate font-sans text-xs font-semibold text-slate-700 dark:text-slate-200" title={payment.razorpayOrderId}>
                        {payment.razorpayOrderId}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">{formatDate(payment.createdAt)}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-slate-900 dark:text-slate-100">{payment.user?.name}</p>
                      <p className="mt-0.5 max-w-52 truncate text-xs text-slate-500">{payment.user?.email}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="max-w-52 truncate text-slate-700 dark:text-slate-200">{payment.event?.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{payment.ticketCount} {payment.ticketCount === 1 ? 'ticket' : 'tickets'}</p>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(payment.amount)}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusClasses[payment.paymentStatus] || 'bg-slate-900/5 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300'}`}>
                        {payment.paymentStatus}
                      </span>
                      {payment.failureReason ? <p className="mt-1.5 max-w-44 text-xs leading-4 text-rose-700 dark:text-rose-300">{payment.failureReason}</p> : null}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${risk.className}`}>
                        {risk.label !== 'Normal' ? <WarningCircle weight="regular" aria-hidden="true" className="h-3.5 w-3.5" /> : null}
                        {risk.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Button
                        type="button"
                        size="compact"
                        variant="nav"
                        className="border border-slate-200 dark:border-white/10"
                        disabled={payment.paymentStatus !== 'paid'}
                        isLoading={isRefunding}
                        onClick={() => refundMutation.mutate(payment._id)}
                      >
                        <ArrowCounterClockwise weight="regular" aria-hidden="true" className="h-4 w-4" />
                        Refund
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {!filteredPayments.length ? (
            <div className="py-12 text-center text-sm text-slate-500">No payments match this filter.</div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
