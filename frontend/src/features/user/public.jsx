import React, { useEffect, useState } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useAuth } from '../../contexts/AuthContext';
import { authApi } from '../../api/authApi';
import { useNavigate } from 'react-router-dom';

const PublicProfile = () => {
  const { isDarkMode } = useDarkMode();
  const { user, token, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      setError(null);
      try {
        // Ensure latest user from backend
        const me = await authApi.getMe();
        if (me?.success && me.user) {
          const storedToken = localStorage.getItem('token');
          if (storedToken && storedToken !== 'null' && storedToken !== 'undefined') {
            login(me.user, storedToken);
          } else if (token) {
            login(me.user, token);
          }
        }
        const res = await authApi.getShop();
        if (!isMounted) return;
        const s = res?.shop || {};
        setForm({ name: s.name || '', address: s.address || '' });
      } catch (_) {
        // ignore
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    init();
    return () => { isMounted = false; };
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!form.name.trim() || !form.address.trim()) {
      setError('Please provide both shop name and address.');
      return;
    }
    try {
      setSaving(true);
      const res = await authApi.saveShop({ name: form.name.trim(), address: form.address.trim() });
      if (res?.success) {
        setSuccess('Shop profile saved successfully.');
        // refresh user in context to include shop
        try {
          const me = await authApi.getMe();
          if (me?.success && me.user) {
            const storedToken = localStorage.getItem('token');
            const t = (storedToken && storedToken !== 'null' && storedToken !== 'undefined') ? storedToken : token;
            if (t) login(me.user, t);
          }
        } catch (_) {}
        setTimeout(() => navigate('/profile/shop'), 800);
      } else {
        setError(res?.message || 'Failed to save shop.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Network error while saving shop.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Public Profile - Shop Setup</h1>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Create your shop to unlock My Shop features.</p>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className={`px-4 py-2 rounded-lg transition-colors ${isDarkMode ? 'border border-gray-600 text-gray-300 hover:bg-gray-800' : 'border border-gray-300 text-gray-700 hover:bg-gray-100'}`}
          >
            Back
          </button>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              {error && <div className="text-red-600 text-sm">{error}</div>}
              {success && <div className="text-green-600 text-sm">{success}</div>}
              <div>
                <label className="block text-sm font-medium mb-1">Shop Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="e.g., Handmade by Alice"
                  className={`w-full px-3 py-2 rounded-md border ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Shop Address</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={onChange}
                  placeholder="Street, City, Region"
                  rows={3}
                  className={`w-full px-3 py-2 rounded-md border ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className={`px-4 py-2 rounded-lg ${saving ? 'opacity-70 cursor-not-allowed' : ''} ${isDarkMode ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}
                >
                  {saving ? 'Saving...' : 'Save Shop'}
                </button>
                <button type="button" onClick={() => navigate('/profile/shop')} className={`px-4 py-2 rounded-lg ${isDarkMode ? 'border border-gray-600 text-gray-300 hover:bg-gray-800' : 'border border-gray-300 text-gray-700 hover:bg-gray-100'}`}>
                  Go to My Shop
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;


