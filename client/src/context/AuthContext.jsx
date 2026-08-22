import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem('cachedUser');
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      return null;
    }
  });

  const [wallet, setWallet] = useState(() => {
    try {
      const cached = localStorage.getItem('cachedWallet');
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [impersonatorAdmin, setImpersonatorAdmin] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // Check if token passed via cross-subdomain SSO parameter
    const urlParams = new URLSearchParams(window.location.search);
    const ssoToken = urlParams.get('sso_token');
    if (ssoToken) {
      localStorage.setItem('accessToken', ssoToken);
      // Clean up sso_token from URL bar seamlessly
      urlParams.delete('sso_token');
      const newQuery = urlParams.toString() ? `?${urlParams.toString()}` : '';
      window.history.replaceState({}, document.title, `${window.location.pathname}${newQuery}`);
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      setUser(null);
      setWallet(null);
      setLoading(false);
      return;
    }

    try {
      const res = await API.get('/auth/me');
      if (res.data?.success) {
        setUser(res.data.data.user);
        setWallet(res.data.data.wallet);
        setIsImpersonating(res.data.data.isImpersonating || false);
        setImpersonatorAdmin(res.data.data.impersonatorAdmin || null);

        localStorage.setItem('cachedUser', JSON.stringify(res.data.data.user));
        localStorage.setItem('cachedWallet', JSON.stringify(res.data.data.wallet));
      }
    } catch (err) {
      console.warn('Auth check notice:', err.message);
      // If 401 Unauthorized, clear stale token
      if (err.response?.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('cachedUser');
        localStorage.removeItem('cachedWallet');
        setUser(null);
        setWallet(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    if (res.data?.success) {
      if (res.data.needsVerification) {
        return res.data;
      }
      const token = res.data.data?.token;
      const userData = res.data.data?.user || null;
      const walletData = res.data.data?.wallet || null;

      if (token) localStorage.setItem('accessToken', token);
      if (userData) localStorage.setItem('cachedUser', JSON.stringify(userData));
      if (walletData) localStorage.setItem('cachedWallet', JSON.stringify(walletData));

      setUser(userData);
      setWallet(walletData);
      setIsImpersonating(false);
      return res.data;
    }
  };

  const register = async (formData) => {
    const res = await API.post('/auth/register', formData);
    if (res.data?.success) {
      const token = res.data.data?.token;
      const userData = res.data.data?.user || null;
      const walletData = res.data.data?.wallet || null;

      if (token) localStorage.setItem('accessToken', token);
      if (userData) localStorage.setItem('cachedUser', JSON.stringify(userData));
      if (walletData) localStorage.setItem('cachedWallet', JSON.stringify(walletData));

      setUser(userData);
      setWallet(walletData);
      return res.data;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('cachedUser');
    localStorage.removeItem('cachedWallet');
    localStorage.removeItem('adminBackupToken');
    setUser(null);
    setWallet(null);
    setIsImpersonating(false);
    setImpersonatorAdmin(null);
    window.location.href = '/login';
  };

  const impersonate = (impersonationToken) => {
    const currentToken = localStorage.getItem('accessToken');
    localStorage.setItem('adminBackupToken', currentToken);
    localStorage.setItem('accessToken', impersonationToken);
    window.location.href = '/dashboard';
  };

  const stopImpersonating = () => {
    const backupToken = localStorage.getItem('adminBackupToken');
    if (backupToken) {
      localStorage.setItem('accessToken', backupToken);
      localStorage.removeItem('adminBackupToken');
      window.location.href = '/admin/users';
    }
  };

  const refreshWallet = async () => {
    try {
      const res = await API.get('/wallet');
      if (res.data?.success) {
        setWallet(res.data.data.wallet);
        localStorage.setItem('cachedWallet', JSON.stringify(res.data.data.wallet));
      }
    } catch (err) {
      console.error('Failed to refresh wallet', err);
    }
  };

  const isAdmin = user && ['Super Admin', 'Admin'].includes(user.role);

  return (
    <AuthContext.Provider
      value={{
        user,
        wallet,
        loading,
        isAdmin,
        isImpersonating,
        impersonatorAdmin,
        login,
        register,
        logout,
        impersonate,
        stopImpersonating,
        refreshWallet,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
