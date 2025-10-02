import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, BackHandler, Alert} from 'react-native';
import CreateCard from '@/components/molecules/create-card/create-card';
import { Service, Trigger } from '@/types/type';
import { router, useLocalSearchParams } from "expo-router";
import db from "@/data/db.json";
import { useFocusEffect } from 'expo-router';
import { useCallback, useState, useEffect } from 'react';

export default function CreateScreen() {

  const { triggerId, serviceId } = useLocalSearchParams<{ triggerId?: string; serviceId?: string }>();

  // const service: Service | undefined = db.services.find(s => s.id === serviceId);
  // const trigger: Trigger | undefined = service?.triggers.find(t => t.id === triggerId);

  const [service, setService] = useState<Service | undefined>();
  const [trigger, setTrigger] = useState<Trigger | undefined>();

  useEffect(() => {
    const foundService = db.services.find(s => s.id === serviceId);
    const foundTrigger = foundService?.triggers.find(t => t.id === triggerId);
    
    setService(foundService);
    setTrigger(foundTrigger);
  }, [serviceId, triggerId]);


  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        if (service && trigger) {
          Alert.alert('Are you sure?', 'You have unsaved changes that will be lost if you leave the page', [
            {
              text: 'Stay here',
              onPress: () => null,
              style: 'cancel'
            },
            {
              text: 'Leave',
              onPress: () => {
                setService(undefined);
                setTrigger(undefined);
                router.push("/(tabs)/home")
              }
            }
          ]);
          return true;
        }
        return false;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );

      return () => backHandler.remove();
    }, [service, trigger])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#e8ecf4"}}>
      <View style={styles.container}>

        <Text style={styles.title}>
          Create
        </Text>

        <View>
          <CreateCard service={service}
            trigger={trigger}
          />
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
