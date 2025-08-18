import React, { useEffect, useState } from 'react'
import { useDarkMode } from '../../contexts/DarkModeContext'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const MyShop = () => {
  const { isDarkMode } = useDarkMode()
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [productCount, setProductCount] = useState(0)

  useEffect(() => {
    let isMounted = true
    const fetchProductCount = async () => {
      if (!token) return
      try {
        const res = await axios.get('http://localhost:3000/api/products/myshop', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!isMounted) return
        const items = Array.isArray(res.data) ? res.data : []
        setProductCount(items.length)
      } catch (err) {
        if (!isMounted) return
        setProductCount(0)
      }
    }
    fetchProductCount()
    return () => { isMounted = false }
  }, [token])

  const handleAddProduct = () => {
    navigate('/profile/addproduct')
  }

  const handleShopSettings = () => {
    navigate('/profile/shop-settings')
  }

  const handleViewOrders = () => {
    navigate('/profile/orders')
  }

  const handleAnalytics = () => {
    navigate('/profile/analytics')
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Shop</h1>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Manage your shop, products, and orders
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isDarkMode
                ? 'border border-gray-600 text-gray-300 hover:bg-gray-800'
                : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Home
          </button>
        </div>

        {/* Shop Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <h3 className="text-lg font-semibold mb-2">Total Products</h3>
            <p className="text-3xl font-bold text-blue-600">{productCount}</p>
          </div>
          <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
          </div>
          <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <h3 className="text-lg font-semibold mb-2">Revenue</h3>
            <p className="text-3xl font-bold text-purple-600">$0</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={handleAddProduct}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Add Product
            </button>
            <button 
              onClick={handleViewOrders}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              View Orders
            </button>
            <button 
              onClick={handleShopSettings}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Shop Settings
            </button>
            <button 
              onClick={handleAnalytics}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Analytics
            </button>
          </div>
        </div>

        {/* Empty State */}
        <div className="text-center py-12">
          <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-4 ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Welcome to Your Shop!</h3>
          <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Start by adding your first product to begin selling on ArtisanAura.
          </p>
          <button 
            onClick={handleAddProduct}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Create Your First Product
          </button>
        </div>
      </div>
    </div>
  )
}

export default MyShop