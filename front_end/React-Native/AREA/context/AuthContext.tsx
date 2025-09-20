/*
** EPITECH PROJECT, 2025
** survivor
** File description:
** auth
*/

"use client"

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAuth = async () => {
      const saved = await SecureStore.getItemAsync('auth');
      setIsAuthenticated(saved === 'true');
      setLoading(true);
    }
    loadAuth();
  }, []);

  const login = async () => {
    await SecureStore.setItemAsync('auth', 'true');
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('auth');
    setIsAuthenticated(false);
  };

  // if (loading == true)
  //   return null; //TODO: mettre un splashScreen !!

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
