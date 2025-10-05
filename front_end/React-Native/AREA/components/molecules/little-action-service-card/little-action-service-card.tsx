import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Service } from "@/types/type";
import { imageMap } from "@/types/image";
import { router } from "expo-router";

type Props = {
  item: Service
  triggerId?: string;
  serviceTriggerId?: string;
};

const LittleActionServiceCard = ({ item, triggerId, serviceTriggerId }: Props) => {

  const href = {
    pathname: "/create-action-service/[id]" as const,
    params: {
      id: item.id,
      triggerId: triggerId,
      serviceTriggerId: serviceTriggerId
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => {
        router.push(href);
      }}
    >
      <View style={[styles.button, { backgroundColor: item.services_color, height: 160, width: 160 }]}>
        <Image
          style={styles.appLogo}
          source={imageMap[item.name] ?? imageMap["default"]}
        />
        <Text style={styles.buttonText}>
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  )
}


export default LittleActionServiceCard;

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
    height: 165,
    width: 165
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
