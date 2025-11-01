import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { TriggerField } from "@/types/type";
import { useState } from "react";
import {Picker} from '@react-native-picker/picker';
import VariableSelector from "../variable-selector/variable-selector";

type Props = {
  item: TriggerField;
  zapId?: number;
  sourceStepId?: number | null;
  serviceColor?: string;
  onFieldChange?: (fieldName: string, value: string) => void;
  value?: string;
};

const ActionFieldCard = ({ 
  item, 
  zapId, 
  sourceStepId, 
  serviceColor = '#075eec',
  onFieldChange,
  value
}: Props) => {

  const [dataAction, setDataAction] = useState(
    value ?? item.default_value ?? item.options?.[0]?.value ?? ""
  );

  const handleValueChange = (newValue: string) => {
    setDataAction(newValue);
    if (onFieldChange) {
      onFieldChange(item.id, newValue);
    }
  };

  const handleInsertVariable = (variableName: string) => {
    const currentValue = dataAction || '';
    const newValue = currentValue + `{{${variableName}}}`;
    handleValueChange(newValue);
  };

  if (item.type == "string") {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.fieldTitle}>
            {item.field_name}
            {item.required && <Text style={styles.required}> *</Text>}
          </Text>
        </View>

        <View style={[styles.input, { minHeight: 48 }]}>
          <TextInput
            style={[styles.inputControl, { flex: 1, width: "100%", minHeight: 48 }]}
            placeholder={item.placeholder}
            placeholderTextColor='#6b7280'
            value={dataAction}
            onChangeText={handleValueChange}
            multiline={false}
          />
        </View>
        
        {zapId && sourceStepId && (
          <VariableSelector
            zapId={zapId}
            sourceStepId={sourceStepId}
            onInsertVariable={handleInsertVariable}
            serviceColor={serviceColor}
          />
        )}
      </View>
    )
  } else if (item.type == "textarea") {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.fieldTitle}>
            {item.field_name}
            {item.required && <Text style={styles.required}> *</Text>}
          </Text>
        </View>

        <View style={[styles.input, { minHeight: 120 }]}>
          <TextInput
            style={[styles.inputControl, { flex: 1, width: "100%", minHeight: 100 }]}
            placeholder={item.placeholder}
            placeholderTextColor='#6b7280'
            value={dataAction}
            onChangeText={handleValueChange}
            multiline={true}
            textAlignVertical="top"
          />
        </View>
        
        {zapId && sourceStepId && (
          <VariableSelector
            zapId={zapId}
            sourceStepId={sourceStepId}
            onInsertVariable={handleInsertVariable}
            serviceColor={serviceColor}
          />
        )}
      </View>
    )
  } else if (item.type == "select" && item.options) {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.fieldTitle}>
            {item.field_name}
            {item.required && <Text style={styles.required}> *</Text>}
          </Text>
        </View>

        <View style={[styles.input, { minHeight: 48 }]}>
          <Picker
            style={[styles.inputControl, { flex: 1, width: "100%", height: 48 }]}
            selectedValue={dataAction}
            onValueChange={(val: string) => handleValueChange(val)}
          >
            {item.options.map((opt) => (
              <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
            ))}
          </Picker>
        </View>
      </View>
    )
  }
  
  // Fallback for unknown field types
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.fieldTitle}>
          {item.field_name}
          {item.required && <Text style={styles.required}> *</Text>}
        </Text>
      </View>

      <View style={[styles.input, { minHeight: 48 }]}>
        <TextInput
          style={[styles.inputControl, { flex: 1, width: "100%", minHeight: 48 }]}
          placeholder={item.placeholder}
          placeholderTextColor='#6b7280'
          value={dataAction}
          onChangeText={handleValueChange}
        />
      </View>
      
      {zapId && sourceStepId && (
        <VariableSelector
          zapId={zapId}
          sourceStepId={sourceStepId}
          onInsertVariable={handleInsertVariable}
          serviceColor={serviceColor}
        />
      )}
    </View>
  )
}

export default ActionFieldCard;

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },

  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },

  inputControl: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
  },

  buttonText: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },

  fieldTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginBottom: 8,
  },

  required: {
    color: '#ff4444',
    fontWeight: 'bold',
  },
});
