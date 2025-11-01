import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, ActivityIndicator } from 'react-native';
import { useApi } from '@/context/ApiContext';
import { useAuth } from '@/context/AuthContext';

interface Variable {
  name: string;
  type: string;
  key: string;
}

interface VariableSelectorProps {
  zapId: number;
  sourceStepId: number | null;
  onInsertVariable: (variableName: string) => void;
  serviceColor?: string;
  buttonText?: string;
}

const VariableSelector: React.FC<VariableSelectorProps> = ({
  zapId,
  sourceStepId,
  onInsertVariable,
  serviceColor = '#075eec',
  buttonText = '+ Insert Variable'
}) => {
  const [variables, setVariables] = useState<Variable[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { apiUrl } = useApi();
  const { sessionToken } = useAuth();

  useEffect(() => {
    if (sourceStepId) {
      fetchVariables();
    } else {
      setVariables([]);
    }
  }, [sourceStepId, zapId]);

  const fetchVariables = async () => {
    if (!sourceStepId) return;

    setLoading(true);
    setError(null);

    console.log('[VariableSelector] Fetching variables for sourceStepId:', sourceStepId);

    try {
      const headers: Record<string, string> = {};
      if (sessionToken) {
        headers['Authorization'] = `Bearer ${sessionToken}`;
      }
      
      // First, determine if the source step is a trigger or action
      // The API returns a flat step object, not wrapped
      let isTrigger = false;
      let stepData = null;
      
      try {
        const triggerResponse = await fetch(`${apiUrl}/zaps/${zapId}/trigger`, {
          headers
        });
        
        if (triggerResponse.ok) {
          const triggerStepData = await triggerResponse.json();
          console.log('[VariableSelector] Trigger step data:', triggerStepData);
          
          // Check if this step's ID matches the source step ID
          if (triggerStepData.id === sourceStepId) {
            isTrigger = true;
            stepData = triggerStepData;
          }
        }
      } catch (err) {
        console.warn('[VariableSelector] Could not fetch trigger:', err);
      }

      console.log('[VariableSelector] Is trigger?', isTrigger);

      // If not a trigger, it must be an action - fetch the action step
      if (!isTrigger) {
        const actionResponse = await fetch(`${apiUrl}/zaps/${zapId}/actions/${sourceStepId}`, {
          headers
        });

        if (!actionResponse.ok) {
          throw new Error('Failed to fetch action step');
        }

        stepData = await actionResponse.json();
        console.log('[VariableSelector] Action step data:', stepData);
      }

      if (!stepData) {
        throw new Error('Step data not found');
      }

      // Now fetch the trigger/action definition to get variables
      let variablesObj = {};

      if (isTrigger && stepData.trigger_id) {
        // Fetch the trigger definition from services API
        console.log('[VariableSelector] Fetching trigger definition for trigger_id:', stepData.trigger_id);
        
        // We need to find which service this trigger belongs to
        // First get all services, then find the trigger
        const servicesResponse = await fetch(`${apiUrl}/services`, { headers });
        if (servicesResponse.ok) {
          const services = await servicesResponse.json();
          
          for (const service of services) {
            try {
              const triggersResponse = await fetch(`${apiUrl}/services/${service.id}/triggers`, { headers });
              if (triggersResponse.ok) {
                const triggers = await triggersResponse.json();
                const trigger = triggers.find((t: any) => t.id === stepData.trigger_id);
                
                if (trigger) {
                  console.log('[VariableSelector] Found trigger definition:', trigger);
                  variablesObj = trigger.variables || {};
                  break;
                }
              }
            } catch (err) {
              continue;
            }
          }
        }
      } else if (!isTrigger && stepData.action_id) {
        // Fetch the action definition from services API
        console.log('[VariableSelector] Fetching action definition for action_id:', stepData.action_id);
        
        // We need to find which service this action belongs to
        const servicesResponse = await fetch(`${apiUrl}/services`, { headers });
        if (servicesResponse.ok) {
          const services = await servicesResponse.json();
          
          for (const service of services) {
            try {
              const actionsResponse = await fetch(`${apiUrl}/services/${service.id}/actions`, { headers });
              if (actionsResponse.ok) {
                const actions = await actionsResponse.json();
                const action = actions.find((a: any) => a.id === stepData.action_id);
                
                if (action) {
                  console.log('[VariableSelector] Found action definition:', action);
                  variablesObj = action.variables || {};
                  break;
                }
              }
            } catch (err) {
              continue;
            }
          }
        }
      }

      console.log('[VariableSelector] Variables object:', variablesObj);

      // Convert variables object/array to array format
      let variablesArray: Variable[] = [];
      
      if (Array.isArray(variablesObj)) {
        // Variables is already an array
        variablesArray = variablesObj.map((variable: any) => ({
          name: variable.name || variable.key,
          type: variable.type || 'unknown',
          key: variable.key || variable.name
        }));
      } else if (typeof variablesObj === 'object') {
        // Variables is an object, convert to array
        variablesArray = Object.entries(variablesObj).map(([key, value]: [string, any]) => ({
          name: value.name || key,
          type: value.type || 'unknown',
          key: value.key || key
        }));
      }

      console.log('[VariableSelector] Variables array:', variablesArray);
      setVariables(variablesArray);
      
    } catch (err) {
      console.error('[VariableSelector] Error fetching variables:', err);
      setError('Failed to fetch variables');
      setVariables([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectVariable = (variable: Variable) => {
    onInsertVariable(variable.name);
    setModalVisible(false);
  };

  const renderVariableItem = ({ item }: { item: Variable }) => (
    <TouchableOpacity
      style={styles.variableItem}
      onPress={() => handleSelectVariable(item)}
    >
      <View style={styles.variableInfo}>
        <Text style={styles.variableName}>{item.name}</Text>
        <Text style={styles.variableKey}>{'{{' + item.name + '}}'}</Text>
      </View>
      <View style={[styles.typeBadge, { backgroundColor: `${serviceColor}20` }]}>
        <Text style={[styles.typeText, { color: serviceColor }]}>{item.type}</Text>
      </View>
    </TouchableOpacity>
  );

  // Don't show button if no source is selected or no variables available
  if (!sourceStepId) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, { borderColor: serviceColor }]}
        onPress={() => setModalVisible(true)}
        disabled={loading || variables.length === 0}
      >
        {loading ? (
          <ActivityIndicator size="small" color={serviceColor} />
        ) : (
          <Text style={[styles.buttonText, { color: serviceColor }]}>
            {buttonText}
          </Text>
        )}
      </TouchableOpacity>

      {error && (
        <Text style={styles.error}>{error}</Text>
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Available Variables</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {variables.length === 0 ? (
              <View style={styles.noVariables}>
                <Text style={styles.noVariablesText}>No variables available from this source</Text>
              </View>
            ) : (
              <FlatList
                data={variables}
                keyExtractor={(item) => item.key}
                renderItem={renderVariableItem}
                style={styles.variableList}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  button: {
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'transparent',
    alignSelf: 'flex-start',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  error: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
    fontWeight: '300',
  },
  variableList: {
    maxHeight: 400,
  },
  variableItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  variableInfo: {
    flex: 1,
  },
  variableName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  variableKey: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  noVariables: {
    padding: 30,
    alignItems: 'center',
  },
  noVariablesText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default VariableSelector;
