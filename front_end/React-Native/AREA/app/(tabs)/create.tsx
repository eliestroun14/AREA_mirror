import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, BackHandler, Alert, TouchableOpacity} from 'react-native';
import CreateCard from '@/components/molecules/create-card/create-card';
import { Service, Trigger } from '@/types/type';
import {useLocalSearchParams } from "expo-router";
import db from "@/data/db.json";
import { useFocusEffect } from 'expo-router';
import { useCallback, useState, useEffect } from 'react';

export default function CreateScreen() {

  const { triggerId, serviceTriggerId } = useLocalSearchParams<{ triggerId?: string; serviceTriggerId?: string }>();

  const [serviceTrigger, setServiceTrigger] = useState<Service | undefined>();
  const [trigger, setTrigger] = useState<Trigger | undefined>();

  useEffect(() => {
    const foundServiceTrigger = db.services.find(s => s.id === serviceTriggerId);
    const foundTrigger = foundServiceTrigger?.triggers.find(t => t.id === triggerId);

    setServiceTrigger(foundServiceTrigger);
    setTrigger(foundTrigger);
  }, [serviceTriggerId, triggerId]);

  const { actionId, serviceActionId } = useLocalSearchParams<{ actionId?: string; serviceActionId?: string }>();

  const [serviceAction, setServiceAction] = useState<Service | undefined>();
  const [action, setAction] = useState<Trigger | undefined>();

  useEffect(() => {
    const foundServiceAction = db.services.find(s => s.id === serviceActionId);
    const foundAction = foundServiceAction?.triggers.find(a => a.id === actionId);

    setServiceAction(foundServiceAction);
    setAction(foundAction);
  }, [serviceActionId, actionId]);

  console.log("serviceTrigger = ", serviceTrigger?.id);
  console.log("serviceAction = ", serviceAction?.id);

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        if (serviceTrigger && trigger) {
          Alert.alert('Are you sure?', 'This action will reset your configuration', [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel'
            },
            {
              text: 'Reset configuration',
              onPress: () => {
                setServiceTrigger(undefined);
                setTrigger(undefined);
                setServiceAction(undefined);
                setAction(undefined);
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
    }, [serviceTrigger, trigger, serviceAction, action])
  );

  if (serviceAction || action) {
    return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#e8ecf4"}}>
        <View style={styles.container}>

          <Text style={styles.title}>
            Create
          </Text>
          <View>
            <CreateCard serviceTrigger={serviceTrigger}
              trigger={trigger}
              serviceAction={serviceAction}
              action={action}
            />
          </View>

          <View>
            <TouchableOpacity style={styles.connectButton}
              // onPress={() => { TODO: link avec le back et créer le truc du coup

              // }}
              >
              <Text style={styles.connectButtonText}>
                  Finish
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#e8ecf4"}}>
        <View style={styles.container}>

          <Text style={styles.title}>
            Create
          </Text>

          <View>
            <CreateCard serviceTrigger={serviceTrigger}
              trigger={trigger}
              serviceAction={serviceAction}
              action={action}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
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

  connectButton: {
  height: 80,
  backgroundColor: "#1e1e1e",
  borderRadius: 100,
  alignItems: "center",
  justifyContent: "center",
  alignSelf: "center",
  width: "90%",
  marginTop: 30
},

  connectButtonText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#fff"
  },

});
