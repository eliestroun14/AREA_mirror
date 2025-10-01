import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { TriggerField } from "@/types/type";
import { useState } from "react";
import {Picker} from '@react-native-picker/picker';

type Props = {
  item: TriggerField;
};

const TriggerFieldCard = ({ item }: Props) => {

  const [dataTrigger, setdataTrigger] = useState('');

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.fieldTitle}>
          {item.field_name}
        </Text>
      </View>

      <View style={[styles.input, {height: 60 }]}>
        <TextInput
          style={[styles.inputControl, { flex: 1, width: "100%", height: "100%" }]}
          placeholder={item.placeholder}
          placeholderTextColor='#6b7280'
          value={dataTrigger}
          onChangeText={(dataTrigger: string) => setdataTrigger(dataTrigger)}
        />
      </View>
    </View>
  )
}

export default TriggerFieldCard;

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
});
