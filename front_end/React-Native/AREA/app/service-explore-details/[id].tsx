import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from 'react';
import { Service, AppletsCard } from "@/types/type";
import axios from 'axios';
import db from "../../data/db.json"
import { Stack } from 'expo-router';
import { imageMap } from "@/types/image";
import AppletCard from "@/components/molecules/applets-card/applets-card";
import { useAuth } from '@/context/AuthContext';
import { useAuthRequest, makeRedirectUri, ResponseType } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';


const ServiceExploreDetails = () => {
  const {id} = useLocalSearchParams();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [applets, setApplets] = useState<AppletsCard[]>([]);
  const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  const { sessionToken } = useAuth();

  // OAuth request config
  const redirectUri = makeRedirectUri();
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Code,
      clientId: service?.name?.toLowerCase() || '',
      redirectUri,
    },
    { authorizationEndpoint: `${apiUrl}/oauth2/${service?.name?.toLowerCase()}` }
  );

  useEffect(() => {
    if (response?.type === 'success' && response.params?.code) {
      const exchangeCode = async () => {
        try {
          console.log('--- OAUTH DEBUG ---');
          console.log('sessionToken:', sessionToken);
          console.log('POST URL:', `${apiUrl}/oauth2/${service?.name?.toLowerCase()}`);
          console.log('POST body:', { code: response.params.code, redirect_uri: redirectUri });
          const res = await fetch(`${apiUrl}/oauth2/${service?.name?.toLowerCase()}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': sessionToken || '',
            },
            body: JSON.stringify({ code: response.params.code, redirect_uri: redirectUri }),
          });
          console.log('Raw response:', res);
          const result = await res.json();
          console.log('Parsed response:', result);
          if (res.status === 200) {
            Alert.alert('Service connecté !');
            console.log('OAuth backend result:', result);
          } else {
            Alert.alert('Erreur lors de la connexion au service.');
            console.log('OAuth backend error:', result);
          }
        } catch (e) {
          Alert.alert('Erreur réseau lors de la connexion au service.');
          console.log('Network error:', e);
        }
      };
      exchangeCode();
    } else if (response?.type === 'error') {
      Alert.alert('Erreur OAuth');
      console.log('OAuth error:', response);
    }
  }, [response]);

  useEffect(() => {
    setApplets(db.appletsCard);
  }, []);

  useEffect(() => {
    const getServiceDetails = async () => {
      setLoading(true);
      try {
        const URL = `${apiUrl}/services/${id}`;
        const response = await axios.get(URL);
        setService(response.data);
        console.log('Service details:', response.data);
      } catch (err) {
        setService(null);
        console.log('Service not found for ID in service explore details:', id);
      } finally {
        setLoading(false);
      }
    };
    if (id) getServiceDetails();
  }, [id, apiUrl]);

  const handleOAuth = async () => {
    try {
      const url = `${apiUrl}/oauth2/${service?.name?.toLowerCase()}?redirect_uri=${encodeURIComponent(redirectUri)}`;
      console.log('OAuth GET URL:', url);
      console.log('sessionToken (avant requête):', sessionToken);
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': sessionToken || '', // juste le token, sans 'Bearer'
        },
        credentials: 'include',
        redirect: 'manual',
      });
      let redirect = res.headers.get('Location');
      console.log('Redirection Location:', redirect);
      if (!redirect) {
        try {
          const data = await res.json();
          console.log('Redirection body:', data);
          redirect = data.redirect || data.url || null;
        } catch (e) {
          console.log('No JSON body for redirect:', e);
          // Fallback : si le body n'est pas du JSON, try res.url
          if (res.url && res.url.startsWith('http')) {
            redirect = res.url;
            console.log('Fallback redirection via res.url:', redirect);
          }
        }
      }
      if (redirect) {
        const result = await WebBrowser.openAuthSessionAsync(redirect, redirectUri);
        console.log('WebBrowser result:', result);
      } else {
        Alert.alert('Erreur: pas de redirection trouvée.');
        console.log('Réponse brute:', res);
      }
    } catch (e) {
      Alert.alert('Erreur réseau lors de la connexion au service.');
      console.log('Network error:', e);
    }
  };

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
            backgroundColor: service.services_color,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <View style={{ flex: 1, backgroundColor: "#e8ecf4"}}>
        <FlatList
          data={applets.filter(app => app.firstIconId.toLowerCase() === String(service.id).toLowerCase()
            || app.secondeIconId.toLowerCase() === String(service.id).toLowerCase())}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => <AppletCard item={item}/>} 
          ListHeaderComponent={() => (
            <View style={[styles.header, {backgroundColor: service.services_color}]}> 
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
              <TouchableOpacity style={styles.connectButton}
                onPress={handleOAuth}
                disabled={!request || !sessionToken}
              >
                <Text style={styles.connectButtonText}>
                  Connect
                </Text>
              </TouchableOpacity>
              {!sessionToken && (
                <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>
                  Veuillez vous connecter pour lier ce service.
                </Text>
              )}
            </View>
          )}
        />
      </View>
    </>
  )
}

export default ServiceExploreDetails

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
