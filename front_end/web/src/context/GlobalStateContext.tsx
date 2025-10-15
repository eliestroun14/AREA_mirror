import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface GlobalState {
  counter: number;
  message: string;
  isActive: boolean;
  lastUpdated: Date;
  userConnected: boolean;
  loginTime: Date | null;
  sessionDuration: number; // en secondes
  userToken: string | null;
}

interface GlobalStateContextType {
  globalState: GlobalState;
  updateCounter: (value: number) => void;
  updateMessage: (message: string) => void;
  toggleActive: () => void;
  resetState: () => void;
  getUserStateKey: () => string;
}

const defaultState: GlobalState = {
  counter: 0,
  message: "État global initialisé",
  isActive: false,
  lastUpdated: new Date(),
  userConnected: false,
  loginTime: null,
  sessionDuration: 0,
  userToken: null
};

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, token } = useAuth();
  const [globalState, setGlobalState] = useState<GlobalState>(() => {
    // Tenter de récupérer l'état depuis localStorage si utilisateur connecté
    if (typeof window !== 'undefined' && token) {
      const savedState = localStorage.getItem(`globalState_${token.substring(0, 10)}`);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        return {
          ...parsed,
          lastUpdated: new Date(parsed.lastUpdated),
          loginTime: parsed.loginTime ? new Date(parsed.loginTime) : null
        };
      }
    }
    return defaultState;
  });

  // Effet pour gérer les changements d'authentification
  useEffect(() => {
    if (isAuthenticated && token) {
      setGlobalState(prev => ({
        ...prev,
        userConnected: true,
        loginTime: prev.loginTime || new Date(),
        userToken: token,
        message: "Utilisateur connecté - État synchronisé",
        lastUpdated: new Date()
      }));
    } else {
      // Reset du state quand l'utilisateur se déconnecte
      setGlobalState({
        ...defaultState,
        message: "Utilisateur déconnecté - État réinitialisé",
        lastUpdated: new Date()
      });
    }
  }, [isAuthenticated, token]);

  // Fonction pour incrémenter automatiquement le counter toutes les 3 secondes (seulement si connecté et actif)
  useEffect(() => {
    if (!globalState.userConnected || !globalState.isActive) return;

    const interval = setInterval(() => {
      setGlobalState(prev => ({
        ...prev,
        counter: prev.counter + 1,
        sessionDuration: prev.loginTime ? Math.floor((new Date().getTime() - prev.loginTime.getTime()) / 1000) : 0,
        lastUpdated: new Date()
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [globalState.userConnected, globalState.isActive]);

  // Sauvegarde périodique du state si utilisateur connecté
  useEffect(() => {
    if (globalState.userConnected && globalState.userToken) {
      const stateToSave = {
        ...globalState,
        lastUpdated: globalState.lastUpdated.toISOString(),
        loginTime: globalState.loginTime?.toISOString()
      };
      localStorage.setItem(`globalState_${globalState.userToken.substring(0, 10)}`, JSON.stringify(stateToSave));
    }
  }, [globalState]);

  const updateCounter = (value: number) => {
    if (!globalState.userConnected) {
      console.warn('⚠️ Tentative de modification du compteur sans être connecté');
      return;
    }
    setGlobalState(prev => ({
      ...prev,
      counter: value,
      lastUpdated: new Date()
    }));
  };

  const updateMessage = (message: string) => {
    if (!globalState.userConnected) {
      console.warn('⚠️ Tentative de modification du message sans être connecté');
      return;
    }
    setGlobalState(prev => ({
      ...prev,
      message,
      lastUpdated: new Date()
    }));
  };

  const toggleActive = () => {
    if (!globalState.userConnected) {
      console.warn('⚠️ Tentative de modification de l\'état actif sans être connecté');
      return;
    }
    setGlobalState(prev => ({
      ...prev,
      isActive: !prev.isActive,
      message: !prev.isActive ? "État activé par l'utilisateur" : "État désactivé par l'utilisateur",
      lastUpdated: new Date()
    }));
  };

  const resetState = () => {
    if (!globalState.userConnected) {
      console.warn('⚠️ Tentative de reset sans être connecté');
      return;
    }
    setGlobalState(prev => ({
      ...defaultState,
      userConnected: prev.userConnected,
      loginTime: prev.loginTime,
      userToken: prev.userToken,
      message: "État réinitialisé par l'utilisateur",
      lastUpdated: new Date()
    }));
  };

  const getUserStateKey = () => {
    return globalState.userToken ? `user_${globalState.userToken.substring(0, 10)}` : 'anonymous';
  };

  const contextValue: GlobalStateContextType = {
    globalState,
    updateCounter,
    updateMessage,
    toggleActive,
    resetState,
    getUserStateKey
  };

  return (
    <GlobalStateContext.Provider value={contextValue}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = (): GlobalStateContextType => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};
