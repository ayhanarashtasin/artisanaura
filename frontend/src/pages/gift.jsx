import React from 'react'
import { useDarkMode } from '../contexts/DarkModeContext'

const Gift = () => {
  const { isDarkMode } = useDarkMode()

  const giftCategories = [
    { 
      name: 'Wedding', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
          <path d="M5 22h14a2 2 0 0 0 2-2V9a1 1 0 0 0-1-1h-3v-.5a3.5 3.5 0 0 0-7 0V8H7a1 1 0 0 0-1 1v11a2 2 0 0 0 2 2z" />
          <path d="M12 6.5a1.5 1.5 0 0 1-1.5-1.5A1.5 1.5 0 0 1 12 3.5a1.5 1.5 0 0 1 1.5 1.5A1.5 1.5 0 0 1 12 6.5z" />
          <path d="M8 11h8" />
          <path d="M8 14h8" />
          <path d="M8 17h8" />
        </svg>
      )
    },
    { 
      name: 'Birthday', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
          <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
          <path d="M4 21h16" />
          <path d="M12 11V3" />
          <path d="M12 3c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2z" />
          <path d="M12 3c0 1 1 2 2 2s2-1 2-2-1-2-2-2-2 1-2 2z" />
        </svg>
      )
    },
    { 
      name: 'Anniversary', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      )
    },
    { 
      name: 'Thank You', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      )
    },
    { 
      name: 'Sympathy', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      )
    },
    { 
      name: 'Get Well', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
          <path d="M20 10c0-4.4-3.6-8-8-8s-8 3.6-8 8 3.6 8 8 8h8" />
          <path d="M16 16c0-2.2-1.8-4-4-4s-4 1.8-4 4 1.8 4 4 4s4-1.8 4-4z" />
        </svg>
      )
    },
    { 
      name: 'Engagement', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="4" />
          <line x1="12" y1="2" x2="12" y2="4" />
          <line x1="12" y1="20" x2="12" y2="22" />
          <line x1="4" y1="12" x2="2" y2="12" />
          <line x1="22" y1="12" x2="20" y2="12" />
        </svg>
      )
    },
    { 
      name: 'New Baby', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    },
    { 
      name: 'Expecting Parent', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
          <line x1="6" y1="1" x2="6" y2="4" />
          <line x1="10" y1="1" x2="10" y2="4" />
          <line x1="14" y1="1" x2="14" y2="4" />
        </svg>
      )
    },
    { 
      name: 'Just Because', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
          <path d="M12 3v18" />
          <path d="M5.63 5.63L12 12l6.37-6.37" />
        </svg>
      )
    },
    { 
      name: 'Housewarming', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    },
  ]

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-white'
    }`}>
      <div className="gift-container max-w-7xl mx-auto px-4 py-12">
        <h1 className={`text-4xl font-bold text-center mb-4 transition-colors duration-300 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Extra-special gifting made extra-easy
        </h1>
        <h2 className={`text-xl text-center mb-16 transition-colors duration-300 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Discover perfect picks for the occasion!
        </h2>
        
        <div className="gift-categories flex flex-wrap justify-center gap-x-8 gap-y-10">
          {giftCategories.map((category, index) => (
            <div key={index} className="category-item flex flex-col items-center cursor-pointer group">
              <div className={`icon-container rounded-full p-4 mb-3 w-20 h-20 flex items-center justify-center transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800 group-hover:bg-gray-700 text-gray-300' 
                  : 'bg-gray-100 group-hover:bg-gray-200 text-gray-700'
              }`}>
                {category.icon}
              </div>
              <span className={`text-sm font-medium transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Gift;