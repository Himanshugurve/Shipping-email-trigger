import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setIsAuthenticated(true);
      setUser(JSON.parse(user));
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.auth.login(email, password);
      
      // Store token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.admin));
      
      setIsAuthenticated(true);
      setUser(response.admin);
      
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
