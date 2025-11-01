import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, BackHandler, Alert, TouchableOpacity, ScrollView } from 'react-native';
import CreateCard from '@/components/molecules/create-card/create-card';
import { Service, Trigger, Action } from '@/types/type';
import { useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useApi } from '@/context/ApiContext';
import { useZapCreation } from '@/context/ZapCreationContext';


export default function CreateScreen() {
  console.log('(CREATE)');

  const { triggerId, serviceTriggerId } = useLocalSearchParams<{ triggerId?: string; serviceTriggerId?: string }>();
  const { actionId, serviceActionId, zapId: zapIdParam, fromStepId, actionFormData } = useLocalSearchParams<{ 
    actionId?: string; 
    serviceActionId?: string;
    zapId?: string;
    fromStepId?: string;
    actionFormData?: string;
  }>();

  // Use context for persistent state
  const {
    serviceTrigger,
    setServiceTrigger,
    trigger,
    setTrigger,
    actions,
    addAction,
    triggerConnection,
    setTriggerConnection,
    zapId,
    setZapId,
    resetAll,
  } = useZapCreation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [lastProcessedActionParams, setLastProcessedActionParams] = useState<string>('');
  const router = useRouter();
  const { user, sessionToken } = useAuth();

  const { apiUrl } = useApi();

  // Sync zapId from URL params to context
  useEffect(() => {
    if (zapIdParam && zapIdParam !== zapId) {
      setZapId(zapIdParam);
      console.log('[Create] ZapId synced from params:', zapIdParam);
    }
  }, [zapIdParam]);

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

  // Fetch service and action from backend and add to actions array
  useEffect(() => {
    const fetchServiceAndAction = async () => {
      if (!serviceActionId || !actionId) return;
      
      // Create a unique key for this navigation to detect if we already processed these exact params
      const paramsKey = `${actionId}-${serviceActionId}-${actionFormData}-${fromStepId}`;
      if (paramsKey === lastProcessedActionParams) {
        console.log('[Create] Skipping duplicate action params:', paramsKey);
        return;
      }
      
      try {
        const serviceRes = await fetch(`${apiUrl}/services/${serviceActionId}`);
        if (!serviceRes.ok) throw new Error('Service not found');
        const serviceData: Service = await serviceRes.json();
        
        // Fetch action details
        const actionRes = await fetch(`${apiUrl}/services/${serviceActionId}/actions/${actionId}`);
        if (!actionRes.ok) throw new Error('Action not found');
        const actionData: Action = await actionRes.json();
        
        // Fetch connection for this service
        let connection = null;
        if (sessionToken) {
          try {
            const connRes = await axios.get(`${apiUrl}/users/me/connections/service/${serviceActionId}`, {
              headers: { Authorization: `Bearer ${sessionToken}` },
            });
            connection = connRes.data.connections?.[0] || null;
          } catch (err) {
            connection = null;
          }
        }
        
        // Generate unique ID for this action instance
        const uniqueId = `${actionData.id}-${Date.now()}`;
        
        console.log('[Create] Adding new action to array:', {
          actionId: actionData.id,
          uniqueId,
          currentArrayLength: actions.length
        });
        
        // Add the new action using context
        addAction({
          service: serviceData,
          action: actionData,
          connection,
          formData: actionFormData,
          fromStepId: fromStepId,
          uniqueId,
        });
        
        // Mark these params as processed
        setLastProcessedActionParams(paramsKey);
      } catch (err) {
        console.error('Error fetching action:', err);
      }
    };
    fetchServiceAndAction();
  }, [serviceActionId, actionId, apiUrl, sessionToken, actionFormData, fromStepId]);

  // Fetch connections for trigger service only (action connections are fetched when adding actions)
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
    };
    fetchConnections();
  }, [serviceTriggerId, sessionToken, apiUrl]);

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
                resetAll();
              },
            },
          ]);
          return true;
        }
        return false;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => backHandler.remove();
    }, [serviceTrigger, trigger, actions])
  );

  // Helper: get accountIdentifier (for demo, just use user.email or prompt user)
  const accountIdentifier = user?.email || 'demo@area.com';

  const handleFinish = async () => {
    if (!trigger || actions.length === 0) return;
    if (!triggerConnection) {
      setError('You must connect your trigger service account before creating a zap.');
      return;
    }
    
    // Check all actions have connections
    const missingConnections = actions.filter(a => !a.connection);
    if (missingConnections.length > 0) {
      setError('All actions must have connected accounts.');
      return;
    }
    
    console.log('[Finish] Button pressed');
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const authHeaders = sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {};
      
      // Use the existing zapId if provided, otherwise create a new zap
      let currentZapId: number;
      let triggerStepId: number | undefined;
      
      if (zapId) {
        // Zap already created in trigger fields page, reuse it
        currentZapId = Number(zapId);
        console.log('[Finish] Using existing zap with id:', currentZapId);
        
        // Build zap name with all actions
        const actionNames = actions.map(a => a.action.name).join(', ');
        const zapName = `Zap: ${trigger.name} -> ${actionNames}`;
        
        // Update the zap name to include all actions
        try {
          await axios.put(`${apiUrl}/zaps/${currentZapId}`, {
            name: zapName,
          }, { headers: authHeaders });
          console.log('[Finish] Updated zap name');
        } catch (err) {
          console.warn('[Finish] Failed to update zap name:', err);
        }
        
        // Get the trigger step ID from the existing zap
        try {
          const triggerRes = await axios.get(`${apiUrl}/zaps/${currentZapId}/trigger`, { headers: authHeaders });
          triggerStepId = triggerRes.data?.id; // The API returns StepDTO directly with id property
          console.log('[Finish] Found existing trigger step with id:', triggerStepId);
        } catch (err) {
          console.warn('[Finish] Failed to get trigger step:', err);
        }
      } else {
        // No zapId provided, create a new zap (fallback for old flow)
        console.log('[Finish] Creating new zap...');
        const actionNames = actions.map(a => a.action.name).join(', ');
        const zapPayload = {
          name: `Zap: ${trigger.name} -> ${actionNames}`,
          description: `Auto-created zap from mobile UI`,
        };
        console.log('[Finish] Zap payload:', zapPayload);
        const zapRes = await axios.post(`${apiUrl}/zaps`, zapPayload, { headers: authHeaders });
        currentZapId = zapRes.data.id;
        console.log('[Finish] Zap created with id:', currentZapId);
        
        // Create the trigger step
        const triggerPayload = {
          triggerId: trigger.id,
          accountIdentifier: triggerConnection.account_identifier,
          payload: {},
        };
        console.log('[Finish] Trigger step payload:', triggerPayload);
        const triggerStepRes = await axios.post(`${apiUrl}/zaps/${currentZapId}/trigger`, triggerPayload, { headers: authHeaders });
        console.log('[Finish] Trigger step response:', triggerStepRes.data);
        triggerStepId = triggerStepRes.data?.id;
      }
      
      // Create all action steps
      let previousStepId = triggerStepId;
      for (let i = 0; i < actions.length; i++) {
        const actionItem = actions[i];
        
        // Parse form data if provided
        let actionPayloadData = {};
        if (actionItem.formData) {
          try {
            actionPayloadData = JSON.parse(actionItem.formData);
          } catch (e) {
            console.warn(`Failed to parse action ${i} form data:`, e);
          }
        }
        
        // Use provided fromStepId or default to previous step
        const sourceStepId = actionItem.fromStepId ? Number(actionItem.fromStepId) : previousStepId || 1;
        
        const actionPayload = {
          actionId: actionItem.action.id,
          fromStepId: sourceStepId,
          stepOrder: i + 1,
          accountIdentifier: actionItem.connection.account_identifier,
          payload: actionPayloadData,
        };
        console.log(`[Finish] Action ${i + 1} step payload:`, actionPayload);
        const actionStepRes = await axios.post(`${apiUrl}/zaps/${currentZapId}/action`, actionPayload, { headers: authHeaders });
        console.log(`[Finish] Action ${i + 1} step response:`, actionStepRes.data);
        
        // Fetch all actions to get the newly created step's ID
        try {
          const actionsRes = await axios.get(`${apiUrl}/zaps/${currentZapId}/actions`, { headers: authHeaders });
          const allActions = actionsRes.data;
          console.log(`[Finish] All actions after creating action ${i + 1}:`, allActions);
          
          // Find the action with the highest step_order (the one we just created)
          const latestAction = allActions
            .filter((step: any) => step.step_type === 'ACTION')
            .sort((a: any, b: any) => b.step_order - a.step_order)[0];
          
          if (latestAction) {
            previousStepId = latestAction.id;
            console.log(`[Finish] Updated previousStepId to:`, previousStepId);
          }
        } catch (err) {
          console.warn(`[Finish] Failed to fetch actions for step ID:`, err);
          // Fallback: try to use the response data
          previousStepId = actionStepRes.data?.step_id || actionStepRes.data?.id || previousStepId;
        }
      }
      
      setSuccess(true);
      
      // Clear the state to allow creating new zaps
      resetAll();
      
      // Navigate to My Applets page after a short delay
      setTimeout(() => {
        router.replace('/(tabs)/my-applets');
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

  const handleAddMoreActions = () => {
    if (!trigger || !serviceTrigger || !zapId) return;
    
    router.push({
      pathname: "/select-action-service",
      params: {
        triggerId: trigger.id,
        serviceTriggerId: serviceTrigger.id,
        zapId: zapId,
      },
    });
  };

  if (actions.length > 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          <View style={styles.container}>
            <Text style={styles.title}>Create</Text>
            <View>
              <CreateCard
                serviceTrigger={serviceTrigger}
                trigger={trigger}
                actions={actions}
                onAddMoreActions={handleAddMoreActions}
              />
            </View>
            <View>
              <TouchableOpacity style={styles.connectButton}
                onPress={handleFinish}
                disabled={loading}
              >
                <Text style={styles.connectButtonText}>{loading ? 'Creating...' : 'Finish'}</Text>
              </TouchableOpacity>
              {error && <Text style={styles.errorText}>{error}</Text>}
              {success && <Text style={styles.successText}>Zap created!</Text>}
            </View>
          </View>
        </ScrollView>
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
              actions={actions}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
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
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  successText: {
    color: 'green',
    marginTop: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
