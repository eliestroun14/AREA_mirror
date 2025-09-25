import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";

type AppletCardCardProps = {
  description: string;
  appName: string;
  backgroundColor: string;
  firstIconPath: string | number;
  secondIconPath?: string | number;
  littleIconPath?: string | number;
  onPress?: () => void;
};

export default function AppletCardCard({ description, appName, backgroundColor, firstIconPath, secondIconPath, littleIconPath, onPress }: AppletCardCardProps) { //TODO: modifier la complex explore card
  return (
    <View style={styles.container}>
      <TouchableOpacity style={{ height: 300 }}
        onPress={onPress}
        >
        <View style={[styles.button, {backgroundColor}]}>
          <View style={styles.icons}>
            <Image style={styles.icon}
              source={firstIconPath}
            />
            <Image style={styles.icon}
              source={secondIconPath}
            />
          </View>
          <View style={styles.texts}>
            <Text style={styles.description}>
              {description}
            </Text>
            <View style={styles.appIconWithText}>
              <Image source={littleIconPath} style={styles.littleIcon} />
              <Text style={styles.appName}>
                {appName}
              </Text>
            </View>
          </View>
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
    alignItems: "flex-start",
    backgroundColor: "#e6e3e3ff",
    borderRadius: 10,
    padding: 12,
    height: 300,
  },

  icons: {
    flexDirection: "row"
  },

  icon: {
    width: 60,
    height: 60,
    marginRight: 12,
  },

  description: {
    fontSize: 24,
    color: "#eee",
    fontWeight: "bold",
  },

  texts: {
    marginTop: 12
  },

  appName: {
    flex: 1,
    fontSize: 16,
    color: "#eee",
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginLeft: 10
  },

  appIconWithText: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10
  },

  littleIcon: {
    width: 20,
    height: 20,
  },
});
