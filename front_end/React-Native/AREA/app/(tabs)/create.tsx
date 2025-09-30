import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet} from 'react-native';
import CreateCard from '@/components/molecules/create-card/create-card';


export default function CreateScreen() {

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#e8ecf4"}}>
      <View style={styles.container}>

        <Text style={styles.title}>
          Create
        </Text>

        <View>
          <CreateCard/>
        </View>


      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
  },

  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1e1e1e',
    padding: 20,
    marginVertical: 10,
  },

});
