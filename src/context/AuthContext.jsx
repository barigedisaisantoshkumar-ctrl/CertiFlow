import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('certiflow_user');
    return saved ? JSON.parse(saved) : { email: 'director@thehps.in', name: 'HPS Director', role: 'ADMIN' };
  });

  const login = (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    
    // Validate required credentials
    const isDirector = cleanEmail === 'director@thehps.in' && password === 'AdminHPS#2026';
    const isLegacyAdmin = cleanEmail === 'admin@certiflow.com' && password === 'admin123';

    if (!isDirector && !isLegacyAdmin) {
      throw new Error('Invalid email or password. Please check your credentials.');
    }

    const userObj = {
      email: cleanEmail,
      name: cleanEmail === 'director@thehps.in' ? 'HPS Director' : 'HR Administrator',
      role: 'ADMIN',
    };
    setUser(userObj);
    localStorage.setItem('certiflow_user', JSON.stringify(userObj));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('certiflow_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
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
