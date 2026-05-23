import { api, unwrap } from './api';

export const paymentsService = {
  createOrder: (payload) => unwrap(api.post('/payments/create-order', payload)),
  verify: (payload) => unwrap(api.post('/payments/verify', payload)),
  refund: (id) => unwrap(api.post(`/payments/${id}/refund`))
};
