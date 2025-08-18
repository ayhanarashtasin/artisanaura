import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Data for categories and subcategories
const categories = ['Home Favorites', 'Gifts', 'Fashion Favorites'];
const subcategories = {
  'Home Favorites': ['Home Decor', 'Wall Art', 'Kitchen & Dining', 'Furniture', 'Area Rugs', 'Lighting', 'Bedding', 'Storage & Organization', 'Home Improvement', 'Bathroom', 'Curtains', 'Outdoor & Garden'],
  'Gifts': ['Wedding', 'Birthday', 'Anniversary', 'Thank You', 'Sympathy', 'Get Well', 'Engagement', 'New Baby', 'Expecting Parent', 'Just Because', 'Housewarming'],
  'Fashion Favorites': ["Women's Clothing", "Men's Clothing", "Kids & Baby Clothing", "Ships Free: Linen Clothing", "Lounge & Sleepwear", "Accessories", "Handbags", "Necklaces", "Rings"]
};

const AddProduct = () => {
  const { isDarkMode } = useDarkMode();
  const { token } = useAuth();
  const navigate = useNavigate();

  // State for all form fields
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [availableSubcategories, setAvailableSubcategories] = useState([]);

  // States for loading and errors
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // This effect runs when the 'category' state changes
  useEffect(() => {
    if (category) {
      // If a category is selected, update the list of available subcategories
      setAvailableSubcategories(subcategories[category] || []);
    } else {
      // If no category is selected, clear the subcategories
      setAvailableSubcategories([]);
    }
    // Reset the selected subcategory whenever the main category changes
    setSubcategory('');
  }, [category]);

  // Handles the file input change for the image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create a temporary URL for the image preview
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handles form submission
  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // 👇 ADD THIS CHECK FOR DEBUGGING
  if (!token) {
    setError("Authentication Error: You must be logged in to add a product.");
    console.error("handleSubmit was called without an auth token.");
    return;
  }

  setLoading(true);
  setError(null);

  const formData = new FormData();
  formData.append('name', productName);
  formData.append('description', description);
  formData.append('price', price);
  formData.append('category', category);
  formData.append('subcategory', subcategory);
  formData.append('image', imageFile);

  try {
    const response = await axios.post(
      'http://localhost:3000/api/products',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    console.log('Product created successfully:', response.data);
    navigate('/profile/shop-settings', { state: { toast: { type: 'success', message: 'Product submitted successfully!' } } });

  } catch (err) {
    console.error('Failed to create product:', err);
    setError(err.response?.data?.message || 'An error occurred. Please try again.');
  } finally {
    setLoading(false);
  }
};

  // Common Tailwind classes for form inputs
  const inputClasses = `w-full px-3 py-2 border rounded-lg transition-colors ${
    isDarkMode
      ? 'bg-gray-700 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
      : 'bg-white border-gray-300 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500'
  }`;

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <h1 className="text-4xl font-extrabold mb-2">Add a New Product</h1>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
              Fill out the details below to list a new item in your shop.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isDarkMode ? 'border border-gray-600 text-gray-300 hover:bg-gray-800' : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Home
          </button>
        </div>

        <form onSubmit={handleSubmit} className={`mt-10 p-8 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {/* Error message display */}
          {error && (
            <div className="md:col-span-2 p-3 mb-4 text-center text-red-800 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Text Inputs */}
            <div className="space-y-6">
              <div>
                <label htmlFor="productName" className="block text-sm font-medium mb-1">Product Name</label>
                <input type="text" id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} className={inputClasses} placeholder="e.g., Handcrafted Wooden Bowl" required />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="6" className={inputClasses} placeholder="Describe your product in detail..." required></textarea>
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium mb-1">Price ($)</label>
                <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} className={inputClasses} placeholder="e.g., 49.99" min="0.01" step="0.01" required />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
                <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className={inputClasses} required>
                  <option value="" disabled>Select a category</option>
                  {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="subcategory" className="block text-sm font-medium mb-1">Subcategory</label>
                <select id="subcategory" value={subcategory} onChange={(e) => setSubcategory(e.target.value)} className={inputClasses} disabled={!category} required>
                  <option value="" disabled>Select a subcategory</option>
                  {availableSubcategories.map((subcat) => <option key={subcat} value={subcat}>{subcat}</option>)}
                </select>
              </div>
            </div>

            {/* Right Column: Image Uploader */}
            <div>
              <label className="block text-sm font-medium mb-1">Product Image</label>
              <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 rounded-md ${isDarkMode ? 'border-gray-600 border-dashed' : 'border-gray-300 border-dashed'}`}>
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <div>
                      <img src={imagePreview} alt="Product Preview" className="mx-auto h-48 w-auto rounded-md object-cover" />
                      <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} className="mt-4 text-sm text-red-500 hover:text-red-700">Remove Image</button>
                    </div>
                  ) : (
                    <>
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                        </label>
                        <p className={`pl-1 ${isDarkMode ? 'text-gray-400' : ''}`}>or drag and drop</p>
                      </div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : ''}`}>PNG, JPG, GIF up to 10MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="mt-10 flex justify-end gap-4">
            <button type="button" onClick={() => navigate(-1)} className={`px-6 py-2 border rounded-lg transition-colors ${isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'}`}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
              disabled={!productName || !price || !category || !subcategory || !imageFile || loading}
            >
              {loading ? 'Submitting...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;