import { createContext, useState, useContext, ReactNode } from 'react';
import { Service, Trigger, Action } from '@/types/type';

interface ActionInstance {
  service: Service;
  action: Action;
  connection: any;
  formData?: string;
  fromStepId?: string;
  uniqueId: string;
}

interface ZapCreationContextType {
  serviceTrigger: Service | undefined;
  setServiceTrigger: (service: Service | undefined) => void;
  trigger: Trigger | undefined;
  setTrigger: (trigger: Trigger | undefined) => void;
  actions: ActionInstance[];
  addAction: (action: ActionInstance) => void;
  clearActions: () => void;
  triggerConnection: any;
  setTriggerConnection: (connection: any) => void;
  zapId: string | undefined;
  setZapId: (id: string | undefined) => void;
  resetAll: () => void;
}

const ZapCreationContext = createContext<ZapCreationContextType | undefined>(undefined);

export const ZapCreationProvider = ({ children }: { children: ReactNode }) => {
  const [serviceTrigger, setServiceTrigger] = useState<Service | undefined>();
  const [trigger, setTrigger] = useState<Trigger | undefined>();
  const [actions, setActions] = useState<ActionInstance[]>([]);
  const [triggerConnection, setTriggerConnection] = useState<any>(null);
  const [zapId, setZapId] = useState<string | undefined>();

  const addAction = (action: ActionInstance) => {
    setActions(prev => [...prev, action]);
  };

  const clearActions = () => {
    setActions([]);
  };

  const resetAll = () => {
    setServiceTrigger(undefined);
    setTrigger(undefined);
    setActions([]);
    setTriggerConnection(null);
    setZapId(undefined);
  };

  return (
    <ZapCreationContext.Provider
      value={{
        serviceTrigger,
        setServiceTrigger,
        trigger,
        setTrigger,
        actions,
        addAction,
        clearActions,
        triggerConnection,
        setTriggerConnection,
        zapId,
        setZapId,
        resetAll,
      }}
    >
      {children}
    </ZapCreationContext.Provider>
  );
};

export const useZapCreation = () => {
  const context = useContext(ZapCreationContext);
  if (!context) {
    throw new Error('useZapCreation must be used within a ZapCreationProvider');
  }
  return context;
};
