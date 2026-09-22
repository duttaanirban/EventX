import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  House,
  List,
  SignOut,
  SquaresFour,
  Users,
  X
} from '@phosphor-icons/react';
import { useAuth } from '../../context/AuthContext';
import { AdminAnalytics } from '../../components/admin/AdminAnalytics';
import { UserManagement } from '../../components/admin/UserManagement';
import { PaymentMonitoring } from '../../components/admin/PaymentMonitoring';

const sections = [
  { id: 'analytics', label: 'Overview', icon: SquaresFour },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'payments', label: 'Payments', icon: CreditCard }
];

const sectionMeta = {
  analytics: {
    title: 'Admin Dashboard',
    description: 'Monitor users, payments, and platform performance.'
  },
  users: {
    title: 'User Management',
    description: 'Review accounts, manage roles, and control platform access.'
  },
  payments: {
    title: 'Payment Monitoring',
    description: 'Review transactions, payment status, risk signals, and refunds.'
  }
};

export default function AdminDashboardPage() {
  const [activeSection, setActiveSection] = useState('analytics');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { user, logout } = useAuth();
  const activeMeta = sectionMeta[activeSection];

  const selectSection = (sectionId) => {
    setActiveSection(sectionId);
    setIsMobileNavOpen(false);
  };

  return (
    <main className="min-h-dvh bg-[#080d14] text-white">
      {isMobileNavOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileNavOpen(false)}
          aria-label="Close admin navigation"
        />
      ) : null}

      <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside
          id="admin-navigation"
          className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-64 flex-col border-r border-white/[0.08] bg-[#0b1119] p-4 shadow-2xl transition-transform duration-200 lg:sticky lg:top-0 lg:z-20 lg:w-auto lg:translate-x-0 lg:shadow-none ${
            isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-14 items-center justify-between">
            <Link to="/" className="focus-ring flex items-center gap-3 rounded-lg" aria-label="EventX home">
              <img src={`${import.meta.env.BASE_URL}eventx-logo.svg`} alt="" aria-hidden="true" className="h-9 w-9 shrink-0" />
              <div>
                <p className="text-sm font-bold text-white">EventX</p>
                <p className="text-xs text-slate-500">Admin Console</p>
              </div>
            </Link>
            <button
              type="button"
              className="focus-ring grid h-9 w-9 place-items-center rounded-lg text-slate-400 hover:bg-white/[0.06] hover:text-white lg:hidden"
              onClick={() => setIsMobileNavOpen(false)}
              aria-label="Close admin navigation"
            >
              <X weight="regular" aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>

          <AdminNavigation active={activeSection} onChange={selectSection} className="mt-8" />

          <div className="mt-auto space-y-1 border-t border-white/[0.08] pt-4">
            <Link
              to="/"
              className="focus-ring flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-slate-400 transition hover:bg-white/[0.05] hover:text-slate-100"
            >
              <House weight="regular" aria-hidden="true" className="h-5 w-5" />
              Back to site
            </Link>
            <button
              type="button"
              onClick={logout}
              className="focus-ring flex h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-semibold text-slate-400 transition hover:bg-rose-400/10 hover:text-rose-200"
            >
              <SignOut weight="regular" aria-hidden="true" className="h-5 w-5" />
              Sign out
            </button>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#0b1119]/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="flex h-16 items-center gap-4">
              <button
                type="button"
                className="focus-ring grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-slate-300 transition hover:border-teal-400/30 hover:text-teal-200 lg:hidden"
                onClick={() => setIsMobileNavOpen(true)}
                aria-expanded={isMobileNavOpen}
                aria-controls="admin-navigation"
                aria-label="Open admin navigation"
              >
                <List weight="regular" aria-hidden="true" className="h-5 w-5" />
              </button>

              <p className="hidden text-sm font-semibold text-slate-300 sm:block">{sections.find((section) => section.id === activeSection)?.label}</p>

              <div className="ml-auto flex min-w-0 items-center gap-3">
                {user?.avatar ? (
                  <img src={user.avatar} alt="" className="h-9 w-9 rounded-full border border-white/10 object-cover" />
                ) : (
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-teal-400/10 text-sm font-bold text-teal-200">
                    {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                  </span>
                )}
                <div className="hidden min-w-0 sm:block">
                  <p className="max-w-48 truncate text-sm font-semibold text-slate-100">{user?.name || 'Administrator'}</p>
                  <p className="text-xs capitalize text-slate-500">{user?.role || 'admin'}</p>
                </div>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[82rem] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-300">Platform operations</p>
              <h1 className="mt-2 text-2xl font-bold tracking-normal sm:text-3xl">{activeMeta.title}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{activeMeta.description}</p>
            </header>

            {activeSection === 'analytics' ? <AdminAnalytics /> : null}
            {activeSection === 'users' ? <UserManagement /> : null}
            {activeSection === 'payments' ? <PaymentMonitoring /> : null}
          </div>
        </div>
      </div>
    </main>
  );
}

function AdminNavigation({ active, onChange, className = '' }) {
  return (
    <nav className={`grid gap-1 ${className}`} aria-label="Admin dashboard">
      {sections.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`focus-ring flex h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-semibold transition ${
            active === id
              ? 'bg-teal-400/10 text-teal-200'
              : 'text-slate-400 hover:bg-white/[0.05] hover:text-slate-100'
          }`}
          aria-current={active === id ? 'page' : undefined}
        >
          <Icon weight={active === id ? 'duotone' : 'regular'} aria-hidden="true" className="h-5 w-5 shrink-0" />
          {label}
        </button>
      ))}
    </nav>
  );
}
