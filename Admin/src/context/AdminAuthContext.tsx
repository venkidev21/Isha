import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AdminAuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = async () => {
    const token = localStorage.getItem('shopnest_admin_token');
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.auth.me();
      const currentUser = (res as any)?.user || res;
      if (currentUser && currentUser.role === 'ADMIN') {
        setUser(currentUser);
      } else {
        localStorage.removeItem('shopnest_admin_token');
        setUser(null);
      }
    } catch (err) {
      localStorage.removeItem('shopnest_admin_token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.auth.login(email, password);
    const currentUser = (res as any)?.user || res;
    const token = (res as any)?.token;

    if (!currentUser || currentUser.role !== 'ADMIN') {
      throw new Error('Access denied. Administrator privileges are required.');
    }
    if (token) {
      localStorage.setItem('shopnest_admin_token', token);
    }
    setUser(currentUser);
  };

  const logout = () => {
    localStorage.removeItem('shopnest_admin_token');
    setUser(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === 'ADMIN',
        isLoading,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return context;
};
