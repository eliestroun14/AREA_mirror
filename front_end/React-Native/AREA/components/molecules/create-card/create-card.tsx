import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useState } from "react";
import { router } from 'expo-router';

type Props = {
};

const CreateCard = (props: Props) => {

  const [needAction, setNeedAction] = useState(false);

  if (needAction === true) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
                router.push("/select-trigger-service")
        }}>
          <View style={[styles.buttonTriggerDefault, {backgroundColor: "#000"}]}>
            <Text style={styles.text}>
              If This -
            </Text>
            <View style={styles.backgroundAddButton}>
              <Text style={styles.addButtonText}>
                Add
              </Text>
            </View>
          </View>
        </TouchableOpacity>
  
        <View style={styles.middleLine} />
        <TouchableOpacity>
          <View style={[styles.buttonActionDefault, {backgroundColor: "#999999ff"}]}>
            <Text style={styles.actionButtonTextDefault}>
              Then That
            </Text>
          </View>
        </TouchableOpacity>
  
      </View>
    );
  }
  else {
    return (
      <View style={styles.container}>
        <TouchableOpacity
        >
          <View style={[styles.button]}>
            <Text style={styles.text}>

            </Text>
            <Text style={styles.appName}>

            </Text>
            <Image style={styles.appLogo}
            />
          </View>
        </TouchableOpacity>
  
        <View style={styles.middleLine} />
        <TouchableOpacity>
          <View style={[styles.button]}>
            <Text style={styles.text}>
              
            </Text>
            <Text style={styles.appName}>
              
            </Text>
            <Image style={styles.appLogo}
            />
          </View>
        </TouchableOpacity>
  
      </View>
    );
  }
}

export default CreateCard

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

  addButtonText : {
    alignSelf: "center",
    fontSize: 20,
    fontWeight: "bold"
  },

  buttonActionDefault: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: 80,
  },

  actionButtonTextDefault : {
    fontSize: 25,
    fontWeight: "bold",
    color: "#eee"
  },

  appLogo: {
    width: 50,
    height: 50,
  },

  text: {
    fontSize: 24,
    color: "#eee",
    fontWeight: "bold",
    marginRight: 10,
    marginLeft: 30
  },

  appName: {
    fontSize: 24,
    color: "#eee",
    fontWeight: "bold",
    marginRight: 30,
  },

  middleLine: {
    alignSelf: "center",
    width: 10,
    height: 80,
    backgroundColor: "#c5c5c5ff"
  },
});
