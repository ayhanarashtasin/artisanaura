import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDarkMode } from '../contexts/DarkModeContext';
import { authApi } from '../api/authApi';
import Header from '../components/common/Header';

const ShopDetails = () => {
  const { sellerId } = useParams();
  const { isDarkMode } = useDarkMode();
  const [shop, setShop] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setError(null);
      try {
        const res = await authApi.getShopBySeller(sellerId);
        if (!mounted) return;
        if (res?.success) {
          setShop(res.shop || null);
          setSeller(res.seller || null);
        } else {
          setError(res?.message || 'Failed to load shop info.');
        }
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data?.message || 'Network error');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [sellerId]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Shop Details</h1>
          <Link to="/" className={isDarkMode ? 'border border-gray-600 px-3 py-1 rounded hover:bg-gray-800' : 'border border-gray-300 px-3 py-1 rounded hover:bg-gray-100'}>Home</Link>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : !shop ? (
          <div className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>This seller has not set up a public shop yet.</div>
        ) : (
          <div className={`border rounded-lg p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <div className="mb-4">
              <div className="text-sm uppercase tracking-wide opacity-70">Owner</div>
              <div className="text-lg font-semibold">{seller?.firstName || 'Seller'}</div>
            </div>
            <div className="mb-3">
              <div className="text-sm uppercase tracking-wide opacity-70">Shop Name</div>
              <div className="text-xl font-bold">{shop.name}</div>
            </div>
            <div>
              <div className="text-sm uppercase tracking-wide opacity-70">Address</div>
              <div className="whitespace-pre-line">{shop.address}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopDetails;


