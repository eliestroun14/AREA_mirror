import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, Image } from 'react-native';
import build from '../../assets/images/Construction crane-pana.png';

export default function ActivityScreen() {

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#e8ecf4"}}>
      <View style={styles.container}>
        <Image source={build}
          style={styles.image}
        />

        <Text style={styles.text}>
          Sorry, this page is not finished.
        </Text>

        <Text style={styles.text}>
          Come back later
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignSelf: "center",
  },

  image: {
    width: 300,
    height: 300,
    marginTop: 100
  },

  text: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center"
  },

});
