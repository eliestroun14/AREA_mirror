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

        <View style={[styles.input, {height: 60 }]}>
          <TextInput
            style={[styles.inputControl, { flex: 1, width: "100%", height: "100%" }]}
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

        <View style={[styles.input, {height: 120 }]}>
          <TextInput
            style={[styles.inputControl, { flex: 1, width: "100%", height: "100%" }]}
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

        <View style={[styles.input]}>
          <Picker
            style={[styles.inputControl, { flex: 1, width: "100%", height: "100%" }]}
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

      <View style={[styles.input, {height: 60 }]}>
        <TextInput
          style={[styles.inputControl, { flex: 1, width: "100%", height: "100%" }]}
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
    paddingHorizontal: 10,
    marginVertical: 10,
  },

  input: {
    alignItems: "flex-start",
    backgroundColor: "#e6e3e3ff",
    borderRadius: 10,
    padding: 12,
    height: 60,
  },

  inputControl: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
  },

  buttonText: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
  },

  fieldTitle: {
    flex: 1,
    fontSize: 18,
    color: "#eee",
    fontWeight: "bold",
    marginBottom: 10
  },

  required: {
    color: '#ff4444',
    fontWeight: 'bold',
  },
});
