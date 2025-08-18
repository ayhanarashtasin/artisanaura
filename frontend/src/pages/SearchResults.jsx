import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; // Use this hook to read URL query parameters
import axios from 'axios';
import { useDarkMode } from '../contexts/DarkModeContext';
import Header from '../components/common/Header'; // Adjust path if needed

const SearchResults = () => {
  const { isDarkMode } = useDarkMode();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q'); // Get the search query from the URL (e.g., ?q=handmade)

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        // The query is already encoded by the header, but it's good practice
        const encodedQuery = encodeURIComponent(query);
        const response = await axios.get(`http://localhost:3000/api/products/search/${encodedQuery}`);
        setProducts(response.data);
      } catch (err) {
        console.error('Failed to fetch search results:', err);
        setError('An error occurred while searching. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]); // Re-fetch data whenever the search query in the URL changes

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
        <p className={`text-xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>${product.price.toFixed(2)}</p>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-10">Searching for products...</div>;
    }
    if (error) {
      return <div className="text-center py-10 text-red-500">{error}</div>;
    }
    if (products.length === 0) {
      return (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            No products found for "{query}". Try a different search term.
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
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
          Showing results for: <span className="font-semibold">{query}</span>
        </p>
        <div className="mt-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
