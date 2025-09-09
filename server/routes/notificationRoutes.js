import { Router } from 'express';
import { subscribeEmail } from '../controllers/notificationController.js';

const router = Router();

router.post('/subscribe', subscribeEmail);

export default router;
