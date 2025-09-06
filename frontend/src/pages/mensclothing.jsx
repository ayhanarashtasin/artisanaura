// Dedicated men's clothing listing page
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/common/Header'; // Adjust path if needed
import ConfirmDialog from '../components/common/ConfirmDialog';
import { reviewApi } from '../api/reviewApi';
import { useNotifications } from '../contexts/NotificationContext';

// Review modal rendered to body to avoid clipping issues
const ReviewModal = ({
  open,
  onClose,
  isDarkMode,
  product,
  activeTab,
  setActiveTab,
  productReviews,
  shopReviews,
  productRating,
  setProductRating,
  productComment,
  setProductComment,
  shopRating,
  setShopRating,
  shopComment,
  setShopComment,
  submitting,
  submitProductReview,
  submitShopReview,
  signedIn,
  onPickProductImages,
  onPickShopImages,
  productImages,
  shopImages,
}) => {
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className={`relative w-full max-w-4xl mx-4 rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} p-4`}>
              <div className="flex mb-4 border-b">
                <button onClick={() => setActiveTab('product')} className={`px-3 py-2 ${activeTab==='product' ? 'border-b-2 border-orange-500 font-semibold' : ''}`}>Product Reviews</button>
                <button onClick={() => setActiveTab('shop')} className={`px-3 py-2 ${activeTab==='shop' ? 'border-b-2 border-orange-500 font-semibold' : ''}`}>Shop Reviews</button>
              </div>
              <div className={`mb-3 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {(() => {
                  const list = activeTab === 'product' ? productReviews : shopReviews;
                  const count = list.length;
                  const avg = count ? (list.reduce((s, r) => s + (r.rating || 0), 0) / count) : 0;
                  return count
                    ? (<span>Average rating: <span className="font-medium">{avg.toFixed(1)}</span> ({count} {count === 1 ? 'review' : 'reviews'})</span>)
                    : (<span>No reviews yet.</span>);
                })()}
              </div>
              <div className="space-y-3 max-h-96 overflow-auto pr-2">
                {(activeTab === 'product' ? productReviews : shopReviews).map((r) => (
                  <div key={r._id} className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} border rounded p-3`}>
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{r.user?.firstName || 'User'}</div>
                      <div className="text-yellow-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                    </div>
                    {r.comment && <div className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{r.comment}</div>}
                    {Array.isArray(r.images) && r.images.length > 0 && (
                      <div className="mt-2 flex gap-2 flex-wrap">
                        {r.images.map((src, idx) => (
                          <img key={idx} src={`http://localhost:3000${src}`} alt="review" className="w-16 h-16 object-cover rounded border" onError={(e)=>{ e.target.onerror=null; e.target.style.display='none'; }} />
                        ))}
                      </div>
                    )}
                    <div className="text-xs opacity-60">{new Date(r.createdAt).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <div className="text-lg font-semibold mb-1">{product.name}</div>
                <div className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{product.description}</div>
              </div>
              <div className="space-y-6">
                {/* Product review form */}
                <div>
                  <div className="text-sm mb-1">Leave a product review</div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm">Rating:</label>
                    <select disabled={!signedIn} value={productRating} onChange={(e)=>setProductRating(Number(e.target.value))} className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border rounded px-2 py-1 disabled:opacity-60`}>
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <textarea disabled={!signedIn} value={productComment} onChange={(e)=>setProductComment(e.target.value)} rows={3} placeholder="Optional comment" className={`w-full rounded border px-3 py-2 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} disabled:opacity-60`} />
                  <div className="mt-2 flex items-center gap-2">
                    <input disabled={!signedIn} type="file" accept="image/*" multiple onChange={onPickProductImages} />
                    {productImages?.length > 0 && <span className="text-xs opacity-70">{productImages.length} image(s) selected</span>}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button disabled={submitting || !productRating || !signedIn} onClick={submitProductReview} className={`${isDarkMode ? 'bg-orange-600 hover:bg-orange-700' : 'bg-orange-500 hover:bg-orange-600'} text-white px-4 py-2 rounded disabled:opacity-60 disabled:cursor-not-allowed`}>{submitting ? 'Submitting...' : 'Submit Product Review'}</button>
                  </div>
                  {!signedIn && (
                    <div className={`mt-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Please sign in to leave a review.
                    </div>
                  )}
                </div>

                {/* Shop review form */}
                <div>
                  <div className="text-sm mb-1">Leave a shop review</div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm">Rating:</label>
                    <select disabled={!signedIn} value={shopRating} onChange={(e)=>setShopRating(Number(e.target.value))} className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border rounded px-2 py-1 disabled:opacity-60`}>
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <textarea disabled={!signedIn} value={shopComment} onChange={(e)=>setShopComment(e.target.value)} rows={3} placeholder="Optional comment" className={`w-full rounded border px-3 py-2 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} disabled:opacity-60`} />
                  <div className="mt-2 flex items-center gap-2">
                    <input disabled={!signedIn} type="file" accept="image/*" multiple onChange={onPickShopImages} />
                    {shopImages?.length > 0 && <span className="text-xs opacity-70">{shopImages.length} image(s) selected</span>}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button disabled={submitting || !shopRating || !product?.seller?.id || !signedIn} onClick={submitShopReview} className={`${isDarkMode ? 'bg-orange-600 hover:bg-orange-700' : 'bg-orange-500 hover:bg-orange-600'} text-white px-4 py-2 rounded disabled:opacity-60 disabled:cursor-not-allowed`}>{submitting ? 'Submitting...' : 'Submit Shop Review'}</button>
                    <button onClick={onClose} className={`${isDarkMode ? 'border border-gray-600' : 'border border-gray-300'} px-4 py-2 rounded`}>Close</button>
                  </div>
                  {!signedIn && (
                    <div className={`mt-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Please sign in to leave a review.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    document.body
  );
};

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

  const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const { add: notify } = useNotifications();
    const { token } = useAuth();
    const [modalOpen, setModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('product'); // 'product' | 'shop'
    const [productReviews, setProductReviews] = useState([]);
    const [shopReviews, setShopReviews] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [productRating, setProductRating] = useState(5);
    const [productComment, setProductComment] = useState('');
    const [shopRating, setShopRating] = useState(5);
    const [shopComment, setShopComment] = useState('');
    const [productImages, setProductImages] = useState([]);
    const [shopImages, setShopImages] = useState([]);
    const sellerName = product?.seller?.firstName || 'Seller';
    const shopName = product?.seller?.shop?.name || null;
    // Allow reviewing any shop, including user's own

    // Removed duplicate scroll lock; handled inside ReviewModal

    const openReviews = async () => {
      setModalOpen(true);
      try {
        const [pr, sr] = await Promise.all([
          reviewApi.getProductReviews(product._id),
          product?.seller?.id ? reviewApi.getShopReviews(product.seller.id) : Promise.resolve({ reviews: [] })
        ]);
        setProductReviews(Array.isArray(pr?.reviews) ? pr.reviews : []);
        setShopReviews(Array.isArray(sr?.reviews) ? sr.reviews : []);
      } catch (_) {}
    };

    const requestAdd = () => setConfirmOpen(true);
    const handleConfirm = () => {
      const ok = addToCart(product, 1);
      if (ok) {
        notify(`${product.name} added to your cart.`);
      }
      setConfirmOpen(false);
    };
    const handleCancel = () => setConfirmOpen(false);
    const submitProductReview = async () => {
      if (!token) {
        try { localStorage.setItem('postLoginRedirect', window.location?.href || '/'); } catch (_) {}
        if (typeof window !== 'undefined') window.location.href = '/signin';
        return;
      }
      try {
        setSubmitting(true);
        const created = await reviewApi.addProductReview(product._id, { rating: productRating, comment: productComment }, productImages);
        if (created?.review) {
          setProductReviews((prev) => [created.review, ...prev]);
        } else {
          const pr = await reviewApi.getProductReviews(product._id);
          setProductReviews(pr?.reviews || []);
        }
        setProductComment('');
        setProductImages([]);
        notify('Product review submitted.');
      } catch (err) {
        const msg = err?.response?.data?.message || 'Failed to submit review';
        notify(msg);
      } finally {
        setSubmitting(false);
      }
    };

    const submitShopReview = async () => {
      if (!token) {
        try { localStorage.setItem('postLoginRedirect', window.location?.href || '/'); } catch (_) {}
        if (typeof window !== 'undefined') window.location.href = '/signin';
        return;
      }
      try {
        setSubmitting(true);
        const sellerId = product?.seller?.id;
        if (!sellerId) {
          notify('Unable to identify shop for this product.');
          return;
        }
        const created = await reviewApi.addShopReview(sellerId, { rating: shopRating, comment: shopComment }, shopImages);
        if (created?.review) {
          setShopReviews((prev) => [created.review, ...prev]);
        } else {
          const sr = await reviewApi.getShopReviews(sellerId);
          setShopReviews(sr?.reviews || []);
        }
        setShopComment('');
        setShopImages([]);
        notify('Shop review submitted.');
      } catch (err) {
        const msg = err?.response?.data?.message || 'Failed to submit review';
        notify(msg);
      } finally {
        setSubmitting(false);
      }
    };
    return (
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
          <div className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <span>Posted by: </span>
            <span className="font-medium">{sellerName}</span>
            {shopName && (
              <>
                <span> • Shop: </span>
                <Link
                  to={`/shop/${product.seller.id}`}
                  className={isDarkMode ? 'text-orange-400 hover:underline' : 'text-orange-600 hover:underline'}
                >
                  {shopName}
                </Link>
              </>
            )}
          </div>
          <p className={`text-xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>${product.price.toFixed(2)}</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={requestAdd}
              className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${isDarkMode ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-orange-500 text-white hover:bg-orange-600'}`}
            >
              Add to Cart
            </button>
            <button
              onClick={openReviews}
              className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'}`}
            >
              Reviews
            </button>
          </div>
        </div>
        <ConfirmDialog
          open={confirmOpen}
          title="Add to cart?"
          description={`Add "${product.name}" to your cart for $${product.price.toFixed(2)}?`}
          confirmText="Add"
          cancelText="Cancel"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
        <ReviewModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          isDarkMode={isDarkMode}
          product={product}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          
          productReviews={productReviews}
          shopReviews={shopReviews}
          productRating={productRating}
          setProductRating={setProductRating}
          productComment={productComment}
          setProductComment={setProductComment}
          shopRating={shopRating}
          setShopRating={setShopRating}
          shopComment={shopComment}
          setShopComment={setShopComment}
          submitting={submitting}
          submitProductReview={submitProductReview}
          submitShopReview={submitShopReview}
          signedIn={Boolean(token)}
          onPickProductImages={(e)=> setProductImages(Array.from(e.target.files || []))}
          onPickShopImages={(e)=> setShopImages(Array.from(e.target.files || []))}
          productImages={productImages}
          shopImages={shopImages}
        />
      </div>
    );
  };

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
