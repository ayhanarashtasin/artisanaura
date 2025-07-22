import React, { useState } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { Eye, EyeOff, Shield, Lock, CheckCircle, AlertCircle } from 'lucide-react';

const Security = () => {
  const { isDarkMode } = useDarkMode();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear message when user starts typing
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
    };
  };

  const passwordValidation = validatePassword(passwordData.newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    // Validation
    if (!passwordData.currentPassword) {
      setMessage({ type: 'error', text: 'Current password is required' });
      setIsLoading(false);
      return;
    }

    if (!passwordValidation.isValid) {
      setMessage({ type: 'error', text: 'New password does not meet requirements' });
      setIsLoading(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setIsLoading(false);
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setMessage({ type: 'error', text: 'New password must be different from current password' });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming token-based auth
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to change password' });
      }
    } catch (error) {
      console.error('Password change error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const PasswordInput = ({ label, name, value, onChange, showPassword, toggleShow, placeholder }) => (
    <div>
      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 pr-12 rounded-lg border ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors`}
          required
        />
        <button
          type="button"
          onClick={toggleShow}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
            isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  );

  const ValidationItem = ({ isValid, text }) => (
    <div className={`flex items-center gap-2 text-sm ${
      isValid 
        ? isDarkMode ? 'text-green-400' : 'text-green-600'
        : isDarkMode ? 'text-gray-400' : 'text-gray-500'
    }`}>
      <CheckCircle size={16} className={isValid ? 'text-green-500' : 'text-gray-400'} />
      {text}
    </div>
  );

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Shield className="text-orange-500" size={32} />
          <h1 className={`text-3xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Security Settings
          </h1>
        </div>

        {/* Change Password Section */}
        <div className={`rounded-lg border p-6 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-2 mb-6">
            <Lock className="text-orange-500" size={20} />
            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Change Password
            </h2>
          </div>

          {/* Message Display */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
              message.type === 'success' 
                ? isDarkMode ? 'bg-green-900 text-green-300 border border-green-700' : 'bg-green-50 text-green-800 border border-green-200'
                : isDarkMode ? 'bg-red-900 text-red-300 border border-red-700' : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <PasswordInput
              label="Current Password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handleChange}
              showPassword={showCurrentPassword}
              toggleShow={() => setShowCurrentPassword(!showCurrentPassword)}
              placeholder="Enter your current password"
            />

            {/* New Password */}
            <PasswordInput
              label="New Password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handleChange}
              showPassword={showNewPassword}
              toggleShow={() => setShowNewPassword(!showNewPassword)}
              placeholder="Enter your new password"
            />

            {/* Password Requirements */}
            {passwordData.newPassword && (
              <div className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <p className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Password Requirements:
                </p>
                <div className="space-y-2">
                  <ValidationItem isValid={passwordValidation.minLength} text="At least 8 characters" />
                  <ValidationItem isValid={passwordValidation.hasUpperCase} text="One uppercase letter" />
                  <ValidationItem isValid={passwordValidation.hasLowerCase} text="One lowercase letter" />
                  <ValidationItem isValid={passwordValidation.hasNumbers} text="One number" />
                  <ValidationItem isValid={passwordValidation.hasSpecialChar} text="One special character" />
                </div>
              </div>
            )}

            {/* Confirm Password */}
            <PasswordInput
              label="Confirm New Password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handleChange}
              showPassword={showConfirmPassword}
              toggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
              placeholder="Confirm your new password"
            />

            {/* Password Match Indicator */}
            {passwordData.confirmPassword && (
              <div className={`text-sm ${
                passwordData.newPassword === passwordData.confirmPassword
                  ? isDarkMode ? 'text-green-400' : 'text-green-600'
                  : isDarkMode ? 'text-red-400' : 'text-red-600'
              }`}>
                {passwordData.newPassword === passwordData.confirmPassword 
                  ? '✓ Passwords match' 
                  : '✗ Passwords do not match'
                }
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !passwordValidation.isValid || passwordData.newPassword !== passwordData.confirmPassword}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                isLoading || !passwordValidation.isValid || passwordData.newPassword !== passwordData.confirmPassword
                  ? isDarkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              {isLoading ? 'Changing Password...' : 'Change Password'}
            </button>
          </form>
        </div>

        {/* Security Tips */}
        <div className={`mt-8 p-6 rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-3 ${
            isDarkMode ? 'text-blue-400' : 'text-blue-800'
          }`}>
            Security Tips
          </h3>
          <ul className={`space-y-2 text-sm ${
            isDarkMode ? 'text-gray-300' : 'text-blue-700'
          }`}>
            <li>• Use a unique password that you don't use anywhere else</li>
            <li>• Consider using a password manager to generate and store strong passwords</li>
            <li>• Change your password regularly, especially if you suspect it may be compromised</li>
            <li>• Never share your password with anyone</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Security;