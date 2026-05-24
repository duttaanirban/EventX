import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Ban, ShieldCheck, UserCog } from 'lucide-react';
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
  const { data, isLoading } = useQuery({ queryKey: ['admin-users'], queryFn: analyticsService.users });
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
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-black">Users and organizers</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Promote organizers, adjust roles, and ban fraudulent accounts.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-[16rem_12rem]">
          <Input aria-label="Search users" placeholder="Search name or email" value={search} onChange={(event) => setSearch(event.target.value)} />
          <Select aria-label="Filter role" value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="">All roles</option>
            <option value="user">Users</option>
            <option value="organizer">Organizers</option>
            <option value="admin">Admins</option>
          </Select>
        </div>
      </div>

      {isLoading ? <Skeleton className="mt-5 h-80" /> : null}
      {!isLoading ? (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[52rem] text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr>
                <th className="py-3">Account</th>
                <th className="py-3">Role</th>
                <th className="py-3">Joined</th>
                <th className="py-3">Status</th>
                <th className="py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/10">
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td className="py-3">
                    <p className="font-bold">{user.name}</p>
                    <p className="text-slate-500">{user.email}</p>
                  </td>
                  <td className="py-3">
                    <Select
                      value={user.role}
                      onChange={(event) => updateMutation.mutate({ id: user._id, payload: { role: event.target.value } })}
                      aria-label={`Role for ${user.name}`}
                      className="max-w-40"
                    >
                      <option value="user">User</option>
                      <option value="organizer">Organizer</option>
                      <option value="admin">Admin</option>
                    </Select>
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">{formatDate(user.createdAt)}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${user.isBanned ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-100' : 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-100'}`}>
                      {user.isBanned ? 'Banned' : 'Active'}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant={user.isBanned ? 'accent' : 'danger'}
                        onClick={() => updateMutation.mutate({ id: user._id, payload: { isBanned: !user.isBanned } })}
                        isLoading={updateMutation.isPending}
                      >
                        {user.isBanned ? <ShieldCheck className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                        {user.isBanned ? 'Restore' : 'Ban'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filteredUsers.length ? (
            <div className="py-10 text-center text-sm text-slate-500">
              <UserCog className="mx-auto mb-2 h-8 w-8" />
              No accounts match your filters.
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
