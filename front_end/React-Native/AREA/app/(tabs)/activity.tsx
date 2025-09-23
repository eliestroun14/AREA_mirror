import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from 'react-native';


export default function ActivityScreen() {

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#e8ecf4"}}>
      <Text>
        Activity
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,

  },

  header: {
    padding: 20,
    marginVertical: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  profileImage: {
    width: 80,
    height: 80,
    alignSelf: 'flex-end',
    borderRadius: 100
  },

  title: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#1e1e1e',
    marginBottom: 6,
  },

  homeConfig: {
    padding: 10,
  },

  searchBar: {
    marginBottom: 15,
  },

  appCards: {
    marginTop: 5
  }

});
