// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);  // Loading state for auth check

  useEffect(() => {
    // Function to load authentication state from sessionStorage
    const loadAuthFromStorage = () => {
      const storedAuthData = JSON.parse(sessionStorage.getItem('authData'));
      
      if (storedAuthData && storedAuthData.role) {
        setIsAuthenticated(true);
        setRole(storedAuthData.role);
      } else {
        setIsAuthenticated(false);  // No auth data found, ensure logged out state
        setRole('');
      }
      
      setLoading(false);  // Auth check completed, stop loading
    };

    loadAuthFromStorage();  // Load authentication data initially

    // Listen for changes in sessionStorage to sync across tabs
    window.addEventListener('storage', loadAuthFromStorage);

    // Cleanup the event listener when component unmounts
    return () => {
      window.removeEventListener('storage', loadAuthFromStorage);
    };
  }, []);

  const login = (userRole) => {
    setIsAuthenticated(true);
    setRole(userRole);
    sessionStorage.setItem('authData', JSON.stringify({ role: userRole }));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole('');
    sessionStorage.removeItem('authData');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
