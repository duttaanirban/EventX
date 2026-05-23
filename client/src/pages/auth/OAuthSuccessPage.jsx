import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { Skeleton } from '../../components/ui/Skeleton';

export default function OAuthSuccessPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get('token');
    if (!token) {
      navigate('/login');
      return;
    }
    localStorage.setItem('eventx_access_token', token);
    authService
      .me()
      .then(({ user }) => {
        localStorage.setItem('eventx_user', JSON.stringify(user));
        navigate(user.role === 'admin' ? '/admin' : user.role === 'organizer' ? '/organizer' : '/bookings');
      })
      .catch(() => navigate('/login'));
  }, [navigate, params]);

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <Skeleton className="h-16 w-full" />
    </main>
  );
}
