import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from 'react';
import { Service, Trigger } from "@/types/type";
import db from "../../data/db.json"
import { Stack } from 'expo-router';
import { imageMap } from "@/types/image";
import TriggerCard from "@/components/molecules/trigger-card/trigger-card";


type Props = {}

const ConnectService = (props: Props) => {

  const {id} = useLocalSearchParams();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

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
      console.log('Service not found for ID :', id);
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

  return (
    <>
      <Stack.Screen
          options={{
            title: "Connect Service",
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

            <Text style={styles.serviceName}>
              {service.serviceName}
            </Text>

            <Text style={styles.serviceDescription}>
              {service.appDescription}
            </Text>

            <TouchableOpacity style={styles.connectButton}
              // onPress={() => {

              // }}
              >
              <Text style={styles.connectButtonText}>
                  Connect
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        }
    </>
  )
}

export default ConnectService

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

  serviceName: {
    fontSize: 25,
    fontWeight: 'bold',
    alignSelf: "center",
    marginTop: 70,
    color: '#fff'
  },

  serviceDescription: {
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
