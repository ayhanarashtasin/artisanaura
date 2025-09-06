import React, { useEffect, useRef, useState } from 'react';
import Header from '../components/common/Header';
import { useCart } from '../contexts/CartContext';
import { orderApi } from '../api/orderApi';

const CheckoutSuccess = () => {
  const [message, setMessage] = useState('Thank you for your purchase! Your order is being processed.');
  const [orderId, setOrderId] = useState(null);
  const { items, clearCart } = useCart();
  const processedRef = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    if (!sessionId || processedRef.current) return;
    processedRef.current = true;
    // Prefer persisted snapshot; if missing, abort to avoid bad requests
    let cartSnapshot = [];
    try {
      const stored = JSON.parse(localStorage.getItem('pendingCheckoutCart') || 'null');
      if (Array.isArray(stored) && stored.length > 0) {
        cartSnapshot = stored;
      } else if (Array.isArray(items) && items.length > 0) {
        cartSnapshot = items.map((it) => ({ id: it.id, quantity: it.quantity }));
      }
    } catch (_) {}
    if (!Array.isArray(cartSnapshot) || cartSnapshot.length === 0) {
      setMessage('Payment successful, but we could not confirm the order automatically.');
      return;
    }
    const confirm = async () => {
      try {
        const res = await orderApi.confirm(sessionId, cartSnapshot);
        if (res?.success && res?.order?._id) {
          setOrderId(res.order._id);
          setMessage('Payment confirmed. Your order has been created.');
          clearCart();
          try { localStorage.removeItem('pendingCheckoutCart'); } catch (_) {}
        } else {
          setMessage('Payment successful, but we could not confirm the order automatically.');
        }
      } catch (_) {
        setMessage('Payment successful, but we could not confirm the order automatically.');
      }
    };
    confirm();
  }, [items, clearCart]);
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Payment Successful</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">{message}</p>
        {orderId && (
          <p className="mt-2 text-sm opacity-80">Order ID: {orderId}</p>
        )}
      </div>
    </div>
  );
};

export default CheckoutSuccess;


