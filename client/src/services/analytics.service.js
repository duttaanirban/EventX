import { api, unwrap } from './api';

export const analyticsService = {
  organizer: () => unwrap(api.get('/analytics/organizer')),
  admin: () => unwrap(api.get('/analytics/admin')),
  users: () => unwrap(api.get('/analytics/admin/users')),
  updateUser: (id, payload) => unwrap(api.patch(`/analytics/admin/users/${id}`, payload)),
  payments: () => unwrap(api.get('/analytics/admin/payments'))
};
