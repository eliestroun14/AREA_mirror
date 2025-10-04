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

  async getAllServices(): Promise<GetAllServicesResponse> {
    const services = await this.fetchWithErrorHandling<GetAllServicesResponse>('/services');
    
    return services.map(service => ({
      ...service,
      icon_url: service.icon_url ? service.icon_url : null
    }));
  }

  async getServiceById(serviceId: number): Promise<GetServiceResponse> {
    return this.fetchWithErrorHandling<GetServiceResponse>(`/services/${serviceId}`);
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
}

export const apiService = new ApiService();
