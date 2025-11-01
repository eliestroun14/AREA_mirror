import { useState, useEffect } from 'react';
import { Service, Action } from '@/types/type';
import { useApi } from '@/context/ApiContext';

interface UseActionDataParams {
  serviceActionId?: string;
  actionId?: string;
}

interface UseActionDataReturn {
  service: Service | null;
  action: Action | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook to fetch service and action data
 */
export const useActionData = ({ serviceActionId, actionId }: UseActionDataParams): UseActionDataReturn => {
  const [service, setService] = useState<Service | null>(null);
  const [action, setAction] = useState<Action | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { apiUrl } = useApi();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (!serviceActionId || !actionId) {
          setService(null);
          setAction(null);
          return;
        }

        // Fetch service
        const serviceRes = await fetch(`${apiUrl}/services/${serviceActionId}`);
        if (!serviceRes.ok) {
          throw new Error('Service not found');
        }
        const serviceData: Service = await serviceRes.json();
        setService(serviceData);

        // Fetch action
        const actionRes = await fetch(`${apiUrl}/services/${serviceActionId}/actions/${actionId}`);
        if (!actionRes.ok) {
          throw new Error('Action not found');
        }
        const actionData: Action = await actionRes.json();
        setAction(actionData);
        
        console.log('[useActionData] Action fields:', actionData.fields);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('[useActionData] Error:', errorMessage);
        setError(errorMessage);
        setService(null);
        setAction(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [serviceActionId, actionId, apiUrl]);

  return { service, action, loading, error };
};
