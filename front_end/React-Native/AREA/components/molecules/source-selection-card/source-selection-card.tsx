import { View, Text, StyleSheet } from 'react-native';
import StepSourceSelector from '@/components/molecules/step-source-selector/step-source-selector';

interface SourceSelectionCardProps {
  zapId: number;
  selectedFromStepId: number | null;
  onSelectFromStep: (fromStepId: number | null) => void;
  serviceColor: string;
}

/**
 * Card component for source step selection
 */
const SourceSelectionCard: React.FC<SourceSelectionCardProps> = ({
  zapId,
  selectedFromStepId,
  onSelectFromStep,
  serviceColor
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Source Step</Text>
      <Text style={styles.description}>
        Choose which step's data to use for variables in this action
      </Text>
      <StepSourceSelector
        zapId={zapId}
        selectedFromStepId={selectedFromStepId}
        onSelectFromStep={onSelectFromStep}
        serviceColor={serviceColor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
});

export default SourceSelectionCard;
