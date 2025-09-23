import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // expo install @expo/vector-icons

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export default function SearchBar({ value, onChangeText, placeholder = "Search..." }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={30} color="#6b7280" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8ecf4",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 60,
  },
  icon: {
    marginRight: 8,
    backgroundColor: "#e8ecf4"
  },
  input: {
    flex: 1,
    fontSize: 20,
    color: "#111827",
    backgroundColor: '#e6e3e3ff',
    borderRadius: 10,
    height: 50
  },
});
