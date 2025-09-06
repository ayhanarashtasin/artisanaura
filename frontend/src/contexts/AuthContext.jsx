// AuthContext: stores current user and token, provides login/logout helpers
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore user and token from localStorage on app start
  useEffect(() => {
    const rawToken = localStorage.getItem('token');
    const rawUser = localStorage.getItem('user');

    const validToken = rawToken && rawToken !== 'null' && rawToken !== 'undefined' ? rawToken : null;
    let parsedUser = null;
    if (rawUser && rawUser !== 'null' && rawUser !== 'undefined') {
      try {
        parsedUser = JSON.parse(rawUser);
      } catch (_err) {
        parsedUser = null;
      }
    }

    if (validToken) setToken(validToken);
    if (parsedUser) setUser(parsedUser);
    setIsLoading(false);
  }, []);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Logout current session; optionally from all sessions
  const logout = async (everywhere = false) => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('staySignedIn');
    // Also clear cart storage to prevent showing old items
    try { localStorage.removeItem('cart'); } catch (_) {}
    try {
      if (everywhere) {
        await (await import('../api/authApi')).authApi.logoutAll();
      } else {
        await (await import('../api/authApi')).authApi.logout();
      }
    } catch (_) {}
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};