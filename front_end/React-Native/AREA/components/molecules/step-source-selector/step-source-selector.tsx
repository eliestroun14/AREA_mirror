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
      const headers = sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {};
      
      // Fetch all steps for this zap
      const response = await fetch(`${apiUrl}/zaps/${zapId}/steps`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch steps');
      }
      
      const data = await response.json();
      
      // Filter out steps that come after the current step (only allow previous steps as sources)
      let availableSteps: StepInfo[] = [];
      
      if (currentStepId) {
        // Find current step order
        const currentStep = data.find((step: any) => step.id === currentStepId);
        const currentOrder = currentStep ? currentStep.step_order : Infinity;
        
        // Only include steps with lower order (previous steps)
        availableSteps = data
          .filter((step: any) => step.step_order < currentOrder)
          .map((step: any) => {
            // Determine the name based on step type
            let name = '';
            if (step.step_type === 'TRIGGER') {
              name = 'Trigger';
            } else {
              name = `Action ${step.step_order}`;
            }
            
            return {
              id: step.id,
              name,
              step_order: step.step_order
            };
          })
          .sort((a, b) => a.step_order - b.step_order);
      } else {
        // For new actions, include all existing steps
        availableSteps = data
          .map((step: any) => ({
            id: step.id,
            name: step.step_type === 'TRIGGER' ? 'Trigger' : `Action ${step.step_order}`,
            step_order: step.step_order
          }))
          .sort((a, b) => a.step_order - b.step_order);
      }
      
      setSteps(availableSteps);
      
      // Auto-select trigger if no source is selected and trigger exists
      if (!selectedFromStepId && availableSteps.length > 0) {
        const triggerStep = availableSteps.find(step => step.step_order === 0);
        if (triggerStep) {
          onSelectFromStep(triggerStep.id);
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
      <Text style={styles.label}>Variable Source</Text>
      <Text style={styles.description}>
        Choose which step's data to use for variables in this action
      </Text>
      
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
    marginVertical: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'white',
  },
  selectorText: {
    fontSize: 16,
    flex: 1,
  },
  arrow: {
    fontSize: 12,
    marginLeft: 8,
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  stepList: {
    maxHeight: 300,
  },
  stepItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
  },
  stepText: {
    fontSize: 16,
    color: '#333',
  },
});

export default StepSourceSelector;
