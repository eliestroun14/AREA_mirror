import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, BackHandler, Alert, TouchableOpacity } from 'react-native';
import CreateCard from '@/components/molecules/create-card/create-card';
import { Service, Trigger, Action } from '@/types/type';
import { useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState, useEffect } from 'react';

const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function CreateScreen() {
  console.log('(CREATE)');
  const { triggerId, serviceTriggerId } = useLocalSearchParams<{ triggerId?: string; serviceTriggerId?: string }>();
  const { actionId, serviceActionId } = useLocalSearchParams<{ actionId?: string; serviceActionId?: string }>();

  const [serviceTrigger, setServiceTrigger] = useState<Service | undefined>();
  const [trigger, setTrigger] = useState<Trigger | undefined>();
  const [serviceAction, setServiceAction] = useState<Service | undefined>();
  const [action, setAction] = useState<Action | undefined>();

  // Fetch service and trigger from backend
  useEffect(() => {
    const fetchServiceAndTrigger = async () => {
      if (!serviceTriggerId || !triggerId) return;
      try {
        const serviceRes = await fetch(`${apiUrl}/services/${serviceTriggerId}`);
        if (!serviceRes.ok) throw new Error('Service not found');
        const serviceData: Service = await serviceRes.json();
        setServiceTrigger(serviceData);
        // Fetch trigger details
        const triggerRes = await fetch(`${apiUrl}/services/${serviceTriggerId}/triggers/${triggerId}`);
        if (!triggerRes.ok) throw new Error('Trigger not found');
        const triggerData: Trigger = await triggerRes.json();
        setTrigger(triggerData);
      } catch (err) {
        setServiceTrigger(undefined);
        setTrigger(undefined);
      }
    };
    fetchServiceAndTrigger();
  }, [serviceTriggerId, triggerId]);

  // Fetch service and action from backend
  useEffect(() => {
    const fetchServiceAndAction = async () => {
      if (!serviceActionId || !actionId) return;
      try {
        const serviceRes = await fetch(`${apiUrl}/services/${serviceActionId}`);
        if (!serviceRes.ok) throw new Error('Service not found');
        const serviceData: Service = await serviceRes.json();
        setServiceAction(serviceData);
        // Fetch action details
        const actionRes = await fetch(`${apiUrl}/services/${serviceActionId}/actions/${actionId}`);
        if (!actionRes.ok) throw new Error('Action not found');
        const actionData: Action = await actionRes.json();
        setAction(actionData);
      } catch (err) {
        setServiceAction(undefined);
        setAction(undefined);
      }
    };
    fetchServiceAndAction();
  }, [serviceActionId, actionId]);

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        if (serviceTrigger && trigger) {
          Alert.alert('Are you sure?', 'This action will reset your configuration', [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: 'Reset configuration',
              onPress: () => {
                setServiceTrigger(undefined);
                setTrigger(undefined);
                setServiceAction(undefined);
                setAction(undefined);
              },
            },
          ]);
          return true;
        }
        return false;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => backHandler.remove();
    }, [serviceTrigger, trigger, serviceAction, action])
  );

  if (serviceAction || action) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
        <View style={styles.container}>
          <Text style={styles.title}>Create</Text>
          <View>
            <CreateCard
              serviceTrigger={serviceTrigger}
              trigger={trigger}
              serviceAction={serviceAction}
              action={action}
            />
          </View>
          <View>
            <TouchableOpacity style={styles.connectButton}
              // onPress={() => { TODO: link avec le back et créer le truc du coup }}
            >
              <Text style={styles.connectButtonText}>Finish</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
        <View style={styles.container}>
          <Text style={styles.title}>Create</Text>
          <View>
            <CreateCard
              serviceTrigger={serviceTrigger}
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
  container: {},
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1e1e1e',
    padding: 20,
    marginVertical: 10,
  },
  connectButton: {
    height: 80,
    backgroundColor: '#1e1e1e',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '90%',
    marginTop: 30,
  },
  connectButtonText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
  },
});
