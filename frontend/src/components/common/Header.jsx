// Global top navigation, search, notifications, and category menu
import React, { useState, useEffect, useRef } from 'react';
import { Search, Heart, Gift, ShoppingCart, Menu, Sun, Moon, User, Bell, HelpCircle,MessageCircle, Package, Shield, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useDarkMode } from '../../contexts/DarkModeContext';
import Chatbot from './chatbot';
import { orderApi } from '../../api/orderApi';
import { useNotifications } from '../../contexts/NotificationContext';

const Header = () => {
  const [showTooltip, setShowTooltip] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { user, logout } = useAuth();
  const [buyerOrderCount, setBuyerOrderCount] = useState(0);
  const [sellerOrderCount, setSellerOrderCount] = useState(0);
  const prevSellerCountRef = useRef(0);
  const navigate = useNavigate();

  const categoryRef = useRef(null);
  const accountMenuRef = useRef(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { items: notifications, unread, markAllRead, clearAll, add } = useNotifications?.() || { items: [], unread: 0, markAllRead: () => {}, clearAll: () => {}, add: () => {} };
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);
  const [buyerUnseen, setBuyerUnseen] = useState(0);
  const [notifBadge, setNotifBadge] = useState(0);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [helpSubject, setHelpSubject] = useState('');
  const [helpMessage, setHelpMessage] = useState('');
  const [helpSubmitting, setHelpSubmitting] = useState(false);
  const [helpError, setHelpError] = useState('');

  // Close popovers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setIsAccountMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Poll order counts; notify seller on new orders
  useEffect(() => {
    let active = true;
    let intervalId = null;
    const fetchCounts = async () => {
      try {
        if (!user) { setBuyerOrderCount(0); setSellerOrderCount(0); prevSellerCountRef.current = 0; return; }
        const [buyerData, sellerData] = await Promise.all([
          orderApi.buyerOrders(),
          orderApi.sellerOrders(),
        ]);
        if (!active) return;
        const nextBuyerCount = Array.isArray(buyerData?.orders) ? buyerData.orders.length : 0;
        const nextSellerCount = Array.isArray(sellerData?.orders) ? sellerData.orders.length : 0;
        setBuyerOrderCount(nextBuyerCount);
        setSellerOrderCount(nextSellerCount);
        // Compute unseen for buyer orders using last seen count in localStorage
        try {
          const seenRaw = localStorage.getItem('buyerOrdersSeenCount');
          const seen = seenRaw ? Number(seenRaw) : 0;
          const unseen = Math.max(0, nextBuyerCount - (Number.isFinite(seen) ? seen : 0));
          setBuyerUnseen(unseen);
        } catch (_) {}
        // Persist last known seller order count across refresh, and notify only when it increases
        try {
          const storedSeller = Number(localStorage.getItem('sellerLastOrderCount'));
          if (!Number.isFinite(storedSeller)) {
            localStorage.setItem('sellerLastOrderCount', String(nextSellerCount));
          } else if (nextSellerCount > storedSeller) {
            const delta = nextSellerCount - storedSeller;
            add && add(delta === 1 ? 'A user bought your product' : `${delta} users bought your products`);
            localStorage.setItem('sellerLastOrderCount', String(nextSellerCount));
          }
        } catch (_) {}
        if (nextSellerCount > prevSellerCountRef.current) {
          // Session-level guard to avoid duplicate notification within same tab before storage write cycles
          // Do nothing here, storage handling above covers persistency
        }
        prevSellerCountRef.current = nextSellerCount;
      } catch (_e) {
        if (active) { /* ignore */ }
      }
    };
    fetchCounts();
    intervalId = setInterval(fetchCounts, 15000);
    return () => { active = false; if (intervalId) clearInterval(intervalId); };
  }, [user, add]);

  // Keep a local unread badge in sync with provider
  useEffect(() => {
    // Initialize from persisted value if available; fall back to provider unread
    try {
      const persisted = Number(localStorage.getItem('notificationsUnread'));
      if (Number.isFinite(persisted)) {
        setNotifBadge(persisted);
      } else {
        setNotifBadge(unread);
      }
    } catch (_) {
      setNotifBadge(unread);
    }
  }, [unread]);

  // Clear unread badge when dropdown opens
  useEffect(() => {
    if (isNotifOpen) {
      try { markAllRead(); } catch (_) {}
      setNotifBadge(0);
      try { localStorage.setItem('notificationsUnread', '0'); } catch (_) {}
    }
  }, [isNotifOpen, markAllRead]);

  // Navigate to search page with query
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page with query parameter
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleChat = () => {
  setIsChatOpen(!isChatOpen);
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const categories = [
    'Accessories', 'Art & Collectibles', 'Baby', 'Bags & Purses', 'Bath & Beauty',
    'Books, Movies & Music', 'Clothing', 'Craft Supplies & Tools', 'Electronics & Accessories',
    'Gifts', 'Home & Living', 'Jewelry', 'Paper & Party Supplies', 'Pet Supplies',
    'Shoes', 'Toys & Games', 'Weddings'
  ];

  return (
    <header className={`${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b transition-colors duration-200`}>
      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-6">
            <Link to="/" aria-label="Go to Home" className="flex items-center group">
              <svg className="w-8 h-8 text-orange-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2l2.6 5.7 6.3.9-4.5 4.3 1.1 6.3L12 16.9 6.5 19.2 7.6 13 3.1 8.6l6.3-.9L12 2z"/>
              </svg>
              <span className="ml-2 text-2xl font-bold text-orange-500 group-hover:text-orange-600 transition-colors">ArtisanAura</span>
            </Link>
            <div className="relative hidden md:block" ref={categoryRef}>
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className={`flex items-center space-x-1 ${isDarkMode ? 'text-gray-300 hover:text-orange-400' : 'text-gray-700 hover:text-orange-500'} transition-colors`}
              >
                <Menu size={20} />
                <span>Categories</span>
              </button>
              {isCategoryOpen && (
                <ul className={`absolute top-full left-0 mt-2 w-56 rounded-md shadow-lg py-1 z-20 ${isDarkMode ? 'bg-gray-800 ring-1 ring-gray-700' : 'bg-white ring-1 ring-black ring-opacity-5'}`}>
                  {categories.map((category) => (
                    <li
                      key={category}
                      className={`px-4 py-2 text-sm cursor-pointer ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                      onClick={() => {
                        setIsCategoryOpen(false);
                        if (category === 'Clothing') {
                          navigate('/clothing');
                        }
                      }}
                    >
                      {category}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="flex-1 max-w-2xl mx-6">
            <form onSubmit={handleSearch} className="relative">
              <input 
                type="text" 
                placeholder="Search for anything" 
                value={searchQuery}
                onChange={handleSearchInputChange}
                onKeyPress={handleKeyPress}
                className={`w-full px-4 py-2 border-2 rounded-full focus:border-orange-500 focus:outline-none transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`} 
              />
              <button 
                type="submit"
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                aria-label="Search"
              >
                <Search size={16} />
              </button>
            </form>
          </div>

          <div className="flex items-center space-x-2">
            <button onClick={toggleDarkMode} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-yellow-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`} title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* == Conditional Rendering Start == */}
            {user ? (
              // Show Account Info if logged in
              <div className="flex items-center space-x-2">
                <div className="relative" onMouseEnter={() => setShowTooltip('favorites')} onMouseLeave={() => setShowTooltip('')}>
                  <button className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-gray-300 hover:text-orange-400' : 'text-gray-700 hover:text-orange-500'}`}>
                    <Heart size={20} />
                  </button>
                  {showTooltip === 'favorites' && ( <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-white px-3 py-1 rounded-md text-sm z-50 whitespace-nowrap ${isDarkMode ? 'bg-gray-700' : 'bg-gray-800'}`}>Favorites<div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent ${isDarkMode ? 'border-b-gray-700' : 'border-b-gray-800'}`}></div></div> )}
                </div>
                
                <div className="relative" ref={notifRef}>
                    <button onClick={() => { setIsNotifOpen(!isNotifOpen); if (!isNotifOpen) { markAllRead(); setNotifBadge(0); try { localStorage.setItem('notificationsUnread', '0'); } catch (_) {} } }} className={`relative p-2 rounded-full transition-colors ${isDarkMode ? 'text-gray-300 hover:text-orange-400' : 'text-gray-700 hover:text-orange-500'}`}>
                        <Bell size={20} />
                        {notifBadge > 0 && (
                          <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] leading-4 px-1.5 rounded-full">{notifBadge}</span>
                        )}
                    </button>
                    {isNotifOpen && (
                      <div className={`absolute right-0 mt-2 w-80 max-h-96 overflow-auto rounded-md shadow-lg z-30 ${isDarkMode ? 'bg-gray-800 ring-1 ring-gray-700' : 'bg-white ring-1 ring-black ring-opacity-5'}`}>
                        <div className={`px-3 py-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Notifications</div>
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                          {notifications.length === 0 ? (
                            <li className={`px-4 py-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No notifications</li>
                          ) : (
                            notifications.map(n => (
                              <li key={n.id} className={`px-4 py-3 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{n.message}</li>
                            ))
                          )}
                        </ul>
                        <div className="px-3 py-2 flex justify-end gap-2">
                          <button onClick={clearAll} className={`text-xs ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>Clear all</button>
                        </div>
                      </div>
                    )}
                </div>

                <div className="relative">
                    <button onClick={()=> setIsHelpOpen(true)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-gray-300 hover:text-orange-400' : 'text-gray-700 hover:text-orange-500'}`}>
                        <HelpCircle size={20} />
                    </button>
                </div>

                <div className="relative" ref={accountMenuRef}>
                  <button
                    onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                    className={`p-2 rounded-full transition-colors border-2 ${isAccountMenuOpen ? 'border-orange-500' : 'border-transparent'} ${isDarkMode ? 'text-gray-300 hover:text-orange-400' : 'text-gray-700 hover:text-orange-500'}`}
                  >
                    <User size={20} />
                  </button>
                  {isAccountMenuOpen && (
                    <div className={`absolute top-full right-0 mt-2 w-56 rounded-md shadow-lg py-1 z-20 ${isDarkMode ? 'bg-gray-800 ring-1 ring-gray-700' : 'bg-white ring-1 ring-black ring-opacity-5'}`}>
                      <div className="px-4 py-2 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}">
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Signed in as</p>
                        <p className={`font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.email || 'User'}</p>
                      </div>
                      <Link to="/profile" className={`block px-4 py-2 text-sm w-full text-left ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>Your Account</Link>
                      <Link to="/purchases" className={`block px-4 py-2 text-sm w-full text-left ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>Purchases</Link>
                      {user?.role === 'admin' && (
                        <Link to="/admin" className={`block px-4 py-2 text-sm w-full text-left ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                          Admin
                        </Link>
                      )}
                      <button onClick={logout} className={`block w-full text-left px-4 py-2 text-sm ${isDarkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'}`}>
                        Sign out
                      </button>
                      <button onClick={() => logout(true)} className={`block w-full text-left px-4 py-2 text-sm ${isDarkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'}`}>
                        Sign out everywhere
                      </button>
                    </div>
                  )}
                </div>

                {/* Orders icon (buyer view) */}
                <div className="relative mr-2" onMouseEnter={() => setShowTooltip('orders')} onMouseLeave={() => setShowTooltip('')}>
                  <Link to="/orders" aria-label="View orders" className={`relative p-2 rounded-full transition-colors ${isDarkMode ? 'text-gray-300 hover:text-orange-400' : 'text-gray-700 hover:text-orange-500'}`}
                    onClick={() => { try { localStorage.setItem('buyerOrdersSeenCount', String(buyerOrderCount)); setBuyerUnseen(0); } catch (_) {} }}>
                    <Package size={20} />
                    {buyerUnseen > 0 && (
                      <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] leading-4 px-1.5 rounded-full">{buyerUnseen}</span>
                    )}
                  </Link>
                  {showTooltip === 'orders' && ( <div className={`absolute top-full right-0 mt-2 text-white px-3 py-1 rounded-md text-sm z-50 whitespace-nowrap ${isDarkMode ? 'bg-gray-700' : 'bg-gray-800'}`}>Orders<div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent ${isDarkMode ? 'border-b-gray-700' : 'border-b-gray-800'}`}></div></div> )}
                </div>
                
                <div className="relative" onMouseEnter={() => setShowTooltip('cart')} onMouseLeave={() => setShowTooltip('')}>
                  <Link to="/cart" aria-label="View cart" className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-gray-300 hover:text-orange-400' : 'text-gray-700 hover:text-orange-500'}`}>
                    <ShoppingCart size={20} />
                  </Link>
                  {showTooltip === 'cart' && ( <div className={`absolute top-full right-0 mt-2 text-white px-3 py-1 rounded-md text-sm z-50 whitespace-nowrap ${isDarkMode ? 'bg-gray-700' : 'bg-gray-800'}`}>Cart<div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent ${isDarkMode ? 'border-b-gray-700' : 'border-b-gray-800'}`}></div></div> )}
                </div>

              </div>
            ) : (
              // Show Sign In button if logged out
              <div className="flex items-center space-x-4">
                  <Link to="/signin" className={`px-4 py-2 rounded-full border transition-all duration-200 hover:scale-105 active:scale-95 ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-orange-400' : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-orange-500'}`}>
                    Sign in
                  </Link>

                  <div className="relative" onMouseEnter={() => setShowTooltip('favorites')} onMouseLeave={() => setShowTooltip('')}>
                    <button className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-gray-300 hover:text-orange-400' : 'text-gray-700 hover:text-orange-500'}`}>
                        <Heart size={20} />
                    </button>
                    {showTooltip === 'favorites' && ( <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-white px-3 py-1 rounded-md text-sm z-50 whitespace-nowrap ${isDarkMode ? 'bg-gray-700' : 'bg-gray-800'}`}>Favorites<div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent ${isDarkMode ? 'border-b-gray-700' : 'border-b-gray-800'}`}></div></div> )}
                  </div>

                  <div className="relative" onMouseEnter={() => setShowTooltip('cart')} onMouseLeave={() => setShowTooltip('')}>
                    <Link to="/cart" aria-label="View cart" className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-gray-300 hover:text-orange-400' : 'text-gray-700 hover:text-orange-500'}`}>
                        <ShoppingCart size={20} />
                    </Link>
                    {showTooltip === 'cart' && ( <div className={`absolute top-full right-0 mt-2 text-white px-3 py-1 rounded-md text-sm z-50 whitespace-nowrap ${isDarkMode ? 'bg-gray-700' : 'bg-gray-800'}`}>Cart<div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent ${isDarkMode ? 'border-b-gray-700' : 'border-b-gray-800'}`}></div></div> )}
                  </div>
              </div>
            )}
            {/* == Conditional Rendering End == */}

          </div>
        </div>

        {/* This bottom nav can also be conditionally rendered or modified based on auth state if needed */}
        <nav className={`hidden md:block border-t py-3 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-8">
            <Link to="/gift" className={`flex items-center space-x-1 transition-colors ${isDarkMode ? 'text-gray-300 hover:text-orange-400' : 'text-gray-700 hover:text-orange-500'}`}>
              <Gift size={16} />
              <span>Gifts</span>
            </Link>
            <Link to="/homefavourites" className={`transition-colors ${isDarkMode ? 'text-gray-300 hover:text-orange-400' : 'text-gray-700 hover:text-orange-500'}`}>
              Home Favorites
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className={`flex items-center space-x-1 transition-colors ${isDarkMode ? 'text-gray-300 hover:text-orange-400' : 'text-gray-700 hover:text-orange-500'}`}>
                <Shield size={16} />
                <span>Admin</span>
              </Link>
            )}
            
            <button
              onClick={toggleChat}
              type="button"
              className={`transition-colors ${isDarkMode ? 'text-gray-300 hover:text-orange-400' : 'text-gray-700 hover:text-orange-500'}`}
              aria-label="Open chat assistant"
            >
              <MessageCircle size={28} />
            </button>
          </div>
        </nav>
      </div>
      {/* Chatbot overlay mounted at root so it appears on all pages */}
      <Chatbot open={isChatOpen} onOpenChange={setIsChatOpen} hideToggleButton />

      {/* Help Center Modal */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={()=>setIsHelpOpen(false)} />
          <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} w-full max-w-lg mx-4 rounded-lg shadow-2xl relative`}>
            <div className={`flex items-center justify-between px-4 py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="font-semibold">Help Center</div>
              <button onClick={()=>setIsHelpOpen(false)} className={`p-1 rounded ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}><X size={18} /></button>
            </div>
            <form onSubmit={async (e)=>{ e.preventDefault(); setHelpError(''); setHelpSubmitting(true); try { const { helpApi } = await import('../../api/helpApi'); const res = await helpApi.submit({ subject: helpSubject, message: helpMessage }); if (res?.success) { setHelpSubject(''); setHelpMessage(''); setIsHelpOpen(false); add && add('Help request submitted', { type: 'success' }); } else { setHelpError(res?.message || 'Failed to submit'); } } catch (err) { setHelpError('Failed to submit'); } finally { setHelpSubmitting(false); } }} className="p-4 space-y-3">
              {helpError && <div className="text-sm text-red-600">{helpError}</div>}
              <div>
                <label className="block text-sm mb-1">Subject</label>
                <input value={helpSubject} onChange={(e)=>setHelpSubject(e.target.value)} required className={`w-full border rounded px-3 py-2 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`} placeholder="Briefly describe the issue" />
              </div>
              <div>
                <label className="block text-sm mb-1">Message</label>
                <textarea value={helpMessage} onChange={(e)=>setHelpMessage(e.target.value)} required rows={5} className={`w-full border rounded px-3 py-2 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`} placeholder="Provide more details" />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={()=>setIsHelpOpen(false)} className={`px-3 py-2 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>Cancel</button>
                <button disabled={helpSubmitting} className={`px-3 py-2 rounded ${helpSubmitting ? 'opacity-60 cursor-not-allowed' : 'bg-orange-500 text-white hover:bg-orange-600'}`}>{helpSubmitting ? 'Submitting...' : 'Submit'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;