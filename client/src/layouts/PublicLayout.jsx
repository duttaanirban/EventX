import { Outlet } from 'react-router-dom';
import { PublicNavbar } from '../components/navigation/PublicNavbar';

export function PublicLayout() {
  return (
    <div className="min-h-screen">
      <PublicNavbar />
      <Outlet />
      <footer className="border-t border-slate-200 py-8 dark:border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>EventX builds secure ticketing, payments, and QR check-in for modern events.</p>
          <p>Deployment ready for Vercel, Render, and MongoDB Atlas.</p>
        </div>
      </footer>
    </div>
  );
}
