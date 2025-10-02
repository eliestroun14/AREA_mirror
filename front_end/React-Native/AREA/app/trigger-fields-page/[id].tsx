import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from 'react';
import { Service, Trigger } from "@/types/type";
import db from "../../data/db.json"
import { Stack } from 'expo-router';
import { imageMap } from "@/types/image";
import TriggerFieldCard from "@/components/molecules/trigger-field-card/trigger-field-card";
import { TriggerField } from "@/types/type";
import { router } from "expo-router";

type Props = {}

const TriggerFieldsPage = (props: Props) => {

  const { serviceId, triggerId } = useLocalSearchParams();
  const [service, setService] = useState<Service | null>(null);
  const [trigger, setTrigger] = useState<Trigger | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServiceDetails();
  }, [serviceId, triggerId]);

  const getServiceDetails = () => {
    setLoading(true);

  const foundService = db.services.find(s => s.id === serviceId);
  if (foundService) {
    const foundTrigger = foundService.triggers.find(t => t.id === triggerId);
    if (foundTrigger) {
      setService(foundService);
      setTrigger(foundTrigger);
      console.log("Trigger fields:", foundTrigger.fields);
    } else
        console.log("Trigger not found:", triggerId);
  } else
      console.log("Service not found:", serviceId);

  setLoading(false);
};

  //TODO: quand j'aurai le back faudra changer ici !!!!

  // const getProductDetails = async () => {
  //   const URL = `http://localhost:3000/services/${id}`
  //   const response = await axios.get(URL);

  //   console.log('Service details :', response.data);
  // }

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
        <Text>Service ou Trigger non trouvé</Text>
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
              backgroundColor: service.backgroundColor,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        {
        <View style={{ flex: 1, backgroundColor: "#e8ecf4"}}>
          <View style={[styles.header, {backgroundColor: service.backgroundColor}]}>
            <Image
              style={styles.appLogo}
              source={imageMap[service.id] ?? imageMap["default"]}
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
                  params: {triggerId: trigger.id, serviceId: service.id}}
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
