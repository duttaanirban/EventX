import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Key } from '@phosphor-icons/react';
import { AuthShell } from '../../components/auth/AuthShell';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { Button } from '../../components/ui/Button';
import { authService } from '../../services/auth.service';

const schema = z.object({ password: z.string().min(8) });

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    try {
      const data = await authService.resetPassword({ token: params.get('token'), password: values.password });
      localStorage.setItem('eventx_access_token', data.accessToken);
      localStorage.setItem('eventx_user', JSON.stringify(data.user));
      toast.success('Password updated');
      navigate('/bookings');
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to update your password. The reset link may have expired.';
      setError('root', { message });
      toast.error(message);
    }
  };

  return (
    <AuthShell standalone>
      <header>
        <span className="grid h-11 w-11 place-items-center rounded-xl border border-teal-300/15 bg-teal-400/10 text-teal-300">
          <Key weight="duotone" aria-hidden="true" className="h-6 w-6" />
        </span>
        <h1 className="mt-5 text-3xl font-bold tracking-normal">Set a new password</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">Choose a secure password with at least 8 characters.</p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-7" noValidate>
        <PasswordInput
          label="New password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          {...register('password')}
          error={errors.password?.message}
        />
        {errors.root?.message ? (
          <p role="alert" className="mt-4 rounded-xl border border-rose-400/20 bg-rose-950/25 px-3.5 py-3 text-sm font-medium text-rose-200">
            {errors.root.message}
          </p>
        ) : null}
        <Button type="submit" className="mt-6 h-12 w-full rounded-xl" variant="accent" isLoading={isSubmitting}>
          Update password
        </Button>
      </form>
    </AuthShell>
  );
}
