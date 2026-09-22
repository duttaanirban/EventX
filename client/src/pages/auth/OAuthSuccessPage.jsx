import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SpinnerGap } from '@phosphor-icons/react';
import { authService } from '../../services/auth.service';
import { AuthShell } from '../../components/auth/AuthShell';

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
      .catch(() => {
        localStorage.removeItem('eventx_access_token');
        localStorage.removeItem('eventx_user');
        navigate('/login?oauth=session_failed');
      });
  }, [navigate, params]);

  return (
    <AuthShell>
      <div className="py-6 text-center" role="status" aria-live="polite">
        <SpinnerGap weight="regular" aria-hidden="true" className="mx-auto h-8 w-8 animate-spin text-teal-700 dark:text-teal-300" />
        <h1 className="mt-5 text-2xl font-bold">Signing you in...</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Securely loading your EventX account.</p>
      </div>
    </AuthShell>
  );
}
