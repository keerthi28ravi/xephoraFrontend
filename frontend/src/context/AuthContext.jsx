import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: restore user session from localStorage token
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('xephora_token');
      if (token) {
        try {
          const res = await authAPI.verify();
          setUser(res.data);
        } catch {
          localStorage.removeItem('xephora_token');
        }
      }
      setLoading(false);
    };
    restoreSession();
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    localStorage.setItem('xephora_token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const signup = async (username, email, password) => {
    const res = await authAPI.signup({ username, email, password });
    localStorage.setItem('xephora_token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('xephora_token');
    setUser(null);
  };

  // Called after game score update to sync fresh user stats
  const refreshUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = { user, loading, login, signup, logout, refreshUser };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
