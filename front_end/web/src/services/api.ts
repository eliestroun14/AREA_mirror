import { 
  GetAllServicesResponse, 
  GetServiceResponse,
  GetTriggersByServiceResponse,
  GetActionsByServiceResponse,
  GetActionByServiceResponse,
  GetTriggerByServiceResponse 
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
    
    // Process services to handle image URLs
    return services.map(service => ({
      ...service,
      // Ensure icon_url is properly formatted or null
      icon_url: service.icon_url ? service.icon_url : null
    }));
  }

  // Get specific service by ID
  async getServiceById(serviceId: number): Promise<GetServiceResponse> {
    return this.fetchWithErrorHandling<GetServiceResponse>(`/services/${serviceId}`);
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
}

export const apiService = new ApiService();
