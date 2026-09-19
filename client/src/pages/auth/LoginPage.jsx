import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Envelope, GoogleLogo } from '@phosphor-icons/react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/auth.service';
import { AuthShell } from '../../components/auth/AuthShell';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const oauthStatus = params.get('oauth');
    const oauthMessages = {
      failed: 'Google sign-in could not be completed. Please try again.',
      session_failed: 'Google sign-in succeeded, but the app could not load your account session.'
    };

    if (oauthMessages[oauthStatus]) {
      const message = oauthMessages[oauthStatus];
      setError('root', { message });
      toast.error(message);
    }
  }, [location.search, setError]);

  const onSubmit = async (values) => {
    try {
      const user = await login(values);
      navigate(location.state?.from?.pathname || (user.role === 'admin' ? '/admin' : user.role === 'organizer' ? '/organizer' : '/bookings'));
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to sign in. Please check your credentials and try again.';
      setError('root', { message });
      toast.error(message);
    }
  };

  return (
    <AuthShell standalone>
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">EventX account</p>
        <h1 className="mt-3 text-3xl font-bold tracking-normal">Welcome back</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">Sign in to continue to EventX.</p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-7" noValidate>
        <div className="space-y-4">
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            icon={Envelope}
            tone="dark"
            {...register('email')}
            error={errors.email?.message}
          />
          <div>
            <PasswordInput
              label="Password"
              autoComplete="current-password"
              placeholder="Enter your password"
              {...register('password')}
              error={errors.password?.message}
            />
            <div className="mt-2 text-right">
              <Link className="focus-ring rounded text-xs font-semibold text-slate-400 transition hover:text-teal-200" to="/forgot-password">
                Forgot password?
              </Link>
            </div>
          </div>
        </div>

        {errors.root?.message ? (
          <p role="alert" className="mt-4 rounded-xl border border-rose-400/20 bg-rose-950/25 px-3.5 py-3 text-sm font-medium text-rose-200">
            {errors.root.message}
          </p>
        ) : null}

        <Button type="submit" className="mt-6 h-12 w-full rounded-xl" variant="accent" isLoading={isSubmitting}>
          Sign in
          {!isSubmitting ? <ArrowRight weight="bold" aria-hidden="true" className="h-4 w-4" /> : null}
        </Button>
      </form>

      <div className="my-7 flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-white/[0.08]" />
        <span className="text-xs font-medium text-slate-600">OR</span>
        <span className="h-px flex-1 bg-white/[0.08]" />
      </div>

      <a
        href={authService.googleUrl}
        className="focus-ring flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] text-sm font-semibold text-slate-200 transition hover:border-teal-400/30 hover:bg-teal-400/[0.07] hover:text-white"
      >
        <GoogleLogo weight="bold" aria-hidden="true" className="h-5 w-5" />
        Continue with Google
      </a>

      <p className="mt-6 text-center text-sm text-slate-400">
        Don&apos;t have an account?{' '}
        <Link className="focus-ring rounded font-semibold text-teal-300 transition hover:text-teal-200" to="/register">
          Create one
        </Link>
      </p>
    </AuthShell>
  );
}
