import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('certiflow_user');
    return saved ? JSON.parse(saved) : { email: 'admin@certiflow.com', name: 'HR Administrator', role: 'ADMIN' };
  });

  const login = (email, password) => {
    // Basic verification - for dev/production integration
    const userObj = {
      email: email || 'admin@certiflow.com',
      name: email ? email.split('@')[0].toUpperCase() + ' User' : 'HR Administrator',
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
