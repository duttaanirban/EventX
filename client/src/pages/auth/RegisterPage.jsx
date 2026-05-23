import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['user', 'organizer'])
});

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: zodResolver(schema), defaultValues: { role: 'user' } });

  const onSubmit = async (values) => {
    const user = await registerUser(values);
    navigate(user.role === 'organizer' ? '/organizer' : '/bookings');
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center px-4 py-10">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full rounded-lg border border-slate-200 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-white/5">
        <h1 className="text-2xl font-black">Create account</h1>
        <div className="mt-6 space-y-4">
          <Input label="Name" {...register('name')} error={errors.name?.message} />
          <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
          <Input label="Password" type="password" {...register('password')} error={errors.password?.message} />
          <Select label="Account type" {...register('role')} error={errors.role?.message}>
            <option value="user">Attendee</option>
            <option value="organizer">Organizer</option>
          </Select>
        </div>
        <Button className="mt-6 w-full" variant="accent" isLoading={isSubmitting}>
          Create account
        </Button>
        <p className="mt-5 text-sm text-slate-500">
          Already have an account?{' '}
          <Link className="font-semibold text-brand-700 dark:text-brand-100" to="/login">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}
