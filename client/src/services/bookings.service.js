import { api, unwrap } from './api';

export const bookingsService = {
  intent: (payload) => unwrap(api.post('/bookings', payload)),
  mine: () => unwrap(api.get('/bookings/user')),
  event: (id) => unwrap(api.get(`/bookings/event/${id}`))
};
