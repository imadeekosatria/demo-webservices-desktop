import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface ApiConfig {
  userId: string;
  password: string;
  ipUser: string;
  serverUrl: string;
}

interface ApiContextType {
  config: ApiConfig;
  setConfig: (config: ApiConfig) => void;
}

const defaultAPIConfig: ApiConfig = {
  userId: 'DEMO',
  password: 'PASSWORD123',
  ipUser: '127.0.0.1',
  serverUrl: 'https://172.16.160.177:8000',
};

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export function ApiProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<ApiConfig>(() => {
    const saved = localStorage.getItem('dukcapil_api_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...defaultAPIConfig,
          ...parsed,
          serverUrl: parsed.serverUrl || defaultAPIConfig.serverUrl,
        };
      } catch (e) {
        // ignore
      }
    }
    return defaultAPIConfig;
  });

  const setConfig = (newConfig: ApiConfig) => {
    setConfigState(newConfig);
    localStorage.setItem('dukcapil_api_config', JSON.stringify(newConfig));
  };

  return (
    <ApiContext.Provider value={{ config, setConfig }}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApiConfig() {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApiConfig must be used within an ApiProvider');
  }
  return context;
}
