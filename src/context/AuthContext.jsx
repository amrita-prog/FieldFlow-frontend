import React, { createContext, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout } from '../api/auth';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('access');
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    localStorage.setItem('access', data.access);
    localStorage.setItem('refresh', data.refresh);
    localStorage.setItem('user', JSON.stringify(data.user));
    api.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (e) {
      console.error("Logout failed on server", e);
    } finally {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
