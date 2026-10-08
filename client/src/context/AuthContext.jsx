import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Re-hydrate session on page refresh
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) { setLoading(false); return; }

    api.get('/auth/me')
      .then(res => setUser(res.data.data))
      .catch(() => {
        sessionStorage.removeItem('token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // ── login(email, password) ─────────────────────────────────────────────
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, data: userData } = res.data;
      sessionStorage.setItem('token', token);
      setUser(userData);
      toast.success(`Welcome back, ${userData.name}! 👋`);
      return true;           // success signal for Login.jsx
    } catch (err) {
      const msg = err?.response?.data?.message || 'Login failed. Check your credentials.';
      toast.error(msg);
      return false;
    }
  };

  // ── register(formData) ─────────────────────────────────────────────────
  const register = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);
      const { token, data: userData } = res.data;
      sessionStorage.setItem('token', token);
      setUser(userData);
      toast.success(`Account created! Welcome, ${userData.name}! 🎉`);
      return true;
    } catch (err) {
      const msg = err?.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
      return false;
    }
  };

  // ── logout ─────────────────────────────────────────────────────────────
  const logout = () => {
    sessionStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully.');
  };

  // ── updateProfile ──────────────────────────────────────────────────────
  const updateProfile = async (data) => {
    try {
      const res = await api.put('/auth/profile', data);
      setUser(res.data.data);
      toast.success('Profile updated!');
      return true;
    } catch (err) {
      toast.error('Failed to update profile.');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export default AuthContext;

