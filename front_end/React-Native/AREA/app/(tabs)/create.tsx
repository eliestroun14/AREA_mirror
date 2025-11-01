import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, BackHandler, Alert, TouchableOpacity } from 'react-native';
import CreateCard from '@/components/molecules/create-card/create-card';
import { Service, Trigger, Action } from '@/types/type';
import { useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useApi } from '@/context/ApiContext';


export default function CreateScreen() {
  console.log('(CREATE)');

  const { triggerId, serviceTriggerId } = useLocalSearchParams<{ triggerId?: string; serviceTriggerId?: string }>();
  const { actionId, serviceActionId, zapId, fromStepId, actionFormData } = useLocalSearchParams<{ 
    actionId?: string; 
    serviceActionId?: string;
    zapId?: string;
    fromStepId?: string;
    actionFormData?: string;
  }>();

  const [serviceTrigger, setServiceTrigger] = useState<Service | undefined>();
  const [trigger, setTrigger] = useState<Trigger | undefined>();
  const [serviceAction, setServiceAction] = useState<Service | undefined>();
  const [action, setAction] = useState<Action | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [triggerConnection, setTriggerConnection] = useState<any>(null);
  const [actionConnection, setActionConnection] = useState<any>(null);
  const router = useRouter();
  const { user, sessionToken } = useAuth();

  const { apiUrl } = useApi();

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

  // Fetch connections for trigger and action services
  useEffect(() => {
    const fetchConnections = async () => {
      if (!sessionToken) return;
      if (serviceTriggerId) {
        try {
          const res = await axios.get(`${apiUrl}/users/me/connections/service/${serviceTriggerId}`, {
            headers: { Authorization: `Bearer ${sessionToken}` },
          });
          setTriggerConnection(res.data.connections?.[0] || null);
        } catch (err) {
          setTriggerConnection(null);
        }
      }
      if (serviceActionId) {
        try {
          const res = await axios.get(`${apiUrl}/users/me/connections/service/${serviceActionId}`, {
            headers: { Authorization: `Bearer ${sessionToken}` },
          });
          setActionConnection(res.data.connections?.[0] || null);
        } catch (err) {
          setActionConnection(null);
        }
      }
    };
    fetchConnections();
  }, [serviceTriggerId, serviceActionId, sessionToken]);

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

  // Helper: get accountIdentifier (for demo, just use user.email or prompt user)
  const accountIdentifier = user?.email || 'demo@area.com';

  const handleFinish = async () => {
    if (!trigger || !action) return;
    if (!triggerConnection || !actionConnection) {
      setError('You must connect your account to both services before creating a zap.');
      return;
    }
    console.log('[Finish] Button pressed');
    router.replace('/(tabs)/explore');
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const authHeaders = sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {};
      console.log('[Finish] Creating zap...');
      const zapPayload = {
        name: `Zap: ${trigger.name} -> ${action.name}`,
        description: `Auto-created zap from mobile UI`,
      };
      console.log('[Finish] Zap payload:', zapPayload);
      const zapRes = await axios.post(`${apiUrl}/zaps`, zapPayload, { headers: authHeaders });
      const zapId = zapRes.data.id;
      console.log('[Finish] Zap created with id:', zapId);
      const triggerPayload = {
        triggerId: trigger.id,
        accountIdentifier: triggerConnection.account_identifier,
        payload: {},
      };
      console.log('[Finish] Trigger step payload:', triggerPayload);
      const triggerStepRes = await axios.post(`${apiUrl}/zaps/${zapId}/trigger`, triggerPayload, { headers: authHeaders });
      console.log('[Finish] Trigger step response:', triggerStepRes.data);
      
      // Parse form data if provided
      let actionPayloadData = {};
      if (actionFormData) {
        try {
          actionPayloadData = JSON.parse(actionFormData);
        } catch (e) {
          console.warn('Failed to parse action form data:', e);
        }
      }
      
      // Use provided fromStepId or default to trigger step
      const sourceStepId = fromStepId ? Number(fromStepId) : triggerStepRes.data?.id || 1;
      
      const actionPayload = {
        actionId: action.id,
        fromStepId: sourceStepId,
        stepOrder: 1,
        accountIdentifier: actionConnection.account_identifier,
        payload: actionPayloadData,
      };
      console.log('[Finish] Action step payload:', actionPayload);
      const actionStepRes = await axios.post(`${apiUrl}/zaps/${zapId}/action`, actionPayload, { headers: authHeaders });
      console.log('[Finish] Action step response:', actionStepRes.data);
      setSuccess(true);
      setTimeout(() => {
        router.replace('/(tabs)/profile');
      }, 1200);
    } catch (err: any) {
      if (err.response) {
        console.log('[Finish] Error response:', err.response.data);
        setError('Failed to create zap: ' + JSON.stringify(err.response.data));
      } else {
        console.log('[Finish] Error:', err);
        setError('Failed to create zap. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
      console.log('[Finish] Done');
    }
  };

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
              onPress={handleFinish}
              disabled={loading}
            >
              <Text style={styles.connectButtonText}>{loading ? 'Creating...' : 'Finish'}</Text>
            </TouchableOpacity>
            {error && <Text style={{ color: 'red', marginTop: 10 }}>{error}</Text>}
            {success && <Text style={{ color: 'green', marginTop: 10 }}>Zap created!</Text>}
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
