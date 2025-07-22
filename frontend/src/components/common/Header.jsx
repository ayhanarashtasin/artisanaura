import React, { useState, useEffect, useRef } from 'react';
import { Search, Heart, Gift, ShoppingCart, Menu, Sun, Moon, User, Bell, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useDarkMode } from '../../contexts/DarkModeContext';

const Header = () => {
  const [showTooltip, setShowTooltip] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false); // State for account menu
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { user, logout } = useAuth();

  const categoryRef = useRef(null);
  const accountMenuRef = useRef(null); // Ref for account menu

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
            <Link to="/" className="text-orange-500 text-2xl font-bold">ArtisanAura</Link>
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
                    <li key={category} className={`px-4 py-2 text-sm cursor-pointer ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                      {category}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="flex-1 max-w-2xl mx-6">
            <div className="relative">
              <input type="text" placeholder="Search for anything" className={`w-full px-4 py-2 border-2 rounded-full focus:border-orange-500 focus:outline-none transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`} />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors">
                <Search size={16} />
              </button>
            </div>
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
                
                <div className="relative" onMouseEnter={() => setShowTooltip('notifications')} onMouseLeave={() => setShowTooltip('')}>
                    <button className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-gray-300 hover:text-orange-400' : 'text-gray-700 hover:text-orange-500'}`}>
                        <Bell size={20} />
                    </button>
                    {showTooltip === 'notifications' && ( <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-white px-3 py-1 rounded-md text-sm z-50 whitespace-nowrap ${isDarkMode ? 'bg-gray-700' : 'bg-gray-800'}`}>Notifications<div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent ${isDarkMode ? 'border-b-gray-700' : 'border-b-gray-800'}`}></div></div> )}
                </div>

                <div className="relative" onMouseEnter={() => setShowTooltip('help')} onMouseLeave={() => setShowTooltip('')}>
                    <button className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-gray-300 hover:text-orange-400' : 'text-gray-700 hover:text-orange-500'}`}>
                        <HelpCircle size={20} />
                    </button>
                    {showTooltip === 'help' && ( <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-white px-3 py-1 rounded-md text-sm z-50 whitespace-nowrap ${isDarkMode ? 'bg-gray-700' : 'bg-gray-800'}`}>Help<div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent ${isDarkMode ? 'border-b-gray-700' : 'border-b-gray-800'}`}></div></div> )}
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
                      <button onClick={logout} className={`block w-full text-left px-4 py-2 text-sm ${isDarkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'}`}>
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="relative" onMouseEnter={() => setShowTooltip('cart')} onMouseLeave={() => setShowTooltip('')}>
                  <button className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-gray-300 hover:text-orange-400' : 'text-gray-700 hover:text-orange-500'}`}>
                    <ShoppingCart size={20} />
                  </button>
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
                    <button className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-gray-300 hover:text-orange-400' : 'text-gray-700 hover:text-orange-500'}`}>
                        <ShoppingCart size={20} />
                    </button>
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
            <Link to="/register" className={`transition-colors ${isDarkMode ? 'text-gray-300 hover:text-orange-400' : 'text-gray-700 hover:text-orange-500'}`}>
              Registry
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;