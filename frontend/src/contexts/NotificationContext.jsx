// NotificationContext: simple ephemeral notifications store
import React, { createContext, useContext, useMemo, useState } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};

let nextId = 1;

export const NotificationProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const add = (message, opts = {}) => {
    const newItem = {
      id: nextId++,
      message: String(message || ''),
      createdAt: Date.now(),
      read: false,
      type: opts.type || 'info',
    };
    setItems(prev => [newItem, ...prev].slice(0, 50));
  };

  const markRead = (id) => setItems(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  const markAllRead = () => setItems(prev => prev.map(n => ({ ...n, read: true })));
  const clearAll = () => setItems([]);

  const unread = useMemo(() => items.filter(n => !n.read).length, [items]);

  const value = { items, unread, add, markRead, markAllRead, clearAll };
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};


