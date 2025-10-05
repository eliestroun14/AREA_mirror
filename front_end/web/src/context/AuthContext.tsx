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
      const localStorageToken = localStorage.getItem('session_token');
      if (localStorageToken) {
        return localStorageToken;
      }
  
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'session_token') {
          localStorage.setItem('session_token', value);
          return value;
        }
      }
    }
    return null;
  });

  const isAuthenticated = !!token;

  useEffect(() => {
    console.log('🔄 Auth state changed:', { 
      isAuthenticated, 
      hasToken: !!token, 
      tokenPreview: token?.substring(0, 10) + '...' 
    });
    
    if (token) {
      document.cookie = `session_token=${token}; path=/; SameSite=Lax`;
      localStorage.setItem('session_token', token);
    } else {
      document.cookie = 'session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      localStorage.removeItem('session_token');
    }
  }, [token, isAuthenticated]);

  const login = (newToken: string) => {
    console.log('🔑 Login called with token:', newToken?.substring(0, 10) + '...');
    setToken(newToken);
  };
  const logout = () => {
    console.log('🚪 Logout called');
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
