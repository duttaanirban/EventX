import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Chrome } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/auth.service';
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
    formState: { errors, isSubmitting }
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    const user = await login(values);
    navigate(location.state?.from?.pathname || (user.role === 'admin' ? '/admin' : user.role === 'organizer' ? '/organizer' : '/bookings'));
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center px-4 py-10">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full rounded-lg border border-slate-200 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-white/5">
        <h1 className="text-2xl font-black">Sign in</h1>
        <div className="mt-6 space-y-4">
          <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
          <Input label="Password" type="password" {...register('password')} error={errors.password?.message} />
        </div>
        <Button className="mt-6 w-full" variant="accent" isLoading={isSubmitting}>
          Sign in
        </Button>
        <a href={authService.googleUrl} className="mt-3 flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 text-sm font-semibold dark:border-white/10">
          <Chrome className="h-4 w-4" />
          Continue with Google
        </a>
        <div className="mt-5 flex justify-between text-sm">
          <Link className="font-semibold text-brand-700 dark:text-brand-100" to="/register">
            Create account
          </Link>
          <Link className="font-semibold text-slate-500" to="/forgot-password">
            Forgot password?
          </Link>
        </div>
      </form>
    </main>
  );
}
