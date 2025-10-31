import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from 'react';
import { Service, Trigger, Action } from "@/types/type";
import { Stack } from 'expo-router';
import { imageMap } from "@/types/image";
import { getServiceImageSource } from "@/utils/serviceImageUtils";
import ActionFieldCard from "@/components/molecules/action-field-card/action-field-card";
import { TriggerField } from "@/types/type";
import { router } from "expo-router";
import { useApi } from "@/context/ApiContext";

type Props = {}

const ActionFieldsPage = (props: Props) => {
  console.log('(ACTION FIELDS PAGE)');

  const { id, actionId, serviceActionId, triggerId, serviceTriggerId } = useLocalSearchParams<{
    id?: string;
    actionId?: string;
    serviceActionId?: string;
    triggerId?: string;
    serviceTriggerId?: string;
  }>();

  const [service, setService] = useState<Service | null>(null);
  const [action, setAction] = useState<Action | null>(null);
  const [loading, setLoading] = useState(true);
  // const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  const { apiUrl } = useApi();


  useEffect(() => {
    const fetchServiceAndAction = async () => {
      setLoading(true);
      try {
        if (!serviceActionId || !actionId) {
          setService(null);
          setAction(null);
          setLoading(false);
          return;
        }
        // Fetch service
        const serviceRes = await fetch(`${apiUrl}/services/${serviceActionId}`);
        if (!serviceRes.ok) throw new Error('Service not found');
        const serviceData: Service = await serviceRes.json();
        setService(serviceData);
        // Fetch action
        const actionRes = await fetch(`${apiUrl}/services/${serviceActionId}/actions/${actionId}`);
        if (!actionRes.ok) throw new Error('Action not found');
        const actionData: Action = await actionRes.json();
        setAction(actionData);
        console.log('Action fields:', actionData.fields);
      } catch (err) {
        setService(null);
        setAction(null);
        console.log('[ActionFieldsPage] Error fetching service or action:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceAndAction();
  }, [serviceActionId, actionId, apiUrl]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (!service || !action) {
    return (
      <View style={styles.container}>
        <Text>Service ou Action non trouvé</Text>
      </View>
    );
  }

  const fieldsArray = Object.entries(action.fields).map(([key, field]) => ({
    id: key,
    ...(field as TriggerField)
  }));

  return (
    <>
      <Stack.Screen
          options={{
            title: "Complete action fields",
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
          <View style={[styles.header, {backgroundColor: service.services_color}]}> 
            <Image
              style={styles.appLogo}
              source={getServiceImageSource(service)}
            />
            <Text style={styles.actionName}>
              {action.name}
            </Text>
            <Text style={styles.actionDescription}>
              {action.description}
            </Text>
            <FlatList
              data={fieldsArray}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ActionFieldCard item={item} />
              )}
              contentContainerStyle={{ padding: 16 }}
            />
            <TouchableOpacity style={styles.connectButton}
              onPress={() => (
              router.push({
                pathname: "/(tabs)/create",
                params: {
                  actionId: action.id,
                  serviceActionId: service.id,
                  triggerId: triggerId,
                  serviceTriggerId: serviceTriggerId
                }
              })
            )}>
              <Text style={styles.connectButtonText}>
                  Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
    </>
  )
}

export default ActionFieldsPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  header: {
    paddingBottom: 30,
    marginBottom: 10,
    height: "100%"
  },

  appLogo: {
    width: 80,
    height: 80,
    alignSelf: "center",
    marginTop: 70
  },

  actionName: {
    fontSize: 25,
    fontWeight: 'bold',
    alignSelf: "center",
    marginTop: 20,
    color: '#fff'
  },

  actionDescription: {
    fontSize: 16,
    lineHeight: 20,
    color: '#fff',
    alignSelf: "center",
    maxWidth: 300,
    marginTop: 10,
    textAlign: "center",
    fontWeight: "500"
  },

  connectButton: {
  position: 'absolute',
  bottom: 80,
  left: 20,
  right: 20,
  height: 80,
  backgroundColor: "#fff",
  borderRadius: 100,
  alignItems: "center",
  justifyContent: "center",
},

  connectButtonText: {
    fontSize: 25,
    fontWeight: "bold",
  },

  content: {
    alignSelf: "center"
  },

})
