import React, { useEffect, useState } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { orderApi } from '../../api/orderApi';

const Orders = () => {
  const { isDarkMode } = useDarkMode();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await orderApi.sellerOrders();
        setOrders(Array.isArray(res?.orders) ? res.orders : []);
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Orders</h1>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : orders.length === 0 ? (
          <div className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>No orders yet.</div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o._id} className={`rounded border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Order #{o._id}</div>
                    <div className="text-sm opacity-70">{new Date(o.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${(o.total || 0).toFixed(2)}</div>
                    <div className="text-xs uppercase opacity-70">{o.status}</div>
                  </div>
                </div>
                <div className={`px-4 pb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {Array.isArray(o.items) && o.items.length > 0 && (
                    <ul className="list-disc pl-6">
                      {o.items.map((it, idx) => (
                        <li key={idx}>
                          {it.name} × {it.quantity} — ${(it.price || 0).toFixed(2)} each
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;


