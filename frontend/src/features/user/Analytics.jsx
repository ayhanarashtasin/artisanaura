import React, { useEffect, useMemo, useState } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';

const Analytics = () => {
  const { isDarkMode } = useDarkMode();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState({ revenueOverTime: [], topProducts: [], byStatus: [], aov: 0 });
  const [interval, setInterval] = useState('day');

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (!token) return;
      setLoading(true);
      setError('');
      try {
        const res = await orderApi.sellerAnalytics({ interval });
        if (!isMounted) return;
        if (!res?.success) throw new Error(res?.message || 'Failed to load analytics');
        setData({
          revenueOverTime: Array.isArray(res.revenueOverTime) ? res.revenueOverTime : [],
          topProducts: Array.isArray(res.topProducts) ? res.topProducts : [],
          byStatus: Array.isArray(res.byStatus) ? res.byStatus : [],
          aov: Number(res.aov || 0),
        });
      } catch (e) {
        if (!isMounted) return;
        setError(e?.message || 'Failed to load analytics');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [token, interval]);

  const totalRevenue = useMemo(() => {
    return data.revenueOverTime.reduce((s, d) => s + Number(d.revenue || 0), 0);
  }, [data.revenueOverTime]);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics</h1>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Sales performance and product insights</p>
          </div>
          <div className="flex gap-2 items-center">
            <select value={interval} onChange={(e) => setInterval(e.target.value)} className={`px-3 py-2 rounded ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border`}>
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>
            <button onClick={() => navigate('/profile/shop')} className={`px-4 py-2 rounded-lg transition-colors ${isDarkMode ? 'border border-gray-600 text-gray-300 hover:bg-gray-800' : 'border border-gray-300 text-gray-700 hover:bg-gray-100'}`}>Back</button>
          </div>
        </div>

        {loading && (
          <div className="p-6 rounded-lg border border-dashed border-gray-400 text-center">Loading analytics...</div>
        )}
        {error && !loading && (
          <div className="p-4 rounded-lg bg-red-100 text-red-800">{error}</div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <h3 className="text-lg font-semibold mb-1">Total Revenue</h3>
                <p className="text-3xl font-bold text-purple-600">${totalRevenue.toFixed(2)}</p>
              </div>
              <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <h3 className="text-lg font-semibold mb-1">Average Order Value</h3>
                <p className="text-3xl font-bold text-blue-600">${Number(data.aov || 0).toFixed(2)}</p>
              </div>
              <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <h3 className="text-lg font-semibold mb-1">Orders</h3>
                <p className="text-3xl font-bold text-green-600">{data.revenueOverTime.reduce((s, d) => s + Number(d.orders || 0), 0)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} lg:col-span-2`}>
                <h2 className="text-xl font-semibold mb-4">Revenue Over Time</h2>
                <div className="space-y-2">
                  {data.revenueOverTime.length === 0 && (
                    <div className="text-gray-500">No sales yet.</div>
                  )}
                  {data.revenueOverTime.map((d) => (
                    <div key={d._id} className="flex items-center gap-3">
                      <div className="w-24 text-sm text-gray-500">{d._id}</div>
                      <div className="flex-1 h-4 rounded bg-gray-200 overflow-hidden">
                        <div className="h-4 bg-purple-600" style={{ width: `${Math.min(100, (Number(d.revenue || 0) / Math.max(1, totalRevenue)) * 100)}%` }} />
                      </div>
                      <div className="w-24 text-right font-medium">${Number(d.revenue || 0).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <h2 className="text-xl font-semibold mb-4">Orders by Status</h2>
                <div className="space-y-2">
                  {data.byStatus.length === 0 && <div className="text-gray-500">No data</div>}
                  {data.byStatus.map((s) => (
                    <div key={s._id} className="flex items-center justify-between">
                      <span className="capitalize">{s._id}</span>
                      <span className="font-semibold">{s.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} mt-6`}>
              <h2 className="text-xl font-semibold mb-4">Top Products</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <th className="text-left p-2">Product</th>
                      <th className="text-right p-2">Revenue</th>
                      <th className="text-right p-2">Quantity</th>
                      <th className="text-right p-2">Orders</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topProducts.length === 0 && (
                      <tr><td colSpan={4} className="p-4 text-center text-gray-500">No products yet</td></tr>
                    )}
                    {data.topProducts.map((p) => (
                      <tr key={p._id} className={`${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
                        <td className="p-2">{p.name || p._id}</td>
                        <td className="p-2 text-right">${Number(p.revenue || 0).toFixed(2)}</td>
                        <td className="p-2 text-right">{p.quantity}</td>
                        <td className="p-2 text-right">{p.orders}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;


