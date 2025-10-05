import { StyleSheet, Text, View, Image, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from 'react';
import { Service, Trigger } from "@/types/type";
import { Stack } from 'expo-router';
import { imageMap } from "@/types/image";
import TriggerCard from "@/components/molecules/trigger-card/trigger-card";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const CreateTriggerService = () => {
  console.log('(CREATE TRIGGER SERVICE)');
  const { id } = useLocalSearchParams();
  const { isAuthenticated } = useAuth();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const getServiceDetails = async () => {
      setLoading(true);
      try {
        const serviceRes = await axios.get(`${apiUrl}/services/${id}`);
        setService(serviceRes.data);
        // Fetch triggers for this service
        const triggersRes = await axios.get(`${apiUrl}/services/${id}/triggers`);
        setTriggers(triggersRes.data);
        console.log('Fetched triggers CREATE:', triggersRes.data);
        console.log('Service details CREATE:', serviceRes.data);
      } catch (err) {
        setService(null);
        setTriggers([]);
        console.log('Service not found for ID in create trigger service:', id);
      } finally {
        setLoading(false);
      }
    };
    if (id) getServiceDetails();
  }, [id, apiUrl]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (!service) {
    return (
      <View style={styles.container}>
        <Text>Service non trouvé pour l'ID: {id}</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'red', textAlign: 'center', marginTop: 30 }}>
          You must be logged in to create a trigger on this service.
        </Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Select Trigger",
          headerStyle: {
            backgroundColor: service.services_color,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <View style={{ flex: 1, backgroundColor: "#e8ecf4" }}>
        <FlatList
          data={triggers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <TriggerCard backgroundColor={service.services_color} item={item} />}
          ListHeaderComponent={() => (
            <View style={[styles.header, { backgroundColor: service.services_color }]}> 
              <Image
                style={styles.appLogo}
                source={imageMap[service.id] ?? imageMap["default"]}
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
  );
}

export default CreateTriggerService;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: -10,
    paddingBottom: 30,
    marginBottom: 10,
  },
  appLogo: {
    width: 80,
    height: 80,
    alignSelf: "center",
    marginTop: 30,
  },
  serviceName: {
    fontSize: 25,
    fontWeight: 'bold',
    alignSelf: "center",
    marginTop: 10,
    color: '#fff',
  },
  serviceDescription: {
    fontSize: 16,
    lineHeight: 20,
    color: '#fff',
    alignSelf: "center",
    maxWidth: 300,
    marginTop: 10,
    textAlign: "center",
  },
});
