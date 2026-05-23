import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { PublicLayout } from '../layouts/PublicLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';

const LandingPage = lazy(() => import('../pages/LandingPage'));
const EventsPage = lazy(() => import('../pages/EventsPage'));
const EventDetailPage = lazy(() => import('../pages/EventDetailPage'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));
const OAuthSuccessPage = lazy(() => import('../pages/auth/OAuthSuccessPage'));
const BookingHistoryPage = lazy(() => import('../pages/BookingHistoryPage'));
const OrganizerDashboardPage = lazy(() => import('../pages/organizer/OrganizerDashboardPage'));
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage'));

function PageLoader() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="mt-6 h-96 w-full" />
    </main>
  );
}

const withSuspense = (element) => (
  <ErrorBoundary>
    <Suspense fallback={<PageLoader />}>{element}</Suspense>
  </ErrorBoundary>
);

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: withSuspense(<LandingPage />) },
      { path: '/events', element: withSuspense(<EventsPage />) },
      { path: '/events/:id', element: withSuspense(<EventDetailPage />) },
      { path: '/login', element: withSuspense(<LoginPage />) },
      { path: '/register', element: withSuspense(<RegisterPage />) },
      { path: '/forgot-password', element: withSuspense(<ForgotPasswordPage />) },
      { path: '/reset-password', element: withSuspense(<ResetPasswordPage />) },
      { path: '/oauth/success', element: withSuspense(<OAuthSuccessPage />) },
      {
        element: <ProtectedRoute />,
        children: [{ path: '/bookings', element: withSuspense(<BookingHistoryPage />) }]
      },
      {
        element: <ProtectedRoute roles={['organizer', 'admin']} />,
        children: [{ path: '/organizer', element: withSuspense(<OrganizerDashboardPage />) }]
      },
      {
        element: <ProtectedRoute roles={['admin']} />,
        children: [{ path: '/admin', element: withSuspense(<AdminDashboardPage />) }]
      }
    ]
  }
]);
