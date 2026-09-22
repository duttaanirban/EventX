import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarDots, Info, MapPin, Ticket } from '@phosphor-icons/react';
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#101720] p-4 shadow-[0_12px_34px_rgba(0,0,0,0.16)] sm:p-5"
      noValidate
    >
      <div className="flex items-start gap-3 border-b border-slate-200 dark:border-white/[0.08] pb-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-400/10 text-teal-700 dark:text-teal-300">
          <CalendarDots weight="duotone" aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{event ? 'Edit event' : 'Create event'}</h3>
          <p className="mt-1 text-xs leading-5 text-slate-500">All fields are required for publishing your event.</p>
        </div>
      </div>

      <fieldset className="mt-5">
        <legend className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          <Info weight="duotone" aria-hidden="true" className="h-4 w-4" />
          Event information
        </legend>
        <div className="grid gap-4 md:grid-cols-2">
          <Input tone="dark" label="Event title" {...register('title')} error={errors.title?.message} />
          <Select tone="dark" label="Category" {...register('category')} error={errors.category?.message}>
            <option>Technology</option>
            <option>Business</option>
            <option>Music</option>
            <option>Sports</option>
            <option>Food</option>
            <option>Arts</option>
          </Select>
          <div className="md:col-span-2">
            <Input tone="dark" label="Banner image URL" type="url" {...register('bannerImage')} error={errors.bannerImage?.message} />
          </div>
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Description</span>
            <textarea
              className="focus-ring min-h-28 w-full resize-y rounded-xl border border-slate-200 dark:border-white/10 bg-slate-900/5 dark:bg-white/[0.045] px-3 py-3 text-sm text-slate-900 dark:text-white shadow-sm transition placeholder:text-slate-500 hover:border-slate-200 dark:hover:border-white/20 focus:border-teal-400/60"
              aria-invalid={errors.description ? 'true' : undefined}
              {...register('description')}
            />
            {errors.description ? <span role="alert" className="mt-1.5 block text-xs font-medium text-rose-700 dark:text-rose-400">{errors.description.message}</span> : null}
          </label>
        </div>
      </fieldset>

      <fieldset className="mt-6 border-t border-slate-200 dark:border-white/[0.08] pt-5">
        <legend className="flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          <MapPin weight="duotone" aria-hidden="true" className="h-4 w-4" />
          Schedule and venue
        </legend>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input tone="dark" label="Venue" {...register('venue')} error={errors.venue?.message} />
          <Input tone="dark" label="City" {...register('city')} error={errors.city?.message} />
          <Input tone="dark" label="Date" type="date" className="[color-scheme:light] dark:[color-scheme:dark]" {...register('date')} error={errors.date?.message} />
          <Input tone="dark" label="Time" placeholder="7:30 PM" {...register('time')} error={errors.time?.message} />
        </div>
      </fieldset>

      <fieldset className="mt-6 border-t border-slate-200 dark:border-white/[0.08] pt-5">
        <legend className="flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          <Ticket weight="duotone" aria-hidden="true" className="h-4 w-4" />
          Ticket inventory
        </legend>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input tone="dark" label="Ticket price" type="number" min="0" {...register('ticketPrice')} error={errors.ticketPrice?.message} />
          <Input tone="dark" label="Total seats" type="number" min="1" {...register('totalSeats')} error={errors.totalSeats?.message} />
        </div>
      </fieldset>

      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 dark:border-white/[0.08] pt-5 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button type="button" variant="nav" className="border border-slate-200 dark:border-white/10" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" variant="accent" className="rounded-xl" isLoading={isSubmitting}>
          {event ? 'Update event' : 'Create event'}
        </Button>
      </div>
    </form>
  );
}
