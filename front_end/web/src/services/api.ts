import { 
  GetAllServicesResponse, 
  GetServiceResponse,
  GetTriggersByServiceResponse,
  GetActionsByServiceResponse,
  GetActionByServiceResponse,
  GetTriggerByServiceResponse,
  GetAllConnectionsResponse,
  GetConnectionsByServiceResponse,
  GetAllZapsResponse,
  ConnectionDTO,
  TriggerDTO,
  ServiceDTO,
  ActionDTO,
  ZapDTO
} from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class ApiService {
  private async fetchWithErrorHandling<T>(url: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API call failed for ${url}:`, error);
      throw error;
    }
  }

  async getAllServices(): Promise<GetAllServicesResponse> {
    const services = await this.fetchWithErrorHandling<GetAllServicesResponse>('/services');
    
    return services.map(service => ({
      ...service,
      // Prepend localhost:8080 to icon_url if it exists
      icon_url: service.icon_url ? `${API_BASE_URL}${service.icon_url}` : null
    }));
  }

  async getServiceById(serviceId: number): Promise<GetServiceResponse> {
    const service = await this.fetchWithErrorHandling<GetServiceResponse>(`/services/${serviceId}`);
    
    // Process service to handle image URL with full localhost URL
    return {
      ...service,
      icon_url: service.icon_url ? `${API_BASE_URL}${service.icon_url}` : null
    };
  }

  async getServiceByName(serviceName: string): Promise<GetServiceResponse | null> {
    try {
      const services = await this.getAllServices();
      const service = services.find(s => s.name.toLowerCase() === serviceName.toLowerCase());
      return service || null;
    } catch (error) {
      console.error(`Failed to get service by name ${serviceName}:`, error);
      return null;
    }
  }

  async getTriggersByService(serviceId: string): Promise<GetTriggersByServiceResponse> {
    return this.fetchWithErrorHandling<GetTriggersByServiceResponse>(`/services/${serviceId}/triggers`);
  }

  async getActionsByService(serviceId: string): Promise<GetActionsByServiceResponse> {
    return this.fetchWithErrorHandling<GetActionsByServiceResponse>(`/services/${serviceId}/actions`);
  }

  async getActionByService(serviceId: string, actionId: string): Promise<GetActionByServiceResponse> {
    return this.fetchWithErrorHandling<GetActionByServiceResponse>(`/services/${serviceId}/actions/${actionId}`);
  }

  async getTriggerByService(serviceId: string, triggerId: string): Promise<GetTriggerByServiceResponse> {
    return this.fetchWithErrorHandling<GetTriggerByServiceResponse>(`/services/${serviceId}/triggers/${triggerId}`);
  }

  // Get all user connections
  async getAllConnections(token: string): Promise<GetAllConnectionsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me/connections`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to get connections:', error);
      throw error;
    }
  }

  // Get all user zaps
  async getAllZaps(token: string): Promise<GetAllZapsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/zaps`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to get zaps:', error);
      throw error;
    }
  }

  // Get a specific zap
  async getZapById(zapId: number, token: string): Promise<ZapDTO> {
    try {
      const response = await fetch(`${API_BASE_URL}/zaps/${zapId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to get zap:', error);
      throw error;
    }
  }

  // Toggle zap active status
  async toggleZap(zapId: number, isActive: boolean, token: string): Promise<ZapDTO> {
    try {
      const response = await fetch(`${API_BASE_URL}/zaps/${zapId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_active: isActive })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to toggle zap:', error);
      throw error;
    }
  }

  // Update zap name and description
  async updateZap(zapId: number, name?: string, description?: string, token?: string): Promise<ZapDTO> {
    try {
      const response = await fetch(`${API_BASE_URL}/zaps/${zapId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        credentials: 'include',
        body: JSON.stringify({ name, description })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to update zap:', error);
      throw error;
    }
  }

  // Get user connections for a specific service
  async getConnectionsByService(serviceId: number, token: string): Promise<GetConnectionsByServiceResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me/connections/service/${serviceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to get connections by service:', error);
      throw error;
    }
  }

  // Create a new zap
  async createZap(name?: string, description?: string): Promise<{ id: number; name: string; description: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/zaps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          name: name || 'New Applet',
          description: description || 'Created from web interface'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to create zap:', error);
      throw error;
    }
  }

  // Delete a zap
  async deleteZap(zapId: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/zaps/${zapId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      // Accept both 200 (with JSON body) and 204 (No Content)
      if (!response.ok && response.status !== 204) {
        const errorText = await response.text();
        console.error('Delete zap failed:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }

      // Try to parse JSON if there's content, otherwise just return
      if (response.status !== 204 && response.headers.get('content-length') !== '0') {
        try {
          await response.json();
        } catch {
          // Ignore JSON parsing errors for successful deletes
          console.log('No JSON body in delete response (expected for 204)');
        }
      }
    } catch (error) {
      console.error('Failed to delete zap:', error);
      throw error;
    }
  }

  // Create a trigger for a zap
  async createZapTrigger(
    zapId: number, 
    triggerId: number, 
    connectionId: number,
    payload: Record<string, string>,
    token: string
  ): Promise<{ zap_id: number }> {
    try {
      // Get connection to retrieve accountIdentifier
      const connection = await this.getConnectionById(connectionId, token);
      
      if (!connection.account_identifier) {
        throw new Error('Connection does not have an account identifier');
      }
      
      const response = await fetch(`${API_BASE_URL}/zaps/${zapId}/trigger`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          triggerId,
          accountIdentifier: connection.account_identifier,
          payload
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Create trigger failed:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create trigger:', error);
      throw error;
    }
  }

  // Get a specific connection by ID
  async getConnectionById(connectionId: number, token: string): Promise<ConnectionDTO> {
    try {
      const allConnections = await this.getAllConnections(token);
      const connection = allConnections.connections.find(c => c.id === connectionId);
      
      if (!connection) {
        throw new Error(`Connection with id ${connectionId} not found`);
      }
      
      return connection;
    } catch (error) {
      console.error('Failed to get connection by id:', error);
      throw error;
    }
  }

  // Get trigger for a zap
  async getZapTrigger(
    zapId: number,
    token: string
  ): Promise<{
    step: {
      id: number;
      zap_id: number;
      connection_id: number;
      step_type: 'TRIGGER';
      trigger_id: number | null;
      step_order: number;
      payload: Record<string, unknown>;
    };
    trigger: TriggerDTO;
    service: ServiceDTO;
    connection: ConnectionDTO;
  } | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/zaps/${zapId}/trigger`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 404) {
        // Pas de trigger configuré pour ce zap
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const stepData = await response.json();
      
      if (!stepData.trigger_id) {
        throw new Error('Trigger ID not found in step data');
      }
      
      // D'abord, on doit trouver le service_id du trigger
      // On va récupérer tous les services et chercher le trigger
      const allServices = await this.getAllServices();
      
      let trigger: TriggerDTO | null = null;
      let service: ServiceDTO | null = null;
      
      // Parcourir tous les services pour trouver le trigger
      for (const svc of allServices) {
        try {
          const triggers = await this.getTriggersByService(svc.id.toString());
          const foundTrigger = triggers.find(t => t.id === stepData.trigger_id);
          
          if (foundTrigger) {
            trigger = foundTrigger;
            service = svc;
            break;
          }
        } catch {
          // Service n'a pas de triggers, continuer
          continue;
        }
      }
      
      if (!trigger || !service) {
        throw new Error(`Trigger with id ${stepData.trigger_id} not found`);
      }
      
      // Récupérer les détails de la connexion
      const connection = await this.getConnectionById(stepData.connection_id, token);
      
      return {
        step: stepData,
        trigger,
        service,
        connection
      };
    } catch (error) {
      console.error('Failed to get zap trigger:', error);
      throw error;
    }
  }

  // Get a specific action by ID from a service
  async getActionById(serviceId: number, actionId: number): Promise<ActionDTO> {
    try {
      const actions = await this.getActionsByService(serviceId.toString());
      const action = actions.find(a => a.id === actionId);
      
      if (!action) {
        throw new Error(`Action with id ${actionId} not found in service ${serviceId}`);
      }
      
      return action;
    } catch (error) {
      console.error('Failed to get action by id:', error);
      throw error;
    }
  }

  // Create an action for a zap
  async createZapAction(
    zapId: number,
    actionId: number,
    connectionId: number,
    fromStepId: number,
    stepOrder: number,
    payload: Record<string, string>,
    token: string
  ): Promise<{ zap_id: number }> {
    try {
      // Get connection to retrieve accountIdentifier
      const connection = await this.getConnectionById(connectionId, token);
      
      if (!connection.account_identifier) {
        throw new Error('Connection does not have an account identifier');
      }
      
      const response = await fetch(`${API_BASE_URL}/zaps/${zapId}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          actionId,
          fromStepId,
          stepOrder,
          accountIdentifier: connection.account_identifier,
          payload
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Create action failed:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create action:', error);
      throw error;
    }
  }

  // Get all actions for a zap
  async getZapActions(
    zapId: number,
    token: string
  ): Promise<Array<{
    step: {
      id: number;
      zap_id: number;
      connection_id: number;
      step_type: 'ACTION';
      action_id: number | null;
      from_step_id: number;
      step_order: number;
      payload: Record<string, unknown>;
    };
    action: ActionDTO;
    service: ServiceDTO;
    connection: ConnectionDTO;
  }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/zaps/${zapId}/actions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const stepsData = await response.json();
      
      // Pour chaque step, enrichir avec les données du service et de l'action
      const enrichedActions = await Promise.all(
        stepsData.map(async (stepData: Record<string, unknown>) => {
          if (!stepData.action_id) {
            throw new Error('Action ID not found in step data');
          }
          
          // Trouver le service et l'action
          const allServices = await this.getAllServices();
          
          let action: ActionDTO | null = null;
          let service: ServiceDTO | null = null;
          
          for (const svc of allServices) {
            try {
              const actions = await this.getActionsByService(svc.id.toString());
              const foundAction = actions.find(a => a.id === stepData.action_id);
              
              if (foundAction) {
                action = foundAction;
                service = svc;
                break;
              }
            } catch {
              continue;
            }
          }
          
          if (!action || !service) {
            throw new Error(`Action with id ${stepData.action_id} not found`);
          }
          
          // Récupérer les détails de la connexion
          const connection = await this.getConnectionById(stepData.connection_id as number, token);
          
          return {
            step: stepData,
            action,
            service,
            connection
          };
        })
      );
      
      return enrichedActions;
    } catch (error) {
      console.error('Failed to get zap actions:', error);
      throw error;
    }
  }

  // Get a specific action from a zap
  async getZapActionById(
    zapId: number,
    actionStepId: number,
    token: string
  ): Promise<{
    step: {
      id: number;
      zap_id: number;
      connection_id: number;
      step_type: 'ACTION';
      action_id: number | null;
      from_step_id: number;
      step_order: number;
      payload: Record<string, unknown>;
    };
    action: ActionDTO;
    service: ServiceDTO;
    connection: ConnectionDTO;
  } | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/zaps/${zapId}/actions/${actionStepId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 404) {
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const stepData = await response.json();
      
      if (!stepData.action_id) {
        throw new Error('Action ID not found in step data');
      }
      
      // Trouver le service et l'action
      const allServices = await this.getAllServices();
      
      let action: ActionDTO | null = null;
      let service: ServiceDTO | null = null;
      
      for (const svc of allServices) {
        try {
          const actions = await this.getActionsByService(svc.id.toString());
          const foundAction = actions.find(a => a.id === stepData.action_id);
          
          if (foundAction) {
            action = foundAction;
            service = svc;
            break;
          }
        } catch {
          continue;
        }
      }
      
      if (!action || !service) {
        throw new Error(`Action with id ${stepData.action_id} not found`);
      }
      
      // Récupérer les détails de la connexion
      const connection = await this.getConnectionById(stepData.connection_id, token);
      
      return {
        step: stepData,
        action,
        service,
        connection
      };
    } catch (error) {
      console.error('Failed to get zap action by id:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
