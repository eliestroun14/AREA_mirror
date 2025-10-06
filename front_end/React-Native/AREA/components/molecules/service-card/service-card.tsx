import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Service } from "@/types/type";
import { Link } from "expo-router";
import { imageMap } from "@/types/image";

type Props = {
  item: Service
};

const ServiceCard = ({ item }: Props) => {
  return (
    <Link href={`/service-explore-details/${item.id}`} asChild>
      <TouchableOpacity style={styles.container}>
        <View style={[styles.button, { backgroundColor: item.services_color, height: 200 }]}>
          <Image
            style={styles.appLogo}
            source={imageMap[item.name] ?? imageMap["default"]}
          />
          <Text style={styles.buttonText}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
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
