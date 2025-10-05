import { StyleSheet, Text, View, Image, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from 'react';
import { Service, Trigger } from "@/types/type";
import db from "../../data/db.json"
import { Stack } from 'expo-router';
import { imageMap } from "@/types/image";
import ActionCard from "@/components/molecules/action-card/action-card";


type Props = {
  allTriggers: Trigger[];
}

const CreateActionService = ({allTriggers}: Props) => {

  const { id, triggerId, serviceTriggerId } = useLocalSearchParams<{
    id?: string;
    triggerId?: string;
    serviceTriggerId?: string;
  }>();


  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [triggers, setTriggers] = useState<Trigger[]>([]);

  useEffect(() => {
    if (service) {
      setTriggers(service.triggers);
    }
  }, [service, allTriggers]);

  useEffect(() => {
    getServiceDetails();
  }, [id]);

  const getServiceDetails = () => {
    setLoading(true);

    const foundService = db.services.find(service => service.id === id || service.id === String(id));

    if (foundService) {
      setService(foundService);
      console.log('Service found :', foundService);
    } else {
      console.log('Service not found for ID in create action service:', id);
      setService(null);
    }
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

  if (!service) {
    return (
      <View style={styles.container}>
        <Text>Service non trouvé pour l'ID: {id}</Text>
      </View>
    );
  }

  // const isAnAction = useLocalSearchParams()

  return (
    <>
      <Stack.Screen
          options={{
            title: "Select Trigger",
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
          <FlatList
              data={triggers}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({item}) => <ActionCard
                backgroundColor={service.backgroundColor}
                item={item}
                serviceActionId={service.id}
                triggerId={triggerId}
                serviceTriggerId={serviceTriggerId}
              />}
              ListHeaderComponent={() => (
                <View style={[styles.header, {backgroundColor: service.backgroundColor}]}>
                  <Image
                    style={styles.appLogo}
                    source={imageMap[service.id] ?? imageMap["default"]}
                  />

                  <Text style={styles.serviceName}>
                    {service.serviceName}
                  </Text>

                  <Text style={styles.serviceDescription}>
                    {service.appDescription}
                  </Text>

                </View>
              )}
            >
          </FlatList>
        </View>
        }
    </>
  )
}

export default CreateActionService

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
})
