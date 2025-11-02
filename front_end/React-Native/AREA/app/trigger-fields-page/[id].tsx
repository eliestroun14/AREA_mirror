import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from 'react';
import { Service, Trigger } from "@/types/type";
import { Stack } from 'expo-router';
import { imageMap } from "@/types/image";
import { getServiceImageSource } from "@/utils/serviceImageUtils";
import TriggerFieldCard from "@/components/molecules/trigger-field-card/trigger-field-card";
import { TriggerField } from "@/types/type";
import { router } from "expo-router";
import { useApi } from "@/context/ApiContext";
import { useAuth } from "@/context/AuthContext";
import { useZapCreation } from "@/context/ZapCreationContext";
import axios from "axios";

type Props = {}

const TriggerFieldsPage = (props: Props) => {

  const { id, triggerId, serviceTriggerId } = useLocalSearchParams<{
    id?: string;
    triggerId?: string;
    serviceTriggerId?: string;
  }>();
  
  const [service, setService] = useState<Service | null>(null);
  const [trigger, setTrigger] = useState<Trigger | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [connection, setConnection] = useState<any>(null);

  const { apiUrl } = useApi();
  const { sessionToken, user } = useAuth();
  const { setZapId } = useZapCreation();

  useEffect(() => {
    const fetchServiceAndTrigger = async () => {
      setLoading(true);
      try {
        if (!serviceTriggerId || !triggerId) {
          setService(null);
          setTrigger(null);
          setLoading(false);
          return;
        }
        // Fetch service
        const serviceRes = await fetch(`${apiUrl}/services/${serviceTriggerId}`);
        if (!serviceRes.ok) throw new Error('Service not found');
        const serviceData: Service = await serviceRes.json();
        setService(serviceData);
        // Fetch trigger
        const triggerRes = await fetch(`${apiUrl}/services/${serviceTriggerId}/triggers/${triggerId}`);
        if (!triggerRes.ok) throw new Error('Trigger not found');
        const triggerData: Trigger = await triggerRes.json();
        setTrigger(triggerData);
        
        // Fetch user connection for this service
        if (sessionToken) {
          try {
            const connRes = await axios.get(`${apiUrl}/users/me/connections/service/${serviceTriggerId}`, {
              headers: { Authorization: `Bearer ${sessionToken}` },
            });
            setConnection(connRes.data.connections?.[0] || null);
          } catch (err) {
            setConnection(null);
          }
        }
      } catch (err) {
        setService(null);
        setTrigger(null);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceAndTrigger();
  }, [serviceTriggerId, triggerId, apiUrl, sessionToken]);

  const handleContinue = async () => {
    if (!trigger || !service || !connection) {
      Alert.alert('Error', 'Missing trigger, service, or connection information');
      return;
    }

    setCreating(true);
    try {
      const authHeaders = sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {};
      
      // Create the zap
      const zapPayload = {
        name: `Zap: ${trigger.name}`,
        description: `Auto-created zap from mobile UI`,
      };
      const zapRes = await axios.post(`${apiUrl}/zaps`, zapPayload, { headers: authHeaders });
      const zapId = zapRes.data.id;
      
      // Save zapId to context for persistence
      setZapId(zapId.toString());
      
      const triggerPayload = {
        triggerId: trigger.id,
        accountIdentifier: connection.account_identifier,
        payload: {},
      };
      await axios.post(`${apiUrl}/zaps/${zapId}/trigger`, triggerPayload, { headers: authHeaders });
      
      // Navigate to action selection with zapId
      router.push({
        pathname: "/select-action-service",
        params: {
          triggerId: trigger.id,
          serviceTriggerId: service.id,
          zapId: zapId.toString()
        }
      });
    } catch (err: any) {
      console.error('[TriggerFields] Error creating zap:', err);
      Alert.alert('Error', err.response?.data?.message || 'Failed to create zap. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!service || !trigger) {
    return (
      <View style={styles.container}>
        <Text>Service or trigger not found.</Text>
      </View>
    );
  }

  const fieldsArray = Object.entries(trigger.fields).map(([key, field]) => ({
    fieldId: key, // Use fieldId to avoid conflict
    ...(field as TriggerField)
  }));

  return (
    <>
      <Stack.Screen
          options={{
            title: "Complete trigger fields",
            headerStyle: {
              backgroundColor: service.services_color,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <View style={{ flex: 1, backgroundColor: "#e8ecf4"}}>
          <ScrollView 
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 200 }}
          >
            <View style={[styles.header, {backgroundColor: service.services_color}]}>
              <Image
                style={styles.appLogo}
                source={getServiceImageSource(service)}
              />

              <Text style={styles.triggerName}>
                {trigger.name}
              </Text>

              <Text style={styles.triggerDescription}>
                {trigger.description}
              </Text>
            </View>

            <View style={styles.fieldsContainer}>
              {fieldsArray.map((item) => (
                <TriggerFieldCard 
                  key={item.fieldId} 
                  item={{...item, id: item.fieldId}} 
                />
              ))}
            </View>

            <TouchableOpacity 
              style={[styles.connectButton, creating && styles.connectButtonDisabled]}
              onPress={handleContinue}
              disabled={creating || !connection}
            >
              {creating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.connectButtonText}>
                  Continue
                </Text>
              )}
            </TouchableOpacity>
            
            {!connection && (
              <Text style={styles.warningText}>
                Please connect your account first
              </Text>
            )}
          </ScrollView>
        </View>
    </>
  )
}

export default TriggerFieldsPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  header: {
    paddingTop: 30,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  appLogo: {
    width: 80,
    height: 80,
    marginTop: 20,
  },

  triggerName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#fff',
    textAlign: 'center',
  },

  triggerDescription: {
    fontSize: 16,
    lineHeight: 22,
    color: '#fff',
    maxWidth: 320,
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '500',
  },

  fieldsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  connectButton: {
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 32,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },

  connectButtonDisabled: {
    opacity: 0.5,
  },

  connectButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },

  warningText: {
    textAlign: 'center',
    color: '#ff4444',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
    paddingHorizontal: 20,
  },

  content: {
    alignSelf: "center"
  },

})
