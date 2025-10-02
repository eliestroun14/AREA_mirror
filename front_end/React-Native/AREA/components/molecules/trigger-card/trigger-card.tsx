import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Trigger } from "@/types/type";
import { Link, router } from "expo-router";
import { useState } from "react";

type Props = {
  item: Trigger;
  backgroundColor: string;
};

const TriggerCard = ({ item, backgroundColor }: Props) => {

  const [isConnected, setIsConnected] = useState<Boolean>(true);
  const hasFields = Object.keys(item.fields).length > 0;

  if (isConnected === false) {
    return (
      <Link href={`/connect-service/${item.service.toLocaleLowerCase()}`} asChild>
        <TouchableOpacity style={styles.container}>
          <View style={[styles.button, { backgroundColor: backgroundColor, height: 60 }]}>
            <Text style={styles.buttonText}>
              {item.name}
            </Text>
          </View>
        </TouchableOpacity>
      </Link>
    )
  } else if (isConnected === true && hasFields === false) {
    return (
      <TouchableOpacity style={styles.container}
        onPress={() => (
          router.push({pathname: "/(tabs)/create",
            params: {triggerId: item.id, serviceTriggerId: item.service.toLocaleLowerCase()}}
          )
        )}>
        <View style={[styles.button, { backgroundColor: backgroundColor, height: 60 }]}>
          <Text style={styles.buttonText}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    )
  } else {
    return (
        <TouchableOpacity style={styles.container}
          onPress={() => (
            router.push({pathname: "/trigger-fields-page/[id]",
              params: { id: item.id,
                triggerId: item.id,
                serviceTriggerId: item.service.toLocaleLowerCase()}
            })
          )}
        >
          <View style={[styles.button, { backgroundColor: backgroundColor, height: 60 }]}>
            <Text style={styles.buttonText}>
              {item.name}
            </Text>
          </View>
        </TouchableOpacity>
    )
  }
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
