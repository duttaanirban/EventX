import { Outlet } from 'react-router-dom';
import { PublicNavbar } from '../components/navigation/PublicNavbar';
import { Footer } from '../components/layout/Footer';

export function PublicLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <PublicNavbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
