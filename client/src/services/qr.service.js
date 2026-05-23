import { api, unwrap } from './api';

export const qrService = {
  validate: (payload) => unwrap(api.post('/qr/validate', { payload }))
};
