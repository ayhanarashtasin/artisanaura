import Stripe from 'stripe';
import Product from '../models/Product.js';

let stripeInstance = null;
const getStripe = () => {
  if (stripeInstance) return stripeInstance;
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return null;
  stripeInstance = new Stripe(secret, { apiVersion: '2024-12-18.acacia' });
  return stripeInstance;
};

export const createCheckoutSession = async ({ items }) => {
  const stripe = getStripe();
  if (!stripe) {
    const err = new Error('Stripe secret key is not configured');
    err.statusCode = 500;
    throw err;
  }
  if (!Array.isArray(items) || items.length === 0) {
    const err = new Error('No items to checkout');
    err.statusCode = 400;
    throw err;
  }

  const idToQuantity = new Map(items.map((it) => [String(it.id), Math.max(1, Number(it.quantity) || 1)]));
  const ids = Array.from(idToQuantity.keys());
  const products = await Product.find({ _id: { $in: ids } }).select('name price').lean();

  const line_items = products.map((product) => ({
    price_data: { currency: 'usd', product_data: { name: product.name }, unit_amount: Math.round(Number(product.price || 0) * 100) },
    quantity: idToQuantity.get(String(product._id)) || 1,
  }));
  if (line_items.length === 0) {
    const err = new Error('No valid items to checkout');
    err.statusCode = 400;
    throw err;
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items,
    success_url: 'http://localhost:5173/checkout/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'http://localhost:5173/checkout/cancel',
  });
  return { id: session.id, url: session.url };
};


