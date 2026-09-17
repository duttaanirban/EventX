import { Outlet } from 'react-router-dom';
import { PublicNavbar } from '../components/navigation/PublicNavbar';
import { Footer } from '../components/layout/Footer';

export function PublicLayout() {
  return (
    <div className="min-h-screen">
      <PublicNavbar />
      <Outlet />
      <Footer />
    </div>
  );
}
