import { Outlet, Link, NavLink } from 'react-router-dom';
import { CalendarCheck, LayoutDashboard, LogOut, Moon, Sun } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';

const navLink = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-semibold transition ${
    isActive ? 'bg-slate-900 text-white dark:bg-white dark:text-ink' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10'
  }`;

export function PublicLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-[#15171d]/85">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 text-lg font-black tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-600 text-white">
              <CalendarCheck className="h-5 w-5" />
            </span>
            EventX
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            <NavLink to="/events" className={navLink}>
              Events
            </NavLink>
            {user ? (
              <NavLink to="/bookings" className={navLink}>
                My tickets
              </NavLink>
            ) : null}
            {user?.role === 'organizer' || user?.role === 'admin' ? (
              <NavLink to="/organizer" className={navLink}>
                Organizer
              </NavLink>
            ) : null}
            {user?.role === 'admin' ? (
              <NavLink to="/admin" className={navLink}>
                Admin
              </NavLink>
            ) : null}
          </nav>
          <div className="flex items-center gap-2">
            <button
              className="focus-ring grid h-10 w-10 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin' : user.role === 'organizer' ? '/organizer' : '/bookings'} className="hidden sm:block">
                  <Button variant="ghost">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" onClick={logout} aria-label="Sign out">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button>Sign in</Button>
              </Link>
            )}
          </div>
        </div>
      </header>
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
