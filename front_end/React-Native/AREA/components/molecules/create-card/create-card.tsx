import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Service, Trigger, Action } from "@/types/type";
import { router } from "expo-router";
import { imageMap } from "@/types/image";

type Props = {
  serviceTrigger?: Service;
  trigger?: Trigger;
  serviceAction?: Service;
  action?: Action;
  onPress?: () => void;
};

const CreateCard = ({ serviceTrigger, trigger, serviceAction, action, onPress }: Props) => {
  const hasTrigger = serviceTrigger && trigger;
  const hasAction = serviceAction && action;

  if (!hasTrigger) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            router.push("/select-trigger-service");
          }}
        >
          <View style={[styles.buttonTriggerDefault, { backgroundColor: "#000" }]}>
            <Text style={styles.text}>If This -</Text>
            <View style={styles.backgroundAddButton}>
              <Text style={styles.addButtonText}>Add</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.middleLine} />
        <View style={[styles.buttonActionDefault, { backgroundColor: "#999999ff" }]}> 
          <Text style={styles.actionButtonTextDefault}>Then That</Text>
        </View>
      </View>
    );
  } else if (hasTrigger && !hasAction) {
    return (
      <View style={styles.container}>
        <TouchableOpacity>
          <View style={[styles.buttonTriggered, { backgroundColor: serviceTrigger.services_color }]}> 
            <Text style={styles.text}>If</Text>
            <Image style={styles.appLogo} source={imageMap[serviceTrigger.id] ?? imageMap["default"]} />
            <Text style={styles.triggerName}>{trigger?.name}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.middleLine} />
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "/select-action-service",
              params: {
                triggerId: trigger.id,
                serviceTriggerId: serviceTrigger.id,
              },
            });
          }}
        >
          <View style={[styles.buttonTriggerDefault, { backgroundColor: "#000" }]}> 
            <Text style={styles.text}>Then That</Text>
            <View style={styles.backgroundAddButton}></View>
          </View>
        </TouchableOpacity>
      </View>
    );
  } else if (hasTrigger && hasAction) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={onPress}>
          <View style={[styles.buttonTriggered, { backgroundColor: serviceTrigger.services_color }]}> 
            <Text style={styles.text}>If</Text>
            <Image style={styles.appLogo} source={imageMap[serviceTrigger.id] ?? imageMap["default"]} />
            <Text style={styles.triggerName}>{trigger?.name}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.middleLine} />
        <TouchableOpacity>
          <View style={[styles.buttonTriggered, { backgroundColor: serviceAction?.services_color }]}> 
            <Text style={styles.text}>Then</Text>
            <Image style={styles.appLogo} source={imageMap[serviceAction.id] ?? imageMap["default"]} />
            <Text style={styles.triggerName}>{action?.name}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  return null;
};

export default CreateCard;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    marginVertical: 8,
  },
  buttonTriggerDefault: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    padding: 12,
    height: 80,
  },
  backgroundAddButton: {
    width: 100,
    height: 50,
    backgroundColor: "#eee",
    borderRadius: 50,
    justifyContent: "center",
  },
  addButtonText: {
    alignSelf: "center",
    fontSize: 25,
    fontWeight: "bold",
  },
  buttonActionDefault: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: 80,
  },
  actionButtonTextDefault: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#eee",
  },
  buttonTriggered: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 10,
    padding: 12,
    height: 80,
  },
  appLogo: {
    width: 40,
    height: 40,
  },
  triggerName: {
    fontSize: 20,
    color: "#eee",
    fontWeight: "bold",
    marginLeft: 10,
  },
  text: {
    fontSize: 30,
    color: "#eee",
    fontWeight: "bold",
    marginRight: 10,
    marginLeft: 20,
  },
  middleLine: {
    alignSelf: "center",
    width: 10,
    height: 80,
    backgroundColor: "#c5c5c5ff",
  },
});
