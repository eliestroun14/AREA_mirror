import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Service } from "@/types/type";
import { imageMap } from "@/types/image";

type Props = {
  item: Service
};

const LittleServiceCard = ({ item }: Props) => {

  return (
    <View style={styles.container}>
      <TouchableOpacity style={{ height: 160, width: 160}}
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

export default LittleServiceCard;

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
