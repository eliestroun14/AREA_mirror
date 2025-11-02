import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { apiService } from '@/services/api';

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

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
      fetch(`${apiBaseUrl}/users/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }).then(async (res) => {
        const data = res.ok ? await res.json() : null;
        if (data)
          setToken(data.token);
      }).catch((err) => {
        console.error(err);
      })

      // Only check localStorage, as session_token cookie is httpOnly
      // and cannot be read by JavaScript
      //const localStorageToken = localStorage.getItem('access_token');
      //return localStorageToken || null;
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
      // Store in localStorage for client-side access
      // Note: The backend also sets a httpOnly session_token cookie
      // which is automatically sent with requests (credentials: 'include')
      //localStorage.setItem('access_token', token);
    } else {
      document.cookie = 'session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      localStorage.removeItem('session_token');
    }
  }, [token, isAuthenticated]);

  const login = (newToken: string) => {
    console.log('🔑 Login called with token:', newToken?.substring(0, 10) + '...');
    setToken(newToken);
  };
  
  const logout = async () => {
    console.log('🚪 Logout called');
    
    // Si on a un token, appeler l'API de logout
    if (token) {
      try {
        await apiService.logout(token);
        console.log('✅ API logout successful');
      } catch (error) {
        console.error('❌ API logout failed:', error);
        // On continue avec le logout local même si l'API échoue
      }
    }
    
    // Nettoyer le token local
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
