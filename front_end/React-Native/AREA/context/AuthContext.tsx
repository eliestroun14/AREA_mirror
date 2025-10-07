/*
** EPITECH PROJECT, 2025
** survivor
** File description:
** auth
*/

"use client"

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  sessionToken: string | null;
  login: (userData: User, sessionToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState<User | null>(null);

  const [sessionToken, setSessionToken] = useState<string | null>(null);

  useEffect(() => {
    const loadAuth = async () => {
      const saved = await SecureStore.getItemAsync('auth');
      const savedUser = await SecureStore.getItemAsync('user');
      const savedToken = await SecureStore.getItemAsync('sessionToken');
      setIsAuthenticated(saved === 'true');
      setUser(savedUser ? JSON.parse(savedUser) : null);
      setSessionToken(savedToken || null);
      setLoading(true);
      console.log('[AuthContext] Restored from storage:', {
        isAuthenticated: saved === 'true',
        user: savedUser ? JSON.parse(savedUser) : null,
        sessionToken: savedToken || null
      });
    }
    loadAuth();
  }, []);

  const login = async (userData: User, sessionToken: string) => {
    await SecureStore.setItemAsync('auth', 'true');
    await SecureStore.setItemAsync('user', JSON.stringify(userData));
    await SecureStore.setItemAsync('sessionToken', sessionToken);
    setIsAuthenticated(true);
    setUser(userData);
    setSessionToken(sessionToken);
    console.log('[AuthContext] Login:', { userData, sessionToken });
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('auth');
    await SecureStore.deleteItemAsync('user');
    await SecureStore.deleteItemAsync('sessionToken');
    setIsAuthenticated(false);
    setUser(null);
    setSessionToken(null);
    console.log('[AuthContext] Logout');
  };

  // if (loading == true)
  //   return null; //TODO: mettre un splashScreen !!

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, sessionToken, login, logout }}>
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
