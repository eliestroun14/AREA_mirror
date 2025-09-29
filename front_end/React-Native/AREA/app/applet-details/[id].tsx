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

const AppletDetails = (props: Props) => {

  const {id} = useLocalSearchParams();
  const [applet, setApplet] = useState<AppletsCard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAppletDetails();
  }, [id]);

  const getAppletDetails = () => {
    setLoading(true);

    const foundApplet = db.appletsCard.find(applet => applet.id === Number(id));

    if (foundApplet) {
      setApplet(foundApplet);
      console.log('Applet found :', foundApplet);
    } else {
      console.log('Applet not found for ID :', id);
      setApplet(null);
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

  if (!applet) {
    return (
      <View style={styles.container}>
        <Text>Applet non trouvé pour l'ID: {id}</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
          options={{
            title: "",
            headerStyle: {
              backgroundColor: applet.backgroundColor,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        {
        <View style={{ flex: 1, backgroundColor: "#e8ecf4"}}>
          <View style={[styles.header, {backgroundColor: applet.backgroundColor}]}>
            <Image
            style={styles.appLogo}
            source={imageMap[applet.firstIconId] ?? imageMap["default"]}
            />

            <Text style={styles.appletName}>
            {applet.description}
            </Text>

            <Text style={styles.appletDescription}>
            {applet.description}
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

export default AppletDetails

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

  appletName: {
    fontSize: 30,
    fontWeight: 'bold',
    alignSelf: "center",
    marginTop: 10,
    color: '#fff'
  },

  appletDescription: {
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
