import React, { createContext, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, getMe } from '../api/auth';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── On app startup: restore session via /auth/me/ ──
  // This validates the stored token and gets the latest user+permissions from the server.
  // Avoids stale role/permission data from localStorage.
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('access');
      if (!token) {
        setLoading(false);
        return;
      }

      // Set the token so the getMe() request is authenticated
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      try {
        const userData = await getMe();
        setUser(userData);
      } catch (err) {
        // Token invalid or expired and refresh also failed → force clean state
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // ── Login ──
  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    // Store both tokens
    localStorage.setItem('access', data.access);
    localStorage.setItem('refresh', data.refresh);
    // Set axios default header
    api.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
    // Store the full user object (nested role + permissions array)
    setUser(data.user);
  };

  // ── Logout ──
  const logout = async () => {
    const refreshToken = localStorage.getItem('refresh');
    try {
      // Send refresh token in body as required by the API
      await apiLogout(refreshToken);
    } catch (e) {
      // Even if server logout fails, we still clear local state
      console.warn('Server logout failed, clearing local session anyway.');
    } finally {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {/* Render children only after session restore attempt is complete */}
      {!loading && children}
    </AuthContext.Provider>
  );
};
