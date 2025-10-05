import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from 'react';
import { Service, Trigger, Action } from "@/types/type";
import axios from 'axios';
import { Stack } from 'expo-router';
import { imageMap } from "@/types/image";

const ServiceExploreDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const serviceRes = await axios.get(`${apiUrl}/services/${id}`);
        setService(serviceRes.data);
        const triggersRes = await axios.get(`${apiUrl}/services/${id}/triggers`);
        console.log('Fetched triggers EXPLORE:', triggersRes.data);
        setTriggers(triggersRes.data);
        const actionsRes = await axios.get(`${apiUrl}/services/${id}/actions`);
        console.log('Fetched actions EXPLORE:', actionsRes.data);
        setActions(actionsRes.data);
      } catch (err) {
        setService(null);
        setTriggers([]);
        setActions([]);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchAll();
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

  return (
    <>
      <Stack.Screen
        options={{
          title: service.name,
          headerStyle: { backgroundColor: service.services_color },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <View style={{ flex: 1, backgroundColor: "#e8ecf4" }}>
        <View style={[styles.header, { backgroundColor: service.services_color }]}> 
          <Image
            style={styles.appLogo}
            source={imageMap[service.name] ?? imageMap["default"]}
          />
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.serviceDescription}>{service.documentation_url}</Text>
        </View>
        <Text style={styles.sectionTitle}>Triggers</Text>
        <FlatList
          data={triggers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.itemCard}
              onPress={() => router.push(`/service-explore-details/${id}/trigger/${item.id}`)}
            >
              <Text style={styles.itemTitle}>{item.name || `Trigger #${item.id}`}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>Aucun trigger trouvé.</Text>}
        />
        <Text style={styles.sectionTitle}>Actions</Text>
        <FlatList
          data={actions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.itemCard}
              onPress={() => router.push(`/service-explore-details/${id}/action/${item.id}`)}
            >
              <Text style={styles.itemTitle}>{item.name || `Action #${item.id}`}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>Aucune action trouvée.</Text>}
        />
      </View>
    </>
  );
};

export default ServiceExploreDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: -10,
    borderRadius: 15,
    paddingBottom: 30,
  },
  appLogo: {
    width: 125,
    height: 125,
    alignSelf: "center",
    marginTop: 30
  },
  serviceName: {
    fontSize: 30,
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
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#222',
    alignSelf: 'flex-start',
    marginLeft: 10
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 10,
    elevation: 2,
  },
  itemTitle: {
    fontSize: 18,
    color: '#222',
    fontWeight: '600',
  },
  emptyText: {
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 10
  }
});
