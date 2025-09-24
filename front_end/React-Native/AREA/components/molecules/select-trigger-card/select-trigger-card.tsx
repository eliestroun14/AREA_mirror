import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";

type SelectTriggerCardProps = {
  appName: string;
  backgroundColor: string;
  appLogoPath: string | number;
  onPress?: () => void;
};

export default function SelectTriggerCard({ appName, backgroundColor, appLogoPath, onPress }: SelectTriggerCardProps) { //TODO: modifier la simple explore card
  return (
    <View style={styles.container}>
      <TouchableOpacity style={{ height: 160, width: 160 }}
        onPress={onPress}
        >
        <View style={[styles.button, {backgroundColor}]}>
          <Image style={styles.appLogo}
            source={appLogoPath}
          />
          <Text style={styles.buttonText}>
            {appName}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    marginVertical: 8,
  },

  button: {
    alignItems: "center",
    backgroundColor: "#e6e3e3ff",
    borderRadius: 10,
    padding: 12,
    height: 160,
    width: 160
  },

  appLogo: {
    width: 60,
    height: 60,
    marginBottom: 30,
    marginTop: 10
  },

  buttonText: {
    flex: 1,
    fontSize: 18,
    color: "#eee",
    fontWeight: "bold",
  },
});
