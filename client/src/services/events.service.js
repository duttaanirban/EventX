import { api, unwrap } from './api';

export const eventsService = {
  list: (params) => unwrap(api.get('/events', { params })),
  detail: (id) => unwrap(api.get(`/events/${id}`)),
  mine: () => unwrap(api.get('/events/mine')),
  create: (payload) => unwrap(api.post('/events', payload)),
  update: (id, payload) => unwrap(api.put(`/events/${id}`, payload)),
  remove: (id) => unwrap(api.delete(`/events/${id}`))
};
