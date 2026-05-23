import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { authService } from '../../services/auth.service';

const schema = z.object({ password: z.string().min(8) });

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    const data = await authService.resetPassword({ token: params.get('token'), password: values.password });
    localStorage.setItem('eventx_access_token', data.accessToken);
    localStorage.setItem('eventx_user', JSON.stringify(data.user));
    toast.success('Password updated');
    navigate('/bookings');
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center px-4 py-10">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full rounded-lg border border-slate-200 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-white/5">
        <h1 className="text-2xl font-black">Choose a new password</h1>
        <div className="mt-6">
          <Input label="New password" type="password" {...register('password')} error={errors.password?.message} />
        </div>
        <Button className="mt-6 w-full" variant="accent" isLoading={isSubmitting}>
          Update password
        </Button>
      </form>
    </main>
  );
}
