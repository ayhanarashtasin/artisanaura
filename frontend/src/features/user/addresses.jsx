import React, { useEffect, useState } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { authApi } from '../../api/authApi';
import { useAuth } from '../../contexts/AuthContext';

const Addresses = () => {
  const { isDarkMode } = useDarkMode();
  const { user: contextUser } = useAuth();
  
  const [presentAddress, setPresentAddress] = useState({
    division: '',
    district: '',
    upazila: '',
    address: ''
  });

  const [permanentAddress, setPermanentAddress] = useState({
    division: '',
    district: '',
    upazila: '',
    address: ''
  });

  const [sameAsPresent, setSameAsPresent] = useState(false);

  // Load user address from backend on mount
  useEffect(() => {
    let isMounted = true;
    const loadUserAddress = async () => {
      try {
        const data = await authApi.getMe();
        if (!isMounted) return;
        const u = data?.user || {};
        setPresentAddress(prev => ({
          ...prev,
          division: u.division || '',
          district: u.district || '',
          upazila: u.upazila || ''
        }));
      } catch (error) {
        if (!isMounted) return;
        const u = contextUser || {};
        setPresentAddress(prev => ({
          ...prev,
          division: u.division || '',
          district: u.district || '',
          upazila: u.upazila || ''
        }));
      }
    };
    loadUserAddress();
    return () => { isMounted = false; };
  }, [contextUser]);

  // Keep permanent address synced when checkbox is enabled
  useEffect(() => {
    if (sameAsPresent) {
      setPermanentAddress(presentAddress);
    }
  }, [sameAsPresent, presentAddress]);

  const handlePresentChange = (e) => {
    const { name, value } = e.target;
    setPresentAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePermanentChange = (e) => {
    const { name, value } = e.target;
    setPermanentAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSameAsPresent = (e) => {
    setSameAsPresent(e.target.checked);
    if (e.target.checked) {
      setPermanentAddress(presentAddress);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Present Address:', presentAddress);
    console.log('Permanent Address:', permanentAddress);
    // Handle form submission here
  };

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Address Information
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Present Address Section */}
          <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Present Address
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Division
                </label>
                <input
                  type="text"
                  name="division"
                  value={presentAddress.division}
                  onChange={handlePresentChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Enter division"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  District
                </label>
                <input
                  type="text"
                  name="district"
                  value={presentAddress.district}
                  onChange={handlePresentChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Enter district"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Upazila
                </label>
                <input
                  type="text"
                  name="upazila"
                  value={presentAddress.upazila}
                  onChange={handlePresentChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Enter upazila"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Full Address
              </label>
              <textarea
                name="address"
                value={presentAddress.address}
                onChange={handlePresentChange}
                rows="3"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Enter your complete present address"
              />
            </div>
          </div>

          {/* Permanent Address Section */}
          <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Permanent Address
              </h2>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={sameAsPresent}
                  onChange={handleSameAsPresent}
                  className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Same as present address
                </span>
              </label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Division
                </label>
                <input
                  type="text"
                  name="division"
                  value={permanentAddress.division}
                  onChange={handlePermanentChange}
                  disabled={sameAsPresent}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } ${sameAsPresent ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder="Enter division"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  District
                </label>
                <input
                  type="text"
                  name="district"
                  value={permanentAddress.district}
                  onChange={handlePermanentChange}
                  disabled={sameAsPresent}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } ${sameAsPresent ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder="Enter district"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Upazila
                </label>
                <input
                  type="text"
                  name="upazila"
                  value={permanentAddress.upazila}
                  onChange={handlePermanentChange}
                  disabled={sameAsPresent}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } ${sameAsPresent ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder="Enter upazila"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Full Address
              </label>
              <textarea
                name="address"
                value={permanentAddress.address}
                onChange={handlePermanentChange}
                disabled={sameAsPresent}
                rows="3"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                } ${sameAsPresent ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder="Enter your complete permanent address"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
            >
              Save Addresses
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Addresses;