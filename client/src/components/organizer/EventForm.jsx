import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

const schema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  bannerImage: z.string().url('Use a valid image URL'),
  venue: z.string().min(2, 'Venue is required'),
  city: z.string().min(2, 'City is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(3, 'Time is required'),
  category: z.string().min(2, 'Category is required'),
  ticketPrice: z.coerce.number().min(0),
  totalSeats: z.coerce.number().int().min(1)
});

const emptyValues = {
  title: '',
  description: '',
  bannerImage: '',
  venue: '',
  city: '',
  date: '',
  time: '',
  category: 'Technology',
  ticketPrice: 0,
  totalSeats: 100
};

const toFormValues = (event) =>
  event
    ? {
        ...event,
        date: event.date ? new Date(event.date).toISOString().slice(0, 10) : '',
        ticketPrice: event.ticketPrice || 0,
        totalSeats: event.totalSeats || 1
      }
    : emptyValues;

export function EventForm({ event, onSubmit, onCancel, isSubmitting }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ resolver: zodResolver(schema), defaultValues: toFormValues(event) });

  useEffect(() => {
    reset(toFormValues(event));
  }, [event, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Event title" {...register('title')} error={errors.title?.message} />
        <Input label="Banner image URL" {...register('bannerImage')} error={errors.bannerImage?.message} />
        <Input label="Venue" {...register('venue')} error={errors.venue?.message} />
        <Input label="City" {...register('city')} error={errors.city?.message} />
        <Input label="Date" type="date" {...register('date')} error={errors.date?.message} />
        <Input label="Time" placeholder="7:30 PM" {...register('time')} error={errors.time?.message} />
        <Select label="Category" {...register('category')} error={errors.category?.message}>
          <option>Technology</option>
          <option>Business</option>
          <option>Music</option>
          <option>Sports</option>
          <option>Food</option>
          <option>Arts</option>
        </Select>
        <Input label="Ticket price" type="number" min="0" {...register('ticketPrice')} error={errors.ticketPrice?.message} />
        <Input label="Total seats" type="number" min="1" {...register('totalSeats')} error={errors.totalSeats?.message} />
      </div>
      <label className="mt-4 block">
        <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Description</span>
        <textarea
          className="focus-ring min-h-32 w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white"
          {...register('description')}
        />
        {errors.description ? <span className="mt-1 block text-xs font-medium text-berry">{errors.description.message}</span> : null}
      </label>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" variant="accent" isLoading={isSubmitting}>
          {event ? 'Update event' : 'Create event'}
        </Button>
      </div>
    </form>
  );
}
