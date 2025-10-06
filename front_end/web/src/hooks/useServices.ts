"use client";
import { useState, useEffect } from 'react';
import { ServiceDTO } from '@/types/api';
import { apiService } from '@/services/api';

export const useServices = () => {
  const [services, setServices] = useState<ServiceDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const fetchedServices = await apiService.getAllServices();
        setServices(fetchedServices);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch services');
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return { services, loading, error, refetch: () => {} };
};
