import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import axios from 'axios'
import { useEffect, useState } from 'react';
import { Service, AppletsCard } from "@/types/type";
import db from "../../data/db.json"
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from 'expo-router';
import { imageMap } from "@/types/image";
import AppletCard from "@/components/molecules/applets-card/applets-card";


type Props = {}

const ServiceCreateDetails = (props: Props) => {

  const {id} = useLocalSearchParams();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  const [applets, setApplets] = useState<AppletsCard[]>([]);

  useEffect(() => {
    setApplets(db.appletsCard);
  }, []);

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
            title: "",
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
              data={applets}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({item}) => <AppletCard item={item}/>}
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

                  <TouchableOpacity style={styles.connectButton}
                    // onPress={() => {

                    // }}
                    >
                    <Text style={styles.connectButtonText}>
                      Connect
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            >
          </FlatList>
        </View>
        }
    </>
  )
}

export default ServiceCreateDetails

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

  connectButton: {
    width: 180,
    height: 80,
    backgroundColor: "#fff",
    borderRadius: 100,
    alignSelf: "center",
    marginTop: 20,
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
