import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from 'react';
import { Service, Trigger } from "@/types/type";
import db from "../../data/db.json"
import { Stack } from 'expo-router';
import { imageMap } from "@/types/image";
import ActionFieldCard from "@/components/molecules/action-field-card/action-field-card";
import { TriggerField } from "@/types/type";
import { router } from "expo-router";

type Props = {}

const ActionFieldsPage = (props: Props) => {

  const { serviceId, actionId } = useLocalSearchParams();
  const [service, setService] = useState<Service | null>(null);
  const [action, setAction] = useState<Trigger | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServiceDetails();
  }, [serviceId, actionId]);

  const getServiceDetails = () => {
    setLoading(true);

  const foundService = db.services.find(s => s.id === serviceId);
  if (foundService) {
    const foundAction = foundService.triggers.find(t => t.id === actionId);
    if (foundAction) {
      setService(foundService);
      setAction(foundAction);
      console.log("Action fields:", foundAction.fields);
    } else
        console.log("Action not found:", actionId);
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
                router.push({pathname: "/(tabs)/create",
                  params: {actionId: action.id, serviceId: service.id}}
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
