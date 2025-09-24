import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet} from 'react-native';
import CreateCard from '@/components/molecules/create-card/create-card';
import add from '../../assets/images/add-round-white-icon.webp'
import { router } from 'expo-router';


export default function CreateScreen() {

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#e8ecf4"}}>
      <View style={styles.container}>

        <Text style={styles.title}>
          Create
        </Text>

        <Text style={styles.text}>
          You've created x of x Applets
        </Text>

        <View style={styles.Cards}>
          <CreateCard appName='Add one'
          text='If This -'
          appLogoPath={add}
          backgroundColor='rgba(0, 0, 0, 1)'
          onPress={() => router.push("/select-trigger-service")}
          />
        </View>


      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
  },

  profileImage: {
    width: 80,
    height: 80,
    alignSelf: 'flex-end',
    borderRadius: 100
  },

  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1e1e1e',
    padding: 20,
    marginVertical: 10,
  },

  text: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center"
  },

  homeConfig: {
    padding: 10,
  },

  searchBar: {
    marginBottom: 15,
  },

  Cards: {
    marginTop: 5
  }

});
