import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      // Only check localStorage, as session_token cookie is httpOnly
      // and cannot be read by JavaScript
      const localStorageToken = localStorage.getItem('access_token');
      return localStorageToken || null;
    }
    return null;
  });

  const isAuthenticated = !!token;

  useEffect(() => {
    if (token) {
      // Store in localStorage for client-side access
      // Note: The backend also sets a httpOnly session_token cookie
      // which is automatically sent with requests (credentials: 'include')
      localStorage.setItem('access_token', token);
    } else {
      localStorage.removeItem('access_token');
    }
  }, [token]);

  const login = (newToken: string) => {
    setToken(newToken);
  };
  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
