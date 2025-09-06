import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import {loadStripe} from '@stripe/stripe-js';
import { checkoutApi } from '../../api/checkoutApi';

const formatCurrency = (value) => {
  try { return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(value || 0); }
  catch (_e) { return `$${Number(value || 0).toFixed(2)}`; }
};

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return 'https://placehold.co/600x400/2d3748/ffffff?text=No+Image';
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  return `http://localhost:3000${imageUrl}`;
};

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice, totalQuantity } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0 || isCheckingOut) return;
    setIsCheckingOut(true);

    const body = {
      items: items.map((item) => ({ id: item.id, quantity: item.quantity })),
    };
    // Persist a snapshot for order confirmation after redirect
    try { localStorage.setItem('pendingCheckoutCart', JSON.stringify(body.items)); } catch (_) {}
    try {
      const result = await checkoutApi.createSession(body.items);
      if (result?.url) {
        window.location.assign(result.url);
        return;
      }
      if (result?.id) {
        const pk = import.meta.env?.VITE_STRIPE_PUBLISHABLE_KEY;
        if (!pk) {
          alert('Checkout session created but redirect URL is missing. Please try again.');
          return;
        }
        const stripe = await loadStripe(pk);
        if (!stripe) {
          alert('Unable to initialize Stripe. Please try again.');
          return;
        }
        const { error } = await stripe.redirectToCheckout({ sessionId: result.id });
        if (error) alert(error.message);
        return;
      }
      alert('Failed to start checkout.');
    } catch (e) {
      alert('Failed to start checkout.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const hasItems = items.length > 0;


  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-6">
      <h1 className="text-2xl font-bold">Your Cart</h1>
      {!hasItems ? (
        <p className="mt-2 text-gray-600">No items in your cart yet.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 rounded-md border">
                <img src={getImageUrl(item.imageUrl)} alt={item.name} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600">{formatCurrency(item.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 rounded border" onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}>-</button>
                  <input
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, Number(e.target.value) || 1)}
                    className="w-14 px-2 py-1 border rounded text-center"
                  />
                  <button className="px-3 py-1 rounded border" onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}>+</button>
                </div>
                <div className="w-24 text-right font-medium">{formatCurrency(item.price * (item.quantity || 1))}</div>
                <button className="ml-4 text-red-600 hover:text-red-700" onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            ))}
          </div>
          <aside className="lg:col-span-1 p-4 border rounded-md h-fit">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between py-1">
              <span>Items</span>
              <span>{totalQuantity}</span>
            </div>
            <div className="flex justify-between py-1 font-semibold">
              <span>Total</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
            <button className={`mt-4 w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800 ${isCheckingOut ? 'opacity-70 cursor-not-allowed' : ''}`} disabled={isCheckingOut} onClick={handleCheckout}>{isCheckingOut ? 'Processing…' : 'Checkout'}</button>
            <button className="mt-2 w-full border py-2 rounded-md" onClick={clearCart}>Clear Cart</button>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Cart;
