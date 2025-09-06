import { createCheckoutSession as createCheckoutSessionService } from '../services/checkoutService.js';

export const createCheckoutSession = async (req, res) => {
  try {
    const { items = [] } = req.body || {};
    const session = await createCheckoutSessionService({ items });
    return res.json(session);
  } catch (err) {
    const status = err.statusCode || 500;
    console.error('Checkout error:', err);
    return res.status(status).json({ error: { message: status === 500 ? 'Failed to create checkout session' : err.message } });
  }
};


