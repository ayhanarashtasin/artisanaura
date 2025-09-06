// Aggregated view for Clothing showing Men, Women, Kids sections
import React, { useEffect, useState } from 'react';
import Header from '../components/common/Header';
import { useDarkMode } from '../contexts/DarkModeContext';
import axios from 'axios';

const sections = [
  { title: "Men's Clothing", category: 'Fashion Favorites', subcategory: "Men's Clothing" },
  { title: "Women's Clothing", category: 'Fashion Favorites', subcategory: "Women's Clothing" },
  { title: 'Kids & Baby Clothing', category: 'Fashion Favorites', subcategory: 'Kids & Baby Clothing' },
];

const ProductGrid = ({ products, isDarkMode }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {products.map((p) => (
      <div key={p._id} className={`rounded-lg overflow-hidden shadow ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {p.imageUrl && (
          <img src={`http://localhost:3000${p.imageUrl}`} alt={p.name} className="w-full h-48 object-cover" onError={(e)=>{ e.target.style.display='none'; }} />
        )}
        <div className="p-4">
          <div className="font-semibold truncate">{p.name}</div>
          {p.description && <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{p.description}</div>}
          <div className="mt-2 font-bold">${Number(p.price || 0).toFixed(2)}</div>
        </div>
      </div>
    ))}
  </div>
);

const Clothing = () => {
  const { isDarkMode } = useDarkMode();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchAll = async () => {
      try {
        const requests = sections.map((s) => {
          const url = `http://localhost:3000/api/products/category/${encodeURIComponent(s.category)}/${encodeURIComponent(s.subcategory)}`;
          return axios.get(url).then((res) => ({ key: s.title, items: res.data || [] }));
        });
        const results = await Promise.all(requests);
        if (!mounted) return;
        const next = {};
        results.forEach((r) => { next[r.key] = r.items; });
        setData(next);
      } catch (_e) {
        setData({});
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
    return () => { mounted = false; };
  }, []);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        <h1 className="text-3xl font-bold">Clothing</h1>
        {loading ? (
          <div>Loading...</div>
        ) : (
          sections.map((s) => (
            <section key={s.title} className="space-y-4">
              <h2 className="text-2xl font-semibold">{s.title}</h2>
              <ProductGrid products={data[s.title] || []} isDarkMode={isDarkMode} />
            </section>
          ))
        )}
      </div>
    </div>
  );
};

export default Clothing;


