import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Trigger } from "@/types/type";
import { imageMap } from "@/types/image";
import { Link } from "expo-router";

type Props = {
  item: Trigger;
  backgroundColor: string;
};

const TriggerCard = ({ item, backgroundColor }: Props) => {

  return (
    // <Link href={`/service-explore-details/${item.id}`} asChild>
      <TouchableOpacity style={styles.container}>
        <View style={[styles.button, { backgroundColor: backgroundColor, height: 60 }]}>
          <Text style={styles.buttonText}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    // </Link>
  )
}

export default TriggerCard;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    marginVertical: 10,
  },

  button: {
    alignItems: "center",
    backgroundColor: "#e6e3e3ff",
    borderRadius: 10,
    padding: 12,
    height: 60,
  },

  buttonText: {
    flex: 1,
    fontSize: 22,
    color: "#eee",
    fontWeight: "bold",
  },
});
