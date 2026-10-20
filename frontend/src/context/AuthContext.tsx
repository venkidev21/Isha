import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Address } from '../types';
import { api, getAuthToken, setAuthToken, getSessionId } from '../services/api';

interface AuthContextType {
  user: User | null;
  addresses: Address[];
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  register: (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setAddresses([]);
      setIsLoading(false);
      return;
    }

    try {
      const profile = await api.auth.getProfile();
      setUser({
        id: profile.id,
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        avatar: profile.avatar,
        role: profile.role,
        createdAt: profile.createdAt,
      });
      setAddresses(profile.addresses || []);
    } catch (err) {
      console.warn('Failed to fetch user profile, clearing token:', err);
      setAuthToken(null);
      setUser(null);
      setAddresses([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const login = async (email: string, password: string) => {
    const result = await api.auth.login({ email, password });
    setAuthToken(result.token);
    setUser(result.user);
    // Sync guest cart to logged-in user cart
    const sessionId = getSessionId();
    await api.cart.sync(sessionId).catch(() => {});
    await refreshProfile();
  };

  const loginWithGoogle = async (credential: string) => {
    const result = await api.auth.loginWithGoogle(credential);
    setAuthToken(result.token);
    setUser(result.user);
    const sessionId = getSessionId();
    await api.cart.sync(sessionId).catch(() => {});
    await refreshProfile();
  };

  const register = async (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) => {
    const result = await api.auth.register(data);
    setAuthToken(result.token);
    setUser(result.user);
    const sessionId = getSessionId();
    await api.cart.sync(sessionId).catch(() => {});
    await refreshProfile();
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setAddresses([]);
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        addresses,
        isLoading,
        isAdmin,
        login,
        loginWithGoogle,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
