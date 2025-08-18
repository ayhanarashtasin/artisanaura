import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useDarkMode } from '../../contexts/DarkModeContext';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import Toast from '../../components/common/Toast';

const ShopSettings = () => {
  const { isDarkMode } = useDarkMode();
  const location = useLocation();
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef(null);
  const productCount = products.length;
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchUserProducts = async () => {
      if (!token) {
        setError('Authentication required. Please log in.');
        setLoading(false);
        return;
      }

      try {
        setError(null);
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/products/myshop', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setProducts(response.data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError(err.response?.data?.message || 'An error occurred while fetching your products.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProducts();
  }, [token]);

  // Show toast passed via navigation state
  useEffect(() => {
    const navToast = location.state?.toast;
    if (navToast) {
      setToast(navToast);
      // Clear state so it doesn't repeat on back/forward
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const refreshProducts = async () => {
    if (!token) return;
    try {
      const response = await axios.get('http://localhost:3000/api/products/myshop', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setProducts(response.data);
    } catch (_) {}
  };

  const openEdit = (product) => {
    setEditingProduct({ ...product });
    setEditPreview(null);
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    setIsEditOpen(false);
    setEditingProduct(null);
    setEditPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      const formData = new FormData();
      formData.append('name', editingProduct.name);
      formData.append('description', editingProduct.description);
      formData.append('price', editingProduct.price);
      formData.append('category', editingProduct.category || '');
      formData.append('subcategory', editingProduct.subcategory || '');
      if (editingProduct._newImage) {
        formData.append('image', editingProduct._newImage);
      }

      await axios.put(`http://localhost:3000/api/products/${editingProduct._id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      await refreshProducts();
      setToast({ type: 'success', message: 'Product updated successfully.' });
      closeEdit();
    } catch (err) {
      console.error('Failed to update product:', err);
      setToast({ type: 'error', message: err?.response?.data?.message || 'Failed to update product' });
    }
  };

  const openDelete = (product) => {
    setProductToDelete(product);
    setIsDeleteOpen(true);
  };

  const closeDelete = () => {
    setIsDeleteOpen(false);
    setProductToDelete(null);
    setIsDeleting(false);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await axios.delete(`http://localhost:3000/api/products/${productToDelete._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setProducts((prev) => prev.filter((p) => p._id !== productToDelete._id));
      setToast({ type: 'success', message: 'Product deleted.' });
      closeDelete();
    } catch (err) {
      console.error('Failed to delete product:', err);
      setToast({ type: 'error', message: err?.response?.data?.message || 'Failed to delete product' });
      setIsDeleting(false);
    }
  };

  const ProductCard = ({ product }) => (
    <div className={`rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <img 
        className="w-full h-48 object-cover" 
        src={`http://localhost:3000${product.imageUrl}`} 
        alt={product.name} 
        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/2d3748/ffffff?text=Image+Error'; }}
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
        <p className={`text-xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>${product.price.toFixed(2)}</p>
        <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} whitespace-pre-line`}>{product.description}</p>
      </div>
      <div className={`px-4 py-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => openEdit(product)}
            className="text-sm font-medium text-blue-500 hover:text-blue-400"
          >
            Edit
          </button>
          <button
            onClick={() => openDelete(product)}
            className="text-sm font-medium text-red-500 hover:text-red-400"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-10">Loading your products...</div>;
    }

    if (error) {
      return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    if (products.length === 0) {
      return (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold mb-2">Your shop is empty!</h2>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>You haven't added any products yet. Let's change that.</p>
          <Link to="/profile/addproduct" className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
            Add Your First Product
          </Link>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => <ProductCard key={product._id} product={product} />)}
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Shop</h1>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Manage your shop, products, and orders</p>
          </div>
          <Link to="/profile/addproduct" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            + Add New Product
          </Link>
          <Link to="/" className={`ml-3 px-4 py-2 rounded-lg transition-colors ${isDarkMode ? 'border border-gray-600 text-gray-300 hover:bg-gray-800' : 'border border-gray-300 text-gray-700 hover:bg-gray-100'}`}>
            Home
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`rounded-xl p-6 shadow ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Products</h3>
            <div className={`mt-3 text-4xl font-extrabold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{productCount}</div>
          </div>
        </div>

        {renderContent()}
      </div>

      {/* Edit Modal */}
      {isEditOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`w-full max-w-2xl rounded-lg shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Edit Product</h3>
              <button onClick={closeEdit} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <form onSubmit={submitEdit} className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-1">Name</label>
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className={`w-full px-3 py-2 rounded-md border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Price</label>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                      className={`w-full px-3 py-2 rounded-md border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Category</label>
                    <input
                      type="text"
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className={`w-full px-3 py-2 rounded-md border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Subcategory</label>
                    <input
                      type="text"
                      value={editingProduct.subcategory}
                      onChange={(e) => setEditingProduct({ ...editingProduct, subcategory: e.target.value })}
                      className={`w-full px-3 py-2 rounded-md border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1">Image</label>
                  <div className="space-y-3">
                    <img
                      src={editPreview || `http://localhost:3000${editingProduct.imageUrl}`}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded"
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setEditingProduct({ ...editingProduct, _newImage: file });
                          setEditPreview(URL.createObjectURL(file));
                        }
                      }}
                      className="block w-full text-sm"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Description</label>
                <textarea
                  rows={4}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className={`w-full px-3 py-2 rounded-md border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeEdit} className={`px-4 py-2 rounded border ${isDarkMode ? 'border-gray-600 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-100'}`}>Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Modal */}
      {isDeleteOpen && productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`w-full max-w-md rounded-lg shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="px-6 py-5">
              <h3 className="text-lg font-semibold mb-2">Delete product</h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Are you sure you want to delete <span className="font-medium">{productToDelete.name}</span>? This action cannot be undone.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={closeDelete} className={`px-4 py-2 rounded border ${isDarkMode ? 'border-gray-600 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-100'}`}>Cancel</button>
                <button onClick={handleDelete} disabled={isDeleting} className={`px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white ${isDeleting ? 'opacity-70 cursor-not-allowed' : ''}`}>{isDeleting ? 'Deleting...' : 'Delete'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {toast && (
        <Toast type={toast.type} message={toast.message} duration={3000} onClose={() => setToast(null)} />
      )}
    </div>
  );
};

export default ShopSettings;
