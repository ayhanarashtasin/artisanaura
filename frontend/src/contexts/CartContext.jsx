// CartContext: persists cart in localStorage; requires auth to add
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};

export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('cart');
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_err) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // Clear cart when a signed-in user logs out (token transitions from truthy to falsy)
  const hadTokenRef = useRef(Boolean(token));
  useEffect(() => {
    const hadToken = hadTokenRef.current;
    const hasToken = Boolean(token);
    if (hadToken && !hasToken) {
      setItems([]);
      try { localStorage.removeItem('cart'); } catch (_) {}
    }
    hadTokenRef.current = hasToken;
  }, [token]);

  const addToCart = (product, quantity = 1) => {
    // Require authentication before adding to cart
    if (!token) {
      try { localStorage.setItem('postLoginRedirect', window.location?.href || '/'); } catch (_) {}
      if (typeof window !== 'undefined') {
        window.location.href = '/signin?next=/cart';
      }
      return false;
    }
    if (!product || !product._id) return false;
    const productId = product._id;
    const priceNumber = Number(product.price) || 0;
    setItems(prev => {
      const existingIndex = prev.findIndex(it => it.id === productId);
      if (existingIndex === -1) {
        return [
          ...prev,
          {
            id: productId,
            name: product.name || 'Item',
            price: priceNumber,
            imageUrl: product.imageUrl || product.image || '',
            quantity: Math.max(1, Number(quantity) || 1),
          },
        ];
      }
      const updated = [...prev];
      const nextQty = Math.max(1, updated[existingIndex].quantity + (Number(quantity) || 1));
      updated[existingIndex] = { ...updated[existingIndex], quantity: nextQty };
      return updated;
    });
    return true;
  };

  const removeFromCart = (productId) => {
    setItems(prev => prev.filter(it => it.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    const next = Math.max(0, Number(quantity) || 0);
    setItems(prev => {
      if (next === 0) return prev.filter(it => it.id !== productId);
      return prev.map(it => (it.id === productId ? { ...it, quantity: next } : it));
    });
  };

  const clearCart = () => setItems([]);

  const totals = useMemo(() => {
    const totalQuantity = items.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0);
    const totalPrice = items.reduce((sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.price) || 0), 0);
    return { totalQuantity, totalPrice };
  }, [items]);

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalQuantity: totals.totalQuantity,
    totalPrice: totals.totalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};


