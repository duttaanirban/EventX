import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, CalendarDots, Envelope, User } from '@phosphor-icons/react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { AuthShell } from '../../components/auth/AuthShell';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['user', 'organizer'])
});

const roleOptions = [
  { value: 'user', title: 'Attendee', description: 'Discover and book events', icon: User },
  { value: 'organizer', title: 'Organizer', description: 'Create and manage events', icon: CalendarDots }
];

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: zodResolver(schema), defaultValues: { role: 'user' } });
  const selectedRole = watch('role');

  const onSubmit = async (values) => {
    try {
      const user = await registerUser(values);
      navigate(user.role === 'organizer' ? '/organizer' : '/bookings');
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to create your account. Please try again.';
      setError('root', { message });
      toast.error(message);
    }
  };

  return (
    <AuthShell standalone panelClassName="max-w-lg">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">Join EventX</p>
        <h1 className="mt-3 text-3xl font-bold tracking-normal">Create your EventX account</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">Join EventX and start discovering or organizing events.</p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-7" noValidate>
        <div className="space-y-4">
          <Input
            label="Name"
            autoComplete="name"
            placeholder="Your full name"
            icon={User}
            tone="dark"
            {...register('name')}
            error={errors.name?.message}
          />
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
          <PasswordInput
            label="Password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            {...register('password')}
            error={errors.password?.message}
          />

          <fieldset>
            <legend className="mb-2 text-sm font-medium text-slate-200">Account type</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {roleOptions.map(({ value, title, description, icon: Icon }) => (
                <label key={value} className="relative cursor-pointer">
                  <input type="radio" value={value} {...register('role')} className="peer sr-only" />
                  <span className="flex min-h-20 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] p-3.5 transition hover:border-white/20 peer-checked:border-teal-400/60 peer-checked:bg-teal-400/10 peer-focus-visible:ring-2 peer-focus-visible:ring-teal-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#101720]">
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${selectedRole === value ? 'bg-teal-400/15 text-teal-300' : 'bg-white/[0.06] text-slate-400'}`}>
                      <Icon weight="duotone" aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-slate-100">{title}</span>
                      <span className="mt-0.5 block text-xs leading-4 text-slate-500">{description}</span>
                    </span>
                  </span>
                </label>
              ))}
            </div>
            {errors.role?.message ? <p role="alert" className="mt-1.5 text-xs font-medium text-rose-400">{errors.role.message}</p> : null}
          </fieldset>
        </div>

        {errors.root?.message ? (
          <p role="alert" className="mt-4 rounded-xl border border-rose-400/20 bg-rose-950/25 px-3.5 py-3 text-sm font-medium text-rose-200">
            {errors.root.message}
          </p>
        ) : null}

        <Button type="submit" className="mt-6 h-12 w-full rounded-xl" variant="accent" isLoading={isSubmitting}>
          Create account
          {!isSubmitting ? <ArrowRight weight="bold" aria-hidden="true" className="h-4 w-4" /> : null}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link className="focus-ring rounded font-semibold text-teal-300 transition hover:text-teal-200" to="/login">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
