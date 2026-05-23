import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { authService } from '../../services/auth.service';

const schema = z.object({ email: z.string().email() });

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    await authService.forgotPassword(values);
    toast.success('Reset link sent if the email exists');
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center px-4 py-10">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full rounded-lg border border-slate-200 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-white/5">
        <h1 className="text-2xl font-black">Reset password</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Enter your email and we will send a secure reset link.</p>
        <div className="mt-6">
          <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
        </div>
        <Button className="mt-6 w-full" variant="accent" isLoading={isSubmitting}>
          Send reset link
        </Button>
      </form>
    </main>
  );
}
