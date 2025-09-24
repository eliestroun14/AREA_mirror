import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";

type CreateCardProps = {
  text: string;
  appName?: string;
  backgroundColor: string;
  appLogoPath?: string | number;
  onPress?: () => void;
};

export default function CreateCard({ text, appName, backgroundColor, appLogoPath, onPress }: CreateCardProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPress}
      >
        <View style={[styles.button, {backgroundColor}]}>
          <Text style={styles.text}>
            {text}
          </Text>
          <Text style={styles.appName}>
            {appName}
          </Text>
          <Image style={styles.appLogo}
            source={appLogoPath}
          />
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6e3e3ff",
    borderRadius: 10,
    padding: 12,
    height: 80,
  },

  appLogo: {
    width: 50,
    height: 50,
  },

  text: {
    fontSize: 24,
    color: "#eee",
    fontWeight: "bold",
    marginRight: 40,
    marginLeft: 30
  },

  appName: {
    fontSize: 24,
    color: "#eee",
    fontWeight: "bold",
    marginRight: 30,
  },
});
