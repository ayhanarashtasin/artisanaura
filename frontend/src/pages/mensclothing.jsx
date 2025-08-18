import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDarkMode } from '../contexts/DarkModeContext';
import Header from '../components/common/Header'; // Adjust path if needed

const MensClothing = () => {
  const { isDarkMode } = useDarkMode();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMensClothing = async () => {
      try {
        setLoading(true);
        setError(null);

        // Hardcoded category and subcategory for this specific page
        const category = "Fashion Favorites";
        const subcategory = "Men's Clothing";

        // Encode for the URL
        const encodedCategory = encodeURIComponent(category);
        const encodedSubcategory = encodeURIComponent(subcategory);

        const response = await axios.get(
          `http://localhost:3000/api/products/category/${encodedCategory}/${encodedSubcategory}`
        );
        
        setProducts(response.data);
      } catch (err) {
        console.error('Failed to fetch men\'s clothing:', err);
        setError('Could not load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMensClothing();
  }, []); // Empty dependency array means this runs only once on mount

  const ProductCard = ({ product }) => (
    <div className={`rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <img 
        className="w-full h-56 object-cover" 
        src={`http://localhost:3000${product.imageUrl}`} 
        alt={product.name} 
        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/2d3748/ffffff?text=Image+Error'; }}
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 truncate">{product.name}</h3>
        {product.description && (
          <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {product.description}
          </p>
        )}
        <p className={`text-xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>${product.price.toFixed(2)}</p>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-10">Loading Men's Clothing...</div>;
    }
    if (error) {
      return <div className="text-center py-10 text-red-500">{error}</div>;
    }
    if (products.length === 0) {
      return (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            No products are available in the Men's Clothing category yet.
          </p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => <ProductCard key={product._id} product={product} />)}
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">Men's Clothing</h1>
        {renderContent()}
      </div>
    </div>
  );
};

export default MensClothing;
