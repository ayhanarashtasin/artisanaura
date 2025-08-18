import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useAuth } from '../../contexts/AuthContext';
import { authApi } from '../../api/authApi';

const Emails = () => {
  const { isDarkMode } = useDarkMode();
  const { user, token, login, logout } = useAuth();
  const navigate = useNavigate();
  
  const [currentEmail, setCurrentEmail] = useState(user?.email || '');
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [resendSeconds, setResendSeconds] = useState(0);

  // Load the most up-to-date email from the backend on mount
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const data = await authApi.getMe();
        if (data?.success && data.user) {
          setCurrentEmail(data.user.email || '');
          // Refresh auth context with latest user info, keep a valid token if present
          const storedToken = localStorage.getItem('token');
          if (storedToken && storedToken !== 'null' && storedToken !== 'undefined') {
            login(data.user, storedToken);
          } else if (token) {
            // Fall back to context token if available
            login(data.user, token);
          }
        }
      } catch (err) {
        console.error('Failed to load current user:', err);
        // Fall back to auth context user if available
        if (user?.email) {
          setCurrentEmail(user.email);
        }
      }
    };
    loadCurrentUser();
  }, []);

  // Keep currentEmail in sync if AuthContext user loads/changes later
  useEffect(() => {
    if (user?.email && !isEditing && !isVerificationStep) {
      setCurrentEmail(user.email);
    }
  }, [user?.email, isEditing, isVerificationStep]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newEmail !== confirmEmail) {
      alert('New email addresses do not match');
      return;
    }

    try {
      const data = await authApi.updateEmail({ currentEmail, newEmail, password });

      if (data.success) {
        alert('Email updated successfully. Please sign in again with your new email.');
        setCurrentEmail(newEmail);
        setNewEmail('');
        setConfirmEmail('');
        setPassword('');
        setIsEditing(false);
        setIsVerificationStep(false);
        setVerificationCode('');
        setResendSeconds(0);
        // Log out and redirect to sign-in so session restarts under the new email
        logout();
        navigate('/signin', { replace: true });
      } else {
        alert(data.message || 'Failed to update email');
      }
    } catch (error) {
      console.error('Email update error:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleCancel = () => {
    setNewEmail('');
    setConfirmEmail('');
    setPassword('');
    setIsEditing(false);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
  };

  const handleResend = async () => {};

  useEffect(() => {}, [resendSeconds]);

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-2xl mx-auto">
        <h1 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Email Settings
        </h1>

        <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Change Email Address
          </h2>

          {!isEditing && !isVerificationStep ? (
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Current Email
                </label>
                <div className={`p-3 rounded-md border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}>
                  {currentEmail}
                </div>
              </div>
              
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
              >
                Change Email
              </button>
            </div>
          ) : isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Current Email
                </label>
                <input
                  type="email"
                  value={currentEmail}
                  disabled
                  className={`w-full px-3 py-2 border rounded-md ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-400' : 'bg-gray-100 border-gray-300 text-gray-500'} cursor-not-allowed`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  New Email Address
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Enter new email address"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Confirm New Email
                </label>
                <input
                  type="email"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  required
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Confirm new email address"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Current Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Enter your current password"
                />
              </div>

              <div className={`p-4 rounded-md ${isDarkMode ? 'bg-yellow-900 border border-yellow-700' : 'bg-yellow-50 border border-yellow-200'}`}>
                <p className={`text-sm ${isDarkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>
                  <strong>Note:</strong> Your email will be updated immediately after submitting the form.
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                >
                  Update Email
                </button>
                
                <button
                  type="button"
                  onClick={handleCancel}
                  className={`px-4 py-2 border rounded-md transition-colors ${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className={`p-4 rounded-md ${isDarkMode ? 'bg-blue-900 border border-blue-700' : 'bg-blue-50 border border-blue-200'}`}>
                <p className={`${isDarkMode ? 'text-blue-100' : 'text-blue-800'} text-sm`}>
                  We sent a 6-digit verification code to <strong>{currentEmail}</strong>. Enter it below to verify your email.
                </p>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Verification Code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  required
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Enter 6-digit code"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                >
                  Verify Email
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendSeconds > 0}
                  className={`px-4 py-2 border rounded-md transition-colors ${
                    resendSeconds > 0
                      ? 'opacity-60 cursor-not-allowed ' + (isDarkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700')
                      : isDarkMode 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {resendSeconds > 0 ? `Resend in ${resendSeconds}s` : 'Resend Code'}
                </button>
              </div>

              <button
                type="button"
                onClick={() => { setIsVerificationStep(false); setVerificationCode(''); }}
                className={`px-4 py-2 text-sm underline mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
              >
                I'll verify later
              </button>
            </form>
          )}
        </div>

        {/* Email Preferences Section */}
        <div className={`mt-8 p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Email Preferences
          </h2>
          
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Receive order updates and shipping notifications
              </span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Receive promotional emails and special offers
              </span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Receive newsletter and product updates
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Emails;