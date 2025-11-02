import { View, Text, StyleSheet } from 'react-native';
import ActionFieldCard from '@/components/molecules/action-field-card/action-field-card';
import { TriggerField } from '@/types/type';

interface FieldWithId extends TriggerField {
  fieldId: string;
}

interface ActionFieldsCardProps {
  fields: FieldWithId[];
  zapId?: number;
  sourceStepId: number | null;
  serviceColor: string;
  formData: Record<string, string>;
  onFieldChange: (fieldName: string, value: string) => void;
}

/**
 * Card component containing all action fields
 */
const ActionFieldsCard: React.FC<ActionFieldsCardProps> = ({
  fields,
  zapId,
  sourceStepId,
  serviceColor,
  formData,
  onFieldChange
}) => {
  if (fields.length === 0) {
    return null;
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Action Fields</Text>
      <View style={styles.fieldsContainer}>
        {fields.map((field) => (
          <ActionFieldCard
            key={field.fieldId}
            item={{ ...field, id: field.fieldId }}
            zapId={zapId}
            sourceStepId={sourceStepId}
            serviceColor={serviceColor}
            onFieldChange={onFieldChange}
            value={formData[field.fieldId]}
          />
        ))}
      </View>
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
  fieldsContainer: {
    marginTop: 8,
  },
});

export default ActionFieldsCard;
