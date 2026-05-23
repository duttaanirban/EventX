import express from 'express';
import { validateQr } from '../controllers/qr.controller.js';
import { authorize, protect } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { qrValidateSchema } from '../validators/qr.validator.js';

const router = express.Router();

router.post('/validate', protect, authorize('organizer', 'admin'), validate(qrValidateSchema), validateQr);

export default router;
