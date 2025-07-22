import React from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { Edit } from 'lucide-react';

const Account = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Account Information
          </h1>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Edit size={16} />
            Edit Profile
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* First Name and Last Name Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                First Name
              </label>
              <input
                type="text"
                className={`w-full px-4 py-3 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-600 text-gray-300' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                readOnly
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Last Name
              </label>
              <input
                type="text"
                className={`w-full px-4 py-3 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-600 text-gray-300' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                readOnly
              />
            </div>
          </div>

          {/* Email and Phone Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email Address
              </label>
              <input
                type="email"
                className={`w-full px-4 py-3 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-600 text-gray-300' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                readOnly
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Phone Number <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>(Cannot be changed)</span>
              </label>
              <input
                type="tel"
                className={`w-full px-4 py-3 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-600 text-gray-500' 
                    : 'bg-gray-100 border-gray-300 text-gray-500'
                } cursor-not-allowed`}
                readOnly
                disabled
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Bio
            </label>
            <textarea
              rows={4}
              className={`w-full px-4 py-3 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-600 text-gray-300' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none`}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;