import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, BackHandler } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from 'react';
import { Service } from "@/types/type";
import { Stack } from 'expo-router';
import { imageMap } from "@/types/image";
import { useAuth } from "@/context/AuthContext";
import { useAuthRequest, makeRedirectUri, ResponseType } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useRouter, useNavigation } from "expo-router";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from "react";

const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;


type Props = {}

const ConnectService = (props: Props) => {
  console.log('(CONNECT SERVICE)');

  const {id} = useLocalSearchParams();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const { sessionToken } = useAuth();
  const redirectUri = makeRedirectUri();
  const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Code,
      clientId: service?.name?.toLowerCase() || '',
      redirectUri,
    },
    { authorizationEndpoint: `${apiUrl}/oauth2/${service?.name?.toLowerCase()}` }
  );


  useEffect(() => {
    getServiceDetails();
  }, [id]);

  useEffect(() => {
    if (response?.type === 'success' && response.params?.code) {
      const exchangeCode = async () => {
        try {
          console.log('--- OAUTH DEBUG ---');
          console.log('sessionToken:', sessionToken);
          console.log('POST URL:', `${apiUrl}/oauth2/${service?.name?.toLowerCase()}`);
          console.log('POST body:', { code: response.params.code, redirect_uri: redirectUri });
          const res = await fetch(`${apiUrl}/oauth2/${service?.name?.toLowerCase()}`,
            {
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

  const getServiceDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/services/${id}`);
      if (!res.ok) throw new Error('Service not found');
      const data = await res.json();
      setService(data);
      console.log('Service found :', data);
    } catch (err) {
      setService(null);
      console.log('Service not found for ID in connect service:', id);
    }
    setLoading(false);
  };


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
          'Authorization': sessionToken || '', // juste the token, without'Bearer
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

  const router = useRouter();
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        router.replace("/select-trigger-service");
        return true;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );

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
            backgroundColor: service.services_color,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
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
          <TouchableOpacity style={styles.connectButton}
            onPress={handleOAuth}
            disabled={!request || !sessionToken}
          >
            <Text style={styles.connectButtonText}>Connect</Text>
          </TouchableOpacity>
          <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>
            You must connect your account to this service before creating an action.
          </Text>
          {!sessionToken && (
            <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>
              Veuillez vous connecter pour lier ce service.
            </Text>
          )}
        </View>
      </View>
    </>
  );
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
