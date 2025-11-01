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
      
      let zapTrigger = null;
      try {
        const triggerResponse = await fetch(`${apiUrl}/zaps/${zapId}/trigger`, {
          headers
        });
        
        if (triggerResponse.ok) {
          const triggerData = await triggerResponse.json();
          
          if (triggerData && triggerData.step_type === 'TRIGGER') {
            zapTrigger = {
              step: triggerData,
              trigger: { name: 'Trigger' },
              service: { name: 'Service' }
            };
          }
        }
      } catch (err) {
        console.warn('Failed to fetch trigger:', err);
      }
      
      const actionsResponse = await fetch(`${apiUrl}/zaps/${zapId}/actions`, {
        headers
      });
      
      if (!actionsResponse.ok) {
        throw new Error('Failed to fetch actions');
      }
      
      const actionsData = await actionsResponse.json();
      let availableSteps: StepInfo[] = [];
      
      if (currentStepId) {
        const currentAction = actionsData.find((stepData: any) => stepData.id === currentStepId);
        const currentOrder = currentAction?.step_order ?? Infinity;
        
        availableSteps = actionsData
          .filter((stepData: any) => (stepData.step_order ?? 0) < currentOrder)
          .map((stepData: any) => ({
            id: stepData.id,
            name: `Action ${stepData.step_order}`,
            step_order: stepData.step_order
          }));
        
        if (zapTrigger && zapTrigger.step && zapTrigger.step.step_order < currentOrder) {
          const triggerEntry: StepInfo = {
            id: zapTrigger.step.id,
            name: `Trigger — ${zapTrigger.trigger?.name || zapTrigger.service?.name || 'Trigger'}`,
            step_order: zapTrigger.step.step_order
          };
          if (!availableSteps.find(s => s.id === triggerEntry.id)) {
            availableSteps.push(triggerEntry);
          }
        }
      } else {
        availableSteps = actionsData
          .filter((stepData: any) => stepData.id)
          .map((stepData: any) => ({
            id: stepData.id,
            name: `Action ${stepData.step_order}`,
            step_order: stepData.step_order
          }));
        
        if (zapTrigger && zapTrigger.step) {
          const triggerEntry: StepInfo = {
            id: zapTrigger.step.id,
            name: `Trigger — ${zapTrigger.trigger?.name || zapTrigger.service?.name || 'Trigger'}`,
            step_order: zapTrigger.step.step_order
          };
          if (!availableSteps.find(s => s.id === triggerEntry.id)) {
            availableSteps.push(triggerEntry);
          }
        }
      }
      
      availableSteps = availableSteps.sort((a: StepInfo, b: StepInfo) => a.step_order - b.step_order);
      setSteps(availableSteps);
      
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
    if (selectedStep) {
      return `${selectedStep.name} (Step ${selectedStep.step_order})`;
    }
    return 'Selected source';
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

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.selector, 
          { borderColor: serviceColor },
          (loading || steps.length === 0) && styles.selectorDisabled
        ]}
        onPress={() => setModalVisible(true)}
        disabled={loading || steps.length === 0}
      >
        {loading ? (
          <>
            <ActivityIndicator size="small" color={serviceColor} />
            <Text style={[styles.selectorText, { color: serviceColor, marginLeft: 12 }]}>
              Loading sources...
            </Text>
          </>
        ) : (
          <>
            <Text style={[styles.selectorText, { color: serviceColor }]}>
              {steps.length === 0 ? 'No sources available' : getSelectedStepName()}
            </Text>
            {steps.length > 0 && (
              <Text style={[styles.arrow, { color: serviceColor }]}>▼</Text>
            )}
          </>
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
              <Text style={styles.modalTitle}>Select Variable Source</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {steps.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  No previous steps available yet.
                </Text>
                <Text style={styles.emptyStateSubtext}>
                  The trigger step will appear here once it's created.
                </Text>
              </View>
            ) : (
              <FlatList
                data={steps}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderStepItem}
                style={styles.stepList}
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
  selectorDisabled: {
    opacity: 0.6,
    backgroundColor: '#f5f5f5',
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
  emptyState: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default StepSourceSelector;
