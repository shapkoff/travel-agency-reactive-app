import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Guest by default; restore session only if user explicitly logged in
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ta_user_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.username) {
          return parsed;
        }
      } catch (e) {}
    }
    return null;
  });

  const [isBackendOnline, setIsBackendOnline] = useState(false);

  useEffect(() => {
    // Check backend connection
    api.checkBackendStatus().then(online => {
      setIsBackendOnline(online);
    });

    const interval = setInterval(() => {
      api.checkBackendStatus().then(online => setIsBackendOnline(online));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const login = async (username, password) => {
    const response = await api.auth.login(username, password);
    const isManagerRole = response.roles?.includes('ROLE_MANAGER');
    const isAdminRole = response.roles?.includes('ROLE_ADMIN');

    let clientProfile = null;
    if (!isManagerRole && !isAdminRole) {
      try {
        clientProfile = await api.clients.getCurrent();
      } catch (e) {
        clientProfile = {
          id: response.clientId || 1,
          firstName: response.username,
          discountPercent: 0,
          isRegular: false
        };
      }
    }

    const newUser = {
      username: response.username,
      roles: response.roles || ['ROLE_CLIENT'],
      token: response.token,
      clientProfile
    };

    setUser(newUser);
    localStorage.setItem('ta_user_session', JSON.stringify(newUser));
    return newUser;
  };

  const register = async (username, password) => {
    const response = await api.auth.register(username, password);
    return await login(username, password);
  };

  const logout = () => {
    localStorage.removeItem('ta_user_session');
    localStorage.removeItem('ta_jwt_token');
    setUser(null);
  };

  const switchDemoRole = async (targetRole) => {
    if (targetRole === 'MANAGER') {
      return await login('manager', 'manager123');
    } else if (targetRole === 'ADMIN') {
      return await login('admin', 'admin123');
    } else {
      return await login('olena', 'client123');
    }
  };

  const refreshClientProfile = async () => {
    if (user && isClient) {
      try {
        const profile = await api.clients.getCurrent();
        const updated = { ...user, clientProfile: profile };
        setUser(updated);
        localStorage.setItem('ta_user_session', JSON.stringify(updated));
      } catch (e) {}
    }
  };

  const isClient = !!user && (user.roles?.includes('ROLE_CLIENT') || (!user.roles?.includes('ROLE_MANAGER') && !user.roles?.includes('ROLE_ADMIN')));
  const isManager = !!user && (user.roles?.includes('ROLE_MANAGER') || user.roles?.includes('ROLE_ADMIN'));
  const isAdmin = !!user && user.roles?.includes('ROLE_ADMIN');

  return (
    <AuthContext.Provider
      value={{
        user,
        isClient,
        isManager,
        isAdmin,
        isBackendOnline,
        login,
        register,
        logout,
        switchDemoRole,
        refreshClientProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
