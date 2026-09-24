import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock initialization
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user", e);
      }
    } else {
      // Mock default for dev if needed, or leave null
      // setUser({ id: 1, name: 'John Doe', role: 'student', initials: 'JD' });
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    // Mock login logic
    const mockUser = {
      id: 1,
      name: credentials.email.split('@')[0],
      email: credentials.email,
      role: credentials.role || 'student', // Mock role selection
      initials: credentials.email.substring(0, 2).toUpperCase()
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    setLoading(false);
    return mockUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = (data) => {
    setUser(prev => {
      const updated = { ...prev, ...data };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
