import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import api, { clearToken, getToken, setToken } from '../services/api';

export type UserStatus = 'pendente' | 'aprovado' | 'admin' | 'recusado';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  birthdate?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  /** true enquanto a sessão salva está sendo conferida no servidor. */
  loading: boolean;
  isApproved: boolean;
  isAdmin: boolean;
  requestCode: (email: string) => Promise<void>;
  verifyCode: (email: string, code: string) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Ao abrir o site, confere no servidor se a sessão guardada ainda vale.
  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    api
      .get<{ user: AuthUser }>('/auth/me')
      .then((res) => {
        if (!cancelled) setUser(res.data.user);
      })
      .catch(() => {
        clearToken();
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const requestCode = useCallback(async (email: string) => {
    await api.post('/auth/request-code', { email: email.trim().toLowerCase() });
  }, []);

  const verifyCode = useCallback(async (email: string, code: string) => {
    const res = await api.post<{ token: string; user: AuthUser }>('/auth/verify-code', {
      email: email.trim().toLowerCase(),
      code: code.trim(),
    });
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isApproved: user?.status === 'aprovado' || user?.status === 'admin',
      isAdmin: user?.status === 'admin',
      requestCode,
      verifyCode,
      logout,
    }),
    [user, loading, requestCode, verifyCode, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth precisa estar dentro de um AuthProvider');
  }
  return context;
};
