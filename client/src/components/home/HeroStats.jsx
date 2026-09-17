import { Building2, CalendarDays, Star, Users } from 'lucide-react';

const stats = [
  { icon: CalendarDays, value: '10K+', label: 'Events Hosted' },
  { icon: Users, value: '500K+', label: 'Happy Attendees' },
  { icon: Building2, value: '2K+', label: 'Organizations' },
  { icon: Star, value: '4.8/5', label: 'User Rating' }
];

export function HeroStats() {
  return (
    <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a1019]/60 shadow-2xl backdrop-blur-2xl sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
      {stats.map(({ icon: Icon, value, label }) => (
        <div key={label} className="px-3 py-4 text-center">
          <Icon className="mx-auto h-4 w-4 text-teal-300" />
          <p className="mt-2 text-lg font-bold text-white">{value}</p>
          <p className="mt-0.5 text-[11px] text-slate-400">{label}</p>
        </div>
      ))}
    </div>
  );
}
