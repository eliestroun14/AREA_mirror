import { Action, TriggerField } from '@/types/type';

interface ValidationResult {
  isValid: boolean;
  missingFields: string[];
}

/**
 * Validate required fields in a form
 */
export const validateRequiredFields = (
  action: Action | null,
  formData: Record<string, string>
): ValidationResult => {
  if (!action) {
    return { isValid: false, missingFields: [] };
  }

  const fieldsArray = Object.entries(action.fields);
  const missingFields = fieldsArray
    .filter(([key, field]) => {
      const fieldData = field as TriggerField;
      return fieldData.required && !formData[key]?.trim();
    })
    .map(([key, field]) => (field as TriggerField).field_name);

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};

/**
 * Convert action fields to array format with proper typing
 */
export const convertFieldsToArray = (action: Action) => {
  return Object.entries(action.fields).map(([key, field]) => ({
    fieldId: key,
    ...(field as TriggerField)
  }));
};
