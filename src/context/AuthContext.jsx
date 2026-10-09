import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService, isUserAuthenticated } from '../api/authService';

export { isUserAuthenticated };

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize active user on startup
  useEffect(() => {
    let isMounted = true;
    async function loadUser() {
      try {
        const currentUser = await authService.getCurrentUser();
        if (isMounted) {
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Failed to load user session:', err);
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadUser();
    return () => { isMounted = false; };
  }, []);

  const login = useCallback(async ({ phone, identifier, email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.login({ phone, identifier, email, password });
      setUser(res.user);
      return res;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async ({ name, phone, email, password, age, gender, children }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.register({ name, phone, email, password, age, gender, children });
      setUser(res.user);
      return res;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates) => {
    try {
      const res = await authService.updateProfile(updates);
      setUser(res.user);
      return res.user;
    } catch (err) {
      console.error('Failed to update profile:', err);
      throw err;
    }
  }, []);

  const addPassToWallet = useCallback(async (passData) => {
    try {
      const res = await authService.addPassToWallet(passData);
      setUser(res.user);
      return res.user;
    } catch (err) {
      console.error('Failed to add pass to wallet:', err);
      throw err;
    }
  }, []);

  const value = {
    user,
    isAuthenticated: Boolean(user && user.id !== 'guest'),
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    addPassToWallet
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
