import express from 'express';
import { createCheckoutSession } from '../controllers/checkoutController.js';

const router = express.Router();

router.post('/', createCheckoutSession);

export default router;


