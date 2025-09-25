import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";

type ServiceCardProps = {
  appName: string;
  backgroundColor: string;
  appLogoPath: string | number;
  onPress?: () => void;
};

export default function ServiceCard({ appName, backgroundColor, appLogoPath, onPress }: ServiceCardProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={{ height: 200}}
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
    height: 200,
  },

  appLogo: {
    width: 140,
    height: 140,
    // borderRadius: 8,
  },

  buttonText: {
    flex: 1,
    fontSize: 24,
    color: "#eee",
    fontWeight: "bold",
  },
});
