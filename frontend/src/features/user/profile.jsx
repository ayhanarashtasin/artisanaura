import React from 'react'
import { useDarkMode } from '../../contexts/DarkModeContext'
import { useAuth } from '../../contexts/AuthContext'
import { User, Shield, Globe, Lock, MapPin, CreditCard, Mail } from 'lucide-react'

const Profile = () => {
  const { isDarkMode } = useDarkMode()
  const { user } = useAuth()

  const profileCards = [
    {
      id: 'account',
      title: 'Account',
      description: 'Manage your account settings and preferences',
      icon: User,
      href: '/profile/account'
    },
    {
      id: 'security',
      title: 'Security',
      description: 'Password, two-factor authentication, and login activity',
      icon: Shield,
      href: '/profile/security'
    },
    {
      id: 'public-profile',
      title: 'Public Profile',
      description: 'Manage your public profile information and visibility',
      icon: Globe,
      href: '/profile/public'
    },
    {
      id: 'privacy',
      title: 'Privacy',
      description: 'Control your privacy settings and data preferences',
      icon: Lock,
      href: '/profile/privacy'
    },
    {
      id: 'addresses',
      title: 'Addresses',
      description: 'Manage your shipping and billing addresses',
      icon: MapPin,
      href: '/profile/addresses'
    },
    {
      id: 'credit-cards',
      title: 'Credit Cards',
      description: 'Manage your payment methods and billing information',
      icon: CreditCard,
      href: '/profile/payment'
    },
    {
      id: 'emails',
      title: 'Emails',
      description: 'Manage email preferences and notification settings',
      icon: Mail,
      href: '/profile/emails'
    }
  ]

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Profile Settings
          </h1>
          <p className={`mt-2 text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage your account settings and preferences
          </p>
        </div>

        {/* Profile Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profileCards.map((card) => {
            const IconComponent = card.icon
            return (
              <div
                key={card.id}
                className={`group cursor-pointer rounded-lg border p-6 transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 hover:border-orange-500' 
                    : 'bg-white border-gray-200 hover:border-orange-500'
                }`}
                onClick={() => window.location.href = card.href}
              >
                <div className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 p-3 rounded-lg transition-colors duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 group-hover:bg-orange-500' 
                      : 'bg-gray-100 group-hover:bg-orange-500'
                  }`}>
                    <IconComponent 
                      size={24} 
                      className={`transition-colors duration-200 ${
                        isDarkMode 
                          ? 'text-gray-300 group-hover:text-white' 
                          : 'text-gray-600 group-hover:text-white'
                      }`} 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-lg font-semibold transition-colors duration-200 ${
                      isDarkMode 
                        ? 'text-white group-hover:text-orange-400' 
                        : 'text-gray-900 group-hover:text-orange-600'
                    }`}>
                      {card.title}
                    </h3>
                    <p className={`mt-2 text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* User Info Section */}
        {user && (
          <div className={`mt-8 p-6 rounded-lg border ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <h2 className={`text-xl font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Current User
            </h2>
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <User size={24} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
              </div>
              <div>
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {user.firstName || 'User'}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile