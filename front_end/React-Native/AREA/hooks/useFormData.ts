import { useState, useEffect } from 'react';
import { Action, TriggerField } from '@/types/type';

interface UseFormDataReturn {
  formData: Record<string, string>;
  handleFieldChange: (fieldName: string, value: string) => void;
  initializeFormData: (action: Action) => void;
}

/**
 * Custom hook to manage form data state
 */
export const useFormData = (): UseFormDataReturn => {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const initializeFormData = (action: Action) => {
    const fieldsArray = Object.entries(action.fields);
    const initialFormData: Record<string, string> = {};
    
    fieldsArray.forEach(([key, field]) => {
      const fieldData = field as TriggerField;
      initialFormData[key] = fieldData.default_value || '';
    });
    
    setFormData(initialFormData);
  };

  return {
    formData,
    handleFieldChange,
    initializeFormData
  };
};
