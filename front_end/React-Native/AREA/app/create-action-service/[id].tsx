import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from 'react';
import { Service, Action } from "@/types/type";
import { Stack } from 'expo-router';
import { imageMap } from "@/types/image";
import ActionCard from "@/components/molecules/action-card/action-card";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useRouter } from "expo-router";


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: -10,
    paddingBottom: 30,
    marginBottom: 10
  },
  appLogo: {
    width: 80,
    height: 80,
    alignSelf: "center",
    marginTop: 30
  },
  serviceName: {
    fontSize: 25,
    fontWeight: 'bold',
    alignSelf: "center",
    marginTop: 10,
    color: '#fff'
  },
  serviceDescription: {
    fontSize: 16,
    lineHeight: 20,
    color: '#fff',
    alignSelf: "center",
    maxWidth: 300,
    marginTop: 10,
    textAlign: "center"
  },
});

type Props = {
  allTriggers: any[];
};

const CreateActionService = ({allTriggers}: Props) => {
  console.log('(CREATE ACTION SERVICE)');

  const { id, triggerId, serviceTriggerId } = useLocalSearchParams<{
    id?: string;
    triggerId?: string;
    serviceTriggerId?: string;
  }>();

  const { isAuthenticated, sessionToken } = useAuth();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [actions, setActions] = useState<Action[]>([]);
  const [connection, setConnection] = useState<any>(null);
  const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  const router = useRouter();

  useEffect(() => {
    const fetchServiceAndActions = async () => {
      setLoading(true);
      try {
        const serviceRes = await fetch(`${apiUrl}/services/${id}`);
        if (!serviceRes.ok) throw new Error('Service not found');
        const serviceData: Service = await serviceRes.json();
        setService(serviceData);
        // Fetch actions for this service
        const actionsRes = await fetch(`${apiUrl}/services/${id}/actions`);
        if (!actionsRes.ok) throw new Error('Actions not found');
        const actionsData: Action[] = await actionsRes.json();
        setActions(actionsData);
        // Fetch user connection for this service
        if (sessionToken) {
          const connRes = await axios.get(`${apiUrl}/users/me/connections/service/${id}`, {
            headers: { Authorization: `Bearer ${sessionToken}` },
          });
          setConnection(connRes.data.connections?.[0] || null);
        }
      } catch (err) {
        setService(null);
        setActions([]);
        setConnection(null);
        console.log('[CreateActionService] Error fetching service or actions:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchServiceAndActions();
  }, [id, apiUrl, sessionToken]);

  useEffect(() => {
    if (!loading && !connection && service && isAuthenticated) {
      router.push(`/connect-service/${id}`);
    }
  }, [loading, connection, service, isAuthenticated, id, router]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!service) {
    return (
      <View style={styles.container}>
        <Text>Service not found for ID: {id}</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'red', textAlign: 'center', marginTop: 30 }}>
          You must be logged in to create an action on this service.
        </Text>
      </View>
    );
  }
  if (!connection) {
    // Show nothing while redirecting
    return null;
  }

  return (
    <>
      <Stack.Screen
          options={{
            title: "Select Action",
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
          <FlatList
              data={actions}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({item}) => <ActionCard
                backgroundColor={service.services_color}
                item={item}
                serviceActionId={service.id.toString()}
                triggerId={triggerId}
                serviceTriggerId={serviceTriggerId}
              />}
              ListHeaderComponent={() => (
                <View style={[styles.header, {backgroundColor: service.services_color}]}> 
                  <Image
                    style={styles.appLogo}
                    source={imageMap[service.name] ?? imageMap["default"]}
                  />
                  <Text style={styles.serviceName}>
                    {service.name}
                  </Text>
                  <Text style={styles.serviceDescription}>
                    {service.documentation_url}
                  </Text>
                </View>
              )}
            />
        </View>
    </>
  )
}

export default CreateActionService;
