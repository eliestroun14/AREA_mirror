import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Service } from "@/types/type";
import { imageMap } from "@/types/image";

type Props = {
  item: Service
};

const ServiceCard = ({ item }: Props) => {

  return (
    <View style={styles.container}>
      <TouchableOpacity style={{ height: 200}}
        // onPress={onPress}
        >
        <View style={[styles.button, {backgroundColor: item.backgroundColor}]}>
          <Image style={styles.appLogo}
            source={imageMap[item.id] ?? imageMap["default"]}
          />
          <Text style={styles.buttonText}>
            {item.serviceName}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default ServiceCard;

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
