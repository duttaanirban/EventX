import { useState } from 'react';
import { BarChart3, CalendarPlus, QrCode } from 'lucide-react';
import { Tabs } from '../../components/dashboard/Tabs';
import { EventManager } from '../../components/organizer/EventManager';
import { OrganizerAnalytics } from '../../components/organizer/OrganizerAnalytics';
import { QrScannerPanel } from '../../components/organizer/QrScannerPanel';

const tabs = [
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'events', label: 'Events', icon: CalendarPlus },
  { id: 'scanner', label: 'Scanner', icon: QrCode }
];

export default function OrganizerDashboardPage() {
  const [activeTab, setActiveTab] = useState('analytics');

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-black">Organizer dashboard</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Manage events, attendees, revenue, and QR check-ins.</p>
        </div>
        <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
      </div>

      {activeTab === 'analytics' ? <OrganizerAnalytics /> : null}
      {activeTab === 'events' ? <EventManager /> : null}
      {activeTab === 'scanner' ? <QrScannerPanel /> : null}
    </main>
  );
}
