import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, ActivityIndicator } from 'react-native';
import { StepInfo } from '@/types/type';
import { useApi } from '@/context/ApiContext';
import { useAuth } from '@/context/AuthContext';

interface StepSourceSelectorProps {
  zapId: number;
  currentStepId?: number | null;
  selectedFromStepId: number | null;
  onSelectFromStep: (fromStepId: number | null) => void;
  serviceColor?: string;
}

const StepSourceSelector: React.FC<StepSourceSelectorProps> = ({
  zapId,
  currentStepId,
  selectedFromStepId,
  onSelectFromStep,
  serviceColor = '#075eec'
}) => {
  const [steps, setSteps] = useState<StepInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { apiUrl } = useApi();
  const { sessionToken } = useAuth();

  useEffect(() => {
    fetchAvailableSteps();
  }, [zapId, currentStepId]);

  const fetchAvailableSteps = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const headers: Record<string, string> = {};
      if (sessionToken) {
        headers['Authorization'] = `Bearer ${sessionToken}`;
      }
      
      // Fetch trigger and actions separately (matching web implementation)
      let zapTrigger = null;
      try {
        const triggerResponse = await fetch(`${apiUrl}/zaps/${zapId}/trigger`, {
          headers
        });
        
        if (triggerResponse.ok) {
          const triggerData = await triggerResponse.json();
          zapTrigger = triggerData;
        }
      } catch (err) {
        console.warn('Failed to fetch zap trigger (ignored):', err);
      }
      
      // Fetch all actions
      const actionsResponse = await fetch(`${apiUrl}/zaps/${zapId}/actions`, {
        headers
      });
      
      if (!actionsResponse.ok) {
        throw new Error('Failed to fetch actions');
      }
      
      const actionsData = await actionsResponse.json();
      
      // Build available steps list
      let availableSteps: StepInfo[] = [];
      
      if (currentStepId) {
        // Find current action to get its step_order
        const currentAction = actionsData.find((stepData: any) => stepData.step?.id === currentStepId);
        const currentOrder = currentAction?.step?.step_order ?? Infinity;
        
        // Only include steps with lower order (previous steps)
        availableSteps = actionsData
          .filter((stepData: any) => (stepData.step?.step_order ?? 0) < currentOrder)
          .map((stepData: any) => ({
            id: stepData.step.id,
            name: stepData.action?.name || `Action ${stepData.step.step_order}`,
            step_order: stepData.step.step_order
          }));
        
        // Add trigger if it exists and comes before current step
        if (zapTrigger && zapTrigger.step && zapTrigger.step.step_order < currentOrder) {
          const triggerEntry: StepInfo = {
            id: zapTrigger.step.id,
            name: `Trigger — ${zapTrigger.service?.name || 'Trigger'}`,
            step_order: zapTrigger.step.step_order
          };
          if (!availableSteps.find(s => s.id === triggerEntry.id)) {
            availableSteps.push(triggerEntry);
          }
        }
      } else {
        // For new actions, include all existing actions
        availableSteps = actionsData.map((stepData: any) => ({
          id: stepData.step.id,
          name: stepData.action?.name || `Action ${stepData.step.step_order}`,
          step_order: stepData.step.step_order
        }));
        
        // Add trigger if it exists
        if (zapTrigger && zapTrigger.step) {
          const triggerEntry: StepInfo = {
            id: zapTrigger.step.id,
            name: `Trigger — ${zapTrigger.service?.name || 'Trigger'}`,
            step_order: zapTrigger.step.step_order
          };
          if (!availableSteps.find(s => s.id === triggerEntry.id)) {
            availableSteps.push(triggerEntry);
          }
        }
      }
      
      // Sort by step_order
      availableSteps = availableSteps.sort((a: StepInfo, b: StepInfo) => a.step_order - b.step_order);
      
      setSteps(availableSteps);
      
      // Auto-select trigger if no source is selected and trigger exists
      if (!selectedFromStepId && availableSteps.length > 0) {
        const triggerStep = availableSteps.find(step => step.step_order === 0);
        if (triggerStep) {
          onSelectFromStep(triggerStep.id);
        } else if (availableSteps.length > 0) {
          onSelectFromStep(availableSteps[0].id);
        }
      }
      
    } catch (err) {
      console.error('Error fetching steps:', err);
      setError('Failed to fetch available steps');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStep = (stepId: number) => {
    onSelectFromStep(stepId);
    setModalVisible(false);
  };

  const getSelectedStepName = () => {
    if (!selectedFromStepId) return 'Select source';
    const selectedStep = steps.find(step => step.id === selectedFromStepId);
    return selectedStep ? selectedStep.name : 'Unknown source';
  };

  const renderStepItem = ({ item }: { item: StepInfo }) => (
    <TouchableOpacity
      style={[
        styles.stepItem,
        item.id === selectedFromStepId && { backgroundColor: `${serviceColor}20` }
      ]}
      onPress={() => handleSelectStep(item.id)}
    >
      <Text style={[
        styles.stepText,
        item.id === selectedFromStepId && { color: serviceColor, fontWeight: 'bold' }
      ]}>
        {item.name} (Step {item.step_order})
      </Text>
    </TouchableOpacity>
  );

  if (steps.length === 0 && !loading) {
    return null; // Don't show selector if no previous steps exist
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.selector, { borderColor: serviceColor }]}
        onPress={() => setModalVisible(true)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color={serviceColor} />
        ) : (
          <Text style={[styles.selectorText, { color: serviceColor }]}>
            {getSelectedStepName()}
          </Text>
        )}
        <Text style={[styles.arrow, { color: serviceColor }]}>▼</Text>
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
              <Text style={styles.modalTitle}>Select Variable Source</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={steps}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderStepItem}
              style={styles.stepList}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  selectorText: {
    fontSize: 16,
    flex: 1,
    fontWeight: '500',
  },
  arrow: {
    fontSize: 12,
    marginLeft: 8,
  },
  error: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: 8,
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
  stepList: {
    maxHeight: 400,
  },
  stepItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  stepText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});

export default StepSourceSelector;
