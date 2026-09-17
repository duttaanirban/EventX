import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { CalendarDays, LayoutDashboard, LogOut, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';

const baseNavLink =
  'focus-ring rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-white/[0.06] hover:text-teal-300';

function getDashboardPath(user) {
  if (user?.role === 'admin') return '/admin';
  if (user?.role === 'organizer') return '/organizer';
  return '/bookings';
}

export function PublicNavbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.hash]);

  const organizePath = user?.role === 'organizer' || user?.role === 'admin' ? '/organizer' : '/register';
  const dashboardPath = getDashboardPath(user);

  const handleSearch = (event) => {
    event.preventDefault();
    navigate(search.trim() ? `/events?search=${encodeURIComponent(search.trim())}` : '/events');
    setIsMenuOpen(false);
  };

  const navClassName = ({ isActive }) =>
    `${baseNavLink} ${isActive ? 'bg-teal-400/10 text-teal-300' : 'text-slate-300'}`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070b12]/85 text-white shadow-[0_10px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="focus-ring flex shrink-0 items-center gap-2.5 rounded-lg" aria-label="EventX home">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-500 text-[#041311] shadow-[0_0_24px_rgba(20,184,166,0.3)]">
            <CalendarDays className="h-5 w-5" strokeWidth={2.25} />
          </span>
          <span className="text-xl font-black tracking-normal">EventX</span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex" aria-label="Primary navigation">
          <NavLink to="/" end className={navClassName}>Home</NavLink>
          <NavLink to="/events" className={navClassName}>Events</NavLink>
          <NavLink to={organizePath} className={navClassName}>Organize</NavLink>
          <Link to="/#pricing" className={`${baseNavLink} text-slate-300`}>Pricing</Link>
          <Link to="/#about" className={`${baseNavLink} text-slate-300`}>About</Link>
        </nav>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <form onSubmit={handleSearch} className="relative hidden xl:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <label htmlFor="event-search" className="sr-only">Search events</label>
            <input
              id="event-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search events"
              className="focus-ring h-10 w-56 rounded-lg border border-white/10 bg-white/[0.06] pl-9 pr-3 text-sm text-white placeholder:text-slate-500 hover:border-white/20 focus:border-teal-500/60 focus:bg-white/[0.08]"
            />
          </form>
          <button
            type="button"
            className="focus-ring grid h-10 w-10 place-items-center rounded-lg text-slate-300 transition hover:bg-white/[0.08] hover:text-teal-300"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          {user ? (
            <>
              <Link to={dashboardPath}>
                <Button variant="nav" className="px-3">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Button variant="nav" className="w-10 px-0" onClick={logout} aria-label="Sign out">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button variant="nav">Sign in</Button></Link>
              <Link to="/register"><Button variant="accent" size="compact">Get Started</Button></Link>
            </>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <button
            type="button"
            className="focus-ring grid h-10 w-10 place-items-center rounded-lg text-slate-300 transition hover:bg-white/[0.08] hover:text-teal-300"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            type="button"
            className="focus-ring grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-slate-200 transition hover:border-teal-400/40 hover:text-teal-300"
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <div id="mobile-navigation" className="border-t border-white/10 bg-[#070b12]/95 px-4 py-5 backdrop-blur-xl lg:hidden">
          <div className="mx-auto max-w-7xl">
            <form onSubmit={handleSearch} className="relative mb-4">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <label htmlFor="mobile-event-search" className="sr-only">Search events</label>
              <input
                id="mobile-event-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search events"
                className="focus-ring h-11 w-full rounded-lg border border-white/10 bg-white/[0.06] pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-teal-500/60"
              />
            </form>
            <nav className="grid gap-1" aria-label="Mobile navigation">
              <NavLink to="/" end className={navClassName}>Home</NavLink>
              <NavLink to="/events" className={navClassName}>Events</NavLink>
              <NavLink to={organizePath} className={navClassName}>Organize</NavLink>
              <Link to="/#pricing" className={`${baseNavLink} text-slate-300`}>Pricing</Link>
              <Link to="/#about" className={`${baseNavLink} text-slate-300`}>About</Link>
              {user ? <NavLink to="/bookings" className={navClassName}>My tickets</NavLink> : null}
            </nav>
            <div className="mt-4 flex gap-2 border-t border-white/10 pt-4">
              {user ? (
                <>
                  <Link to={dashboardPath} className="flex-1">
                    <Button variant="outline" className="w-full"><LayoutDashboard className="h-4 w-4" />Dashboard</Button>
                  </Link>
                  <Button variant="nav" onClick={logout} aria-label="Sign out"><LogOut className="h-4 w-4" /></Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="flex-1"><Button variant="outline" className="w-full">Sign in</Button></Link>
                  <Link to="/register" className="flex-1"><Button variant="accent" className="w-full">Get Started</Button></Link>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
