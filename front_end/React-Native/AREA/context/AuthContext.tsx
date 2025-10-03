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
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadAuth = async () => {
      const saved = await SecureStore.getItemAsync('auth');
      setIsAuthenticated(saved === 'true');
      setLoading(true);
    }
    loadAuth();
  }, []);

  const login = async (userData: User) => {
    await SecureStore.setItemAsync('auth', 'true');
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('auth');
    setIsAuthenticated(false);
    setUser(null);
  };

  // if (loading == true)
  //   return null; //TODO: mettre un splashScreen !!

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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
