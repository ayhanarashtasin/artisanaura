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

  // Check if user is logged in on app start
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

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('staySignedIn');
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