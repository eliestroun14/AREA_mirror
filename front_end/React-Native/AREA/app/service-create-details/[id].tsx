import { StyleSheet, Text, View, Image, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from 'react';
import { Service, Trigger } from "@/types/type";
import { Stack } from 'expo-router';
import { imageMap } from "@/types/image";
import TriggerCard from "@/components/molecules/trigger-card/trigger-card";
import axios from "axios";

const ServiceCreateDetails = () => {
  console.log('(SERVICE CREATE DETAILS)');
  const { id } = useLocalSearchParams();
  console.log('[ServiceCreateDetails] useLocalSearchParams id:', id);
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchServiceAndTriggers = async () => {
      setLoading(true);
      try {
        console.log('[ServiceCreateDetails] Fetching service:', `${apiUrl}/services/${id}`);
        const serviceRes = await axios.get(`${apiUrl}/services/${id}`);
        console.log('[ServiceCreateDetails] Service API response:', serviceRes.data);
        setService(serviceRes.data);
        console.log('[ServiceCreateDetails] Fetching triggers:', `${apiUrl}/services/${id}/triggers`);
        const triggersRes = await axios.get(`${apiUrl}/services/${id}/triggers`);
        console.log('[ServiceCreateDetails] Triggers API response:', triggersRes.data);
        setTriggers(triggersRes.data);
      } catch (err) {
        console.log('[ServiceCreateDetails] Error fetching service or triggers:', err);
        setService(null);
        setTriggers([]);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchServiceAndTriggers();
  }, [id, apiUrl]);

  console.log('[ServiceCreateDetails] Render: loading:', loading, 'service:', service, 'triggers:', triggers);

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
  );
}

export default ServiceCreateDetails;

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
