import { useState } from 'react';
import { BarChart3, CreditCard, Users } from 'lucide-react';
import { Tabs } from '../../components/dashboard/Tabs';
import { AdminAnalytics } from '../../components/admin/AdminAnalytics';
import { UserManagement } from '../../components/admin/UserManagement';
import { PaymentMonitoring } from '../../components/admin/PaymentMonitoring';

const tabs = [
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'payments', label: 'Payments', icon: CreditCard }
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('analytics');

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-black">Admin dashboard</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Monitor platform health, accounts, organizers, payments, and fraud signals.</p>
        </div>
        <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
      </div>

      {activeTab === 'analytics' ? <AdminAnalytics /> : null}
      {activeTab === 'users' ? <UserManagement /> : null}
      {activeTab === 'payments' ? <PaymentMonitoring /> : null}
    </main>
  );
}
