import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/common/Header';

const StatCard = ({ label, value }) => (
  <div className="p-4 rounded-lg border bg-white">
    <div className="text-sm text-gray-500">{label}</div>
    <div className="text-2xl font-semibold">{value}</div>
  </div>
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [tab, setTab] = useState('users');
  const [helpItems, setHelpItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [sum, list, prod, ord, rev, help] = await Promise.all([
          adminApi.getSummary(),
          adminApi.getUsers(),
          adminApi.getProducts(),
          adminApi.getOrders(),
          adminApi.getReviews(),
          (await import('../../api/helpApi')).helpApi.adminList(),
        ]);
        setSummary(sum?.data || null);
        setUsers(list?.users || []);
        setProducts(prod?.products || []);
        setOrders(ord?.orders || []);
        setReviews(rev?.reviews || []);
        setHelpItems(help?.items || []);
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const onChangeRole = async (id, role) => {
    try {
      await adminApi.updateUserRole(id, role);
      setUsers(prev => prev.map(u => (u._id === id ? { ...u, role } : u)));
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to update role');
    }
  };

  const onUpdateProduct = async (id, payload) => {
    try {
      const res = await adminApi.updateProduct(id, payload);
      if (res?.success) setProducts(prev => prev.map(p => (p._id === id ? res.product : p)));
    } catch (e) { alert('Failed to update product'); }
  };

  const onDeleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      const res = await adminApi.deleteProduct(id);
      if (res?.success) setProducts(prev => prev.filter(p => p._id !== id));
    } catch (e) { alert('Failed to delete product'); }
  };

  const onUpdateOrder = async (id, status) => {
    try {
      const res = await adminApi.updateOrderStatus(id, status);
      if (res?.success) setOrders(prev => prev.map(o => (o._id === id ? res.order : o)));
    } catch (e) { alert('Failed to update order'); }
  };

  const onDeleteReview = async (id) => {
    if (!confirm('Delete this review?')) return;
    try {
      const res = await adminApi.deleteReview(id);
      if (res?.success) setReviews(prev => prev.filter(r => r._id !== id));
    } catch (e) { alert('Failed to delete review'); }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div>
      <Header />
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        {summary && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Users" value={summary.userCount} />
            <StatCard label="Products" value={summary.productCount} />
            <StatCard label="Orders" value={summary.orderCount} />
          </div>
        )}

        <div className="flex gap-2">
          {['users','products','orders','reviews','help'].map(k => (
            <button key={k} onClick={() => setTab(k)} className={`px-3 py-2 rounded ${tab===k?'bg-orange-500 text-white':'bg-gray-200'}`}>{k[0].toUpperCase()+k.slice(1)}</button>
          ))}
        </div>

        {tab==='users' && (
        <div className="border rounded-lg overflow-hidden">
          <div className="p-4 border-b bg-gray-50 font-medium">Users</div>
          <div className="divide-y">
            {users.map(u => (
              <div key={u._id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{u.firstName} <span className="text-gray-500">({u.email})</span></div>
                  <div className="text-sm text-gray-500">Joined {new Date(u.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    className="border rounded px-2 py-1"
                    value={u.role || 'user'}
                    onChange={(e) => onChangeRole(u._id, e.target.value)}
                    disabled={user?.id === u._id}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}

        {tab==='help' && (
        <div className="border rounded-lg overflow-hidden">
          <div className="p-4 border-b bg-gray-50 font-medium">Help Requests</div>
          <div className="divide-y">
            {helpItems.map(h => (
              <div key={h._id} className="p-4 flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">{h.subject} <span className="text-xs text-gray-500">by {h.user?.email || 'User'}</span></div>
                  <div className="text-sm text-gray-500">{new Date(h.createdAt).toLocaleString()} • {h.status}</div>
                  <div className="text-sm mt-1 whitespace-pre-wrap">{h.message}</div>
                </div>
                <div className="flex gap-2">
                  {['open','in_progress','resolved'].map(s => (
                    <button key={s} onClick={async()=>{ const { helpApi } = await import('../../api/helpApi'); const res = await helpApi.adminUpdateStatus(h._id, s); if (res?.success) setHelpItems(prev => prev.map(x => x._id===h._id ? res.item : x)); }} className={`px-2 py-1 border rounded ${h.status===s?'bg-gray-200':''}`}>{s}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        )}
        {tab==='products' && (
        <div className="border rounded-lg overflow-hidden">
          <div className="p-4 border-b bg-gray-50 font-medium">Products</div>
          <div className="divide-y">
            {products.map(p => (
              <div key={p._id} className="p-4 grid grid-cols-1 md:grid-cols-6 gap-3 items-center">
                <div className="md:col-span-2">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm text-gray-500">{p.category} / {p.subcategory}</div>
                </div>
                <input defaultValue={p.price} type="number" step="0.01" className="border rounded px-2 py-1" onBlur={(e)=>onUpdateProduct(p._id,{ price:Number(e.target.value) })} />
                <input defaultValue={p.name} className="border rounded px-2 py-1" onBlur={(e)=>onUpdateProduct(p._id,{ name:e.target.value })} />
                <input defaultValue={p.imageUrl} className="border rounded px-2 py-1" onBlur={(e)=>onUpdateProduct(p._id,{ imageUrl:e.target.value })} />
                <button onClick={()=>onDeleteProduct(p._id)} className="text-red-600">Delete</button>
              </div>
            ))}
          </div>
        </div>
        )}

        {tab==='orders' && (
        <div className="border rounded-lg overflow-hidden">
          <div className="p-4 border-b bg-gray-50 font-medium">Orders</div>
          <div className="divide-y">
            {orders.map(o => (
              <div key={o._id} className="p-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-medium">Total ${o.total} • {new Date(o.createdAt).toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Status: {o.status}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>onUpdateOrder(o._id,'paid')} className="px-3 py-1 border rounded">Mark paid</button>
                  <button onClick={()=>onUpdateOrder(o._id,'refunded')} className="px-3 py-1 border rounded">Refund</button>
                  <button onClick={()=>onUpdateOrder(o._id,'cancelled')} className="px-3 py-1 border rounded">Cancel</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}

        {tab==='reviews' && (
        <div className="border rounded-lg overflow-hidden">
          <div className="p-4 border-b bg-gray-50 font-medium">Reviews</div>
          <div className="divide-y">
            {reviews.map(r => (
              <div key={r._id} className="p-4 flex items-center justify-between gap-3">
                <div>
                  <div className="font-medium">{r.user?.firstName || r.user?.email || 'User'} rated {r.rating}/5</div>
                  <div className="text-sm text-gray-500">{r.product?.name || r.shop?.email || 'N/A'} • {new Date(r.createdAt).toLocaleString()}</div>
                  <div className="text-sm">{r.comment}</div>
                </div>
                <button onClick={()=>onDeleteReview(r._id)} className="text-red-600">Delete</button>
              </div>
            ))}
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;


