import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const SESSION_KEY = 'certiflow_active_session_v1';
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes auto-logout

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      // Clear legacy permanent localStorage session if any exists
      localStorage.removeItem('certiflow_user');
      const saved = sessionStorage.getItem(SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [sessionNotice, setSessionNotice] = useState('');

  // Auto Logout Inactivity Monitor
  useEffect(() => {
    if (!user) return;

    let timeoutId;

    const resetInactivityTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        logout('Session expired due to 15 minutes of inactivity. Please sign in again.');
      }, INACTIVITY_TIMEOUT_MS);
    };

    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    activityEvents.forEach((event) => window.addEventListener(event, resetInactivityTimer));

    resetInactivityTimer();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      activityEvents.forEach((event) => window.removeEventListener(event, resetInactivityTimer));
    };
  }, [user]);

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
      loginTime: new Date().toISOString(),
    };

    setUser(userObj);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(userObj));
    setSessionNotice('');
    return true;
  };

  const logout = (noticeMsg = '') => {
    setUser(null);
    try {
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem('certiflow_user');
    } catch (e) {
      console.warn('Could not clear session storage', e);
    }
    if (noticeMsg) {
      setSessionNotice(noticeMsg);
    }
  };

  const clearSessionNotice = () => {
    setSessionNotice('');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, sessionNotice, clearSessionNotice }}>
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
