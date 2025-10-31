import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from "react-native";
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

type Props = {}

const TriggerFieldsPage = (props: Props) => {
  console.log('(TRIGGER FIELDS PAGE)');

  const { id, triggerId, serviceTriggerId } = useLocalSearchParams<{
    id?: string;
    triggerId?: string;
    serviceTriggerId?: string;
  }>();
  
  const [service, setService] = useState<Service | null>(null);
  const [trigger, setTrigger] = useState<Trigger | null>(null);
  const [loading, setLoading] = useState(true);
  // const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  const { apiUrl } = useApi();

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
      } catch (err) {
        setService(null);
        setTrigger(null);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceAndTrigger();
  }, [serviceTriggerId, triggerId, apiUrl]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (!service || !trigger) {
    return (
      <View style={styles.container}>
        <Text>Service ou trigger non trouvé.</Text>
      </View>
    );
  }

  const fieldsArray = Object.entries(trigger.fields).map(([key, field]) => ({
    id: key,
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
        {
        <View style={{ flex: 1, backgroundColor: "#e8ecf4"}}>
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

            <FlatList
              data={fieldsArray}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TriggerFieldCard item={item} />
              )}
              contentContainerStyle={{ padding: 16 }}
            />

            <TouchableOpacity style={styles.connectButton}
              onPress={() => (
                router.push({pathname: "/(tabs)/create",
                  params: {triggerId: trigger.id, serviceTriggerId: service.id}}
                )
              )}>
              <Text style={styles.connectButtonText}>
                  Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        }
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

  triggerName: {
    fontSize: 25,
    fontWeight: 'bold',
    alignSelf: "center",
    marginTop: 20,
    color: '#fff'
  },

  triggerDescription: {
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
