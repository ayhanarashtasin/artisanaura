// Email/password sign in page
import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useAuth } from '../../contexts/AuthContext';

const SignIn = () => {
  const { isDarkMode } = useDarkMode();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [staySignedIn, setStaySignedIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        const { data } = await api.post('/login', { email, password, staySignedIn }, { withCredentials: true });

        if (data.success) {
            login(data.user, data.token || 'dummy-token');
            // Store user data and token if needed
             if (staySignedIn) {
                localStorage.setItem('staySignedIn', 'true');
            }
            navigate('/');
            // Redirect to dashboard or home
            // navigate('/dashboard');
            // window.location.href = '/dashboard';
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Network error. Please try again.');
    }
};

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <header className={`border-b ${
        isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-orange-500">
              ArtisanAura
            </Link>
            <Link
              to="/register"
              className={`px-4 py-2 rounded-full border transition-colors ${
                isDarkMode
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className={`text-2xl font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Sign in to continue
            </h2>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Enter your password"
              />
            </div>

            {/* Stay Signed In & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="stay-signed-in"
                  name="stay-signed-in"
                  type="checkbox"
                  checked={staySignedIn}
                  onChange={(e) => setStaySignedIn(e.target.checked)}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="stay-signed-in" className={`ml-2 text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Stay signed in
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-orange-500 hover:text-orange-600 underline"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-3 px-4 rounded-full font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
            >
              Log In
            </button>

            {/* Trouble Signing In */}
            <div className="text-center">
              <Link
                to="/help"
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Trouble signing in?
              </Link>
            </div>

            {/* Terms and Privacy */}
            <div className={`text-xs text-center ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <p>
                By clicking Sign in, you agree to ArtisanAura's{' '}
                <Link to="/terms" className="text-orange-500 hover:text-orange-600 underline">
                  Terms of Use
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-orange-500 hover:text-orange-600 underline">
                  Privacy Policy
                </Link>
                .
              </p>
              <p className="mt-2">
                ArtisanAura may send you communications; you may change your preferences in your account settings. 
                We'll never post without your permission.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;