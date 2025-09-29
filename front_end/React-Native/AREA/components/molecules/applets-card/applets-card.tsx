import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { AppletsCard } from "@/types/type";
import { imageMap } from "@/types/image";
import { Link } from "expo-router";

type Props = {
  item: AppletsCard,
};

const AppletCard = ({ item }: Props) => {

  return (
    <Link href={`/applet-details/${item.id}`} asChild>
      <TouchableOpacity style={styles.container}>
        <View style={[styles.button, {backgroundColor: item.backgroundColor}]}>
          <View style={styles.icons}>
            <Image style={styles.icon}
              source={imageMap[item.firstIconId] ?? imageMap["default"]}
            />
            <Image style={styles.icon}
              source={imageMap[item.secondeIconId] ?? imageMap["default"]}
            />
          </View>
          <View style={styles.texts}>
            <Text style={styles.description}>
              {item.description}
            </Text>
            <View style={styles.appIconWithText}>
              <Image source={imageMap[item.littleIconId] ?? imageMap["default"]} style={styles.littleIcon} />
              <Text style={styles.appName}>
                {item.appName}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  )
}

export default AppletCard;

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
