import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { CheckCircle, MagnifyingGlass, Prohibit, ShieldCheck, UserGear } from '@phosphor-icons/react';
import { analyticsService } from '../../services/analytics.service';
import { formatDate } from '../../utils/date';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Skeleton } from '../ui/Skeleton';

export function UserManagement() {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-users'],
    queryFn: analyticsService.users
  });
  const users = data?.users || [];

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => analyticsService.updateUser(id, payload),
    onSuccess: () => {
      toast.success('User updated');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-analytics'] });
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Unable to update user')
  });

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase();
    return users.filter((user) => {
      const matchesSearch = !query || user.name?.toLowerCase().includes(query) || user.email?.toLowerCase().includes(query);
      const matchesRole = !role || user.role === role;
      return matchesSearch && matchesRole;
    });
  }, [users, search, role]);

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#101720]" aria-labelledby="user-management-title">
      <div className="border-b border-slate-200 dark:border-white/[0.08] p-4 sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 id="user-management-title" className="text-base font-semibold text-slate-900 dark:text-slate-100">Platform accounts</h2>
            <p className="mt-1 text-sm text-slate-500">
              {isLoading ? 'Loading accounts...' : `${filteredUsers.length} of ${users.length} accounts shown`}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-[minmax(16rem,1fr)_12rem]">
            <Input
              tone="dark"
              type="search"
              aria-label="Search users"
              placeholder="Search name or email"
              icon={MagnifyingGlass}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <Select tone="dark" aria-label="Filter role" value={role} onChange={(event) => setRole(event.target.value)}>
              <option value="">All roles</option>
              <option value="user">Attendees</option>
              <option value="organizer">Organizers</option>
              <option value="admin">Admins</option>
            </Select>
          </div>
        </div>
      </div>

      {isLoading ? <Skeleton className="m-5 h-80 !bg-slate-900/5 dark:!bg-white/5" /> : null}
      {!isLoading && isError ? (
        <div role="alert" className="m-5 rounded-xl border border-rose-400/20 bg-rose-950/20 p-5 text-center text-sm text-rose-700 dark:text-rose-100">
          Unable to load platform accounts.
        </div>
      ) : null}

      {!isLoading && !isError ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[58rem] text-left text-sm">
            <thead className="border-b border-slate-200 dark:border-white/[0.08] bg-slate-900/5 dark:bg-black/10 text-xs uppercase text-slate-500">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">Account</th>
                <th scope="col" className="px-4 py-3 font-semibold">Role</th>
                <th scope="col" className="px-4 py-3 font-semibold">Joined</th>
                <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                <th scope="col" className="px-5 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/[0.06]">
              {filteredUsers.map((user) => {
                const isUpdatingUser = updateMutation.isPending && updateMutation.variables?.id === user._id;

                return (
                  <tr key={user._id} className="text-slate-600 dark:text-slate-300 transition hover:bg-slate-900/5 dark:hover:bg-white/[0.025]">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img src={user.avatar} alt="" className="h-9 w-9 rounded-full border border-slate-200 dark:border-white/10 object-cover" />
                        ) : (
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-900/5 dark:bg-white/[0.06] text-xs font-bold text-slate-600 dark:text-slate-300">
                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-100">
                            <span className="max-w-56 truncate">{user.name}</span>
                            {user.isVerified ? <CheckCircle weight="fill" aria-label="Verified account" className="h-3.5 w-3.5 shrink-0 text-teal-700 dark:text-teal-400" /> : null}
                          </p>
                          <p className="max-w-64 truncate text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <Select
                        tone="dark"
                        value={user.role}
                        onChange={(event) => updateMutation.mutate({ id: user._id, payload: { role: event.target.value } })}
                        aria-label={`Role for ${user.name}`}
                        className="min-w-36"
                        disabled={isUpdatingUser}
                      >
                        <option value="user">Attendee</option>
                        <option value="organizer">Organizer</option>
                        <option value="admin">Admin</option>
                      </Select>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        user.isBanned ? 'bg-rose-400/10 text-rose-700 dark:text-rose-200' : 'bg-teal-400/10 text-teal-700 dark:text-teal-200'
                      }`}>
                        {user.isBanned ? 'Banned' : 'Active'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Button
                        type="button"
                        size="compact"
                        variant={user.isBanned ? 'accent' : 'danger'}
                        onClick={() => updateMutation.mutate({ id: user._id, payload: { isBanned: !user.isBanned } })}
                        isLoading={isUpdatingUser}
                      >
                        {user.isBanned ? <ShieldCheck weight="regular" aria-hidden="true" className="h-4 w-4" /> : <Prohibit weight="regular" aria-hidden="true" className="h-4 w-4" />}
                        {user.isBanned ? 'Restore' : 'Ban'}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {!filteredUsers.length ? (
            <div className="py-12 text-center text-sm text-slate-500">
              <UserGear weight="duotone" aria-hidden="true" className="mx-auto mb-3 h-8 w-8" />
              No accounts match your filters.
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
