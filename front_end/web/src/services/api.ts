import { 
  GetAllServicesResponse, 
  GetServiceResponse,
  GetTriggersByServiceResponse,
  GetActionsByServiceResponse,
  GetActionByServiceResponse,
  GetTriggerByServiceResponse,
  GetAllConnectionsResponse,
  GetConnectionsByServiceResponse
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

  // Get all services with image URL processing
  async getAllServices(): Promise<GetAllServicesResponse> {
    const services = await this.fetchWithErrorHandling<GetAllServicesResponse>('/services');
    
    // Process services to handle image URLs with full localhost URL
    return services.map(service => ({
      ...service,
      // Prepend localhost:8080 to icon_url if it exists
      icon_url: service.icon_url ? `${API_BASE_URL}${service.icon_url}` : null
    }));
  }

  // Get specific service by ID
  async getServiceById(serviceId: number): Promise<GetServiceResponse> {
    const service = await this.fetchWithErrorHandling<GetServiceResponse>(`/services/${serviceId}`);
    
    // Process service to handle image URL with full localhost URL
    return {
      ...service,
      icon_url: service.icon_url ? `${API_BASE_URL}${service.icon_url}` : null
    };
  }

  // Get triggers for a service
  async getTriggersByService(serviceId: string): Promise<GetTriggersByServiceResponse> {
    return this.fetchWithErrorHandling<GetTriggersByServiceResponse>(`/services/${serviceId}/triggers`);
  }

  // Get actions for a service
  async getActionsByService(serviceId: string): Promise<GetActionsByServiceResponse> {
    return this.fetchWithErrorHandling<GetActionsByServiceResponse>(`/services/${serviceId}/actions`);
  }

  // Get specific action
  async getActionByService(serviceId: string, actionId: string): Promise<GetActionByServiceResponse> {
    return this.fetchWithErrorHandling<GetActionByServiceResponse>(`/services/${serviceId}/actions/${actionId}`);
  }

  // Get specific trigger
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
}

export const apiService = new ApiService();
