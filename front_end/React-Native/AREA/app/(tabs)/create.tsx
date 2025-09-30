import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet} from 'react-native';
import CreateCard from '@/components/molecules/create-card/create-card';
import { useState } from 'react';
import { Service, Trigger } from '@/types/type';
import { useLocalSearchParams } from "expo-router";
import db from "@/data/db.json";

export default function CreateScreen() {

    const { triggerId, serviceId } = useLocalSearchParams<{ triggerId?: string; serviceId?: string }>();

  const service: Service | undefined = db.services.find(s => s.id === serviceId);
  const trigger: Trigger | undefined = service?.triggers.find(t => t.id === triggerId);


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
