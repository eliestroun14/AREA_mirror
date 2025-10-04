export interface Service {
  name: string;
  serviceColor: string;
  iconUrl: string;
  apiBaseUrl: string;
  authType: 'oauth2' | 'api_key' | 'basic';
  documentationUrl: string;
  isActive: boolean;
}

interface ExecutionData {
  key: string;
  value: string;
}

enum VariableType {
  STRING, NUMBER, SELECT
}

interface Variable {
  type: string; // Exemple:
  name: string; // Exemple: Prompt
  key: string; // Exemple: data.prompt
}

export interface Trigger {
  trigger_type: 'POLLING' | 'WEBHOOK' | 'SCHEDULE';
  name: string;
  description: string;
  polling_interval: number | null;
  fields: object;
  variables: object;

}

