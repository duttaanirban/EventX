import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Skeleton } from '../components/ui/Skeleton';

export function ProtectedRoute({ roles }) {
  const { user, isBootstrapping } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="mt-4 h-80 w-full" />
      </main>
    );
  }

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (roles?.length && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <Outlet />;
}
