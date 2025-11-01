import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getApiBaseUrl } from '@/utils/apiConfig';

interface ApiContextType {
  apiUrl: string | null;
  setApiUrl: (url: string) => void;
  reloadApiUrl: () => Promise<void>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const [apiUrl, setApiUrl] = useState<string | null>(null);

  const reloadApiUrl = async () => {
    const url = await getApiBaseUrl();
    console.log('API URL set to:', url);
    setApiUrl(url);
  };

  // pour charger l'url au démarrage ça
  useEffect(() => {
    reloadApiUrl();
  }, []);

  return (
    <ApiContext.Provider value={{ apiUrl, setApiUrl, reloadApiUrl }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = (): ApiContextType => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};
