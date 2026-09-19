import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CheckCircle, EnvelopeSimple, Key } from '@phosphor-icons/react';
import { AuthShell } from '../../components/auth/AuthShell';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { authService } from '../../services/auth.service';

const schema = z.object({ email: z.string().email() });

export default function ForgotPasswordPage() {
  const [isSent, setIsSent] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    try {
      await authService.forgotPassword(values);
      setIsSent(true);
      toast.success('Reset link sent if the email exists');
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to request a reset link. Please try again.';
      setError('root', { message });
      toast.error(message);
    }
  };

  return (
    <AuthShell standalone>
      {isSent ? (
        <div className="text-center" role="status">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl border border-teal-300/15 bg-teal-400/10 text-teal-300">
            <CheckCircle weight="duotone" aria-hidden="true" className="h-7 w-7" />
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-normal">Check your email</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">
            If an EventX account exists for that email, reset instructions are on their way.
          </p>
          <Link to="/login" className="focus-ring mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 text-sm font-semibold text-slate-200 transition hover:border-teal-400/30 hover:bg-teal-400/10 hover:text-white">
            <ArrowLeft weight="regular" aria-hidden="true" className="h-4 w-4" />
            Back to sign in
          </Link>
        </div>
      ) : (
        <>
          <header>
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-teal-300/15 bg-teal-400/10 text-teal-300">
              <Key weight="duotone" aria-hidden="true" className="h-6 w-6" />
            </span>
            <h1 className="mt-5 text-3xl font-bold tracking-normal">Forgot your password?</h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Enter your email and we&apos;ll send you instructions to reset your password.
            </p>
          </header>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-7" noValidate>
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              icon={EnvelopeSimple}
              tone="dark"
              {...register('email')}
              error={errors.email?.message}
            />
            {errors.root?.message ? (
              <p role="alert" className="mt-4 rounded-xl border border-rose-400/20 bg-rose-950/25 px-3.5 py-3 text-sm font-medium text-rose-200">
                {errors.root.message}
              </p>
            ) : null}
            <Button type="submit" className="mt-6 h-12 w-full rounded-xl" variant="accent" isLoading={isSubmitting}>
              Send reset link
            </Button>
          </form>

          <p className="mt-6 text-center">
            <Link className="focus-ring inline-flex items-center gap-2 rounded text-sm font-semibold text-slate-400 transition hover:text-teal-200" to="/login">
              <ArrowLeft weight="regular" aria-hidden="true" className="h-4 w-4" />
              Back to sign in
            </Link>
          </p>
        </>
      )}
    </AuthShell>
  );
}
