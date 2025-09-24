import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";

type BasicExploreCardProps = {
  description: string;
  category: string;
  backgroundColor: string;
  imageBackground?: string | number;
  onPress?: () => void;
};

export default function BasicExploreCard({ description, category, backgroundColor, imageBackground, onPress }: BasicExploreCardProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={{ height: 280}}
        onPress={onPress}
        >
        <View style={[styles.button, {backgroundColor, flex: 1}]}>
          <Image style={styles.backgroundImage}
            source={imageBackground}
          />

          <Text style={styles.category}>
            {category}
          </Text>

          <Text style={styles.description}>
            {description}
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
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    backgroundColor: "#e6e3e3ff",
    borderRadius: 10,
    padding: 12,
    height: 280,
  },

  backgroundImage: {
    width: 250,
    height: 250,
    alignSelf: "center",
    opacity: 0.4,
    bottom: 15,
    position: "absolute"
  },

  category: {
    fontSize: 16,
    color: "#eee",
    fontWeight: "bold",
  },

  description: {
    fontSize: 24,
    color: "#eee",
    fontWeight: "bold",
  },
});
