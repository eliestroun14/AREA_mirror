import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, BackHandler } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from 'react';
import { Service } from "@/types/type";
import { Stack } from 'expo-router';
import { getServiceImageSource } from "@/utils/serviceImageUtils";
import { useAuth } from "@/context/AuthContext";
import { useAuthRequest, makeRedirectUri, ResponseType } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useRouter, useNavigation } from "expo-router";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from "react";
import { useApi } from "@/context/ApiContext";

// const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

// Get service slug from the service object (now using dynamic slug from backend)
const getServiceSlug = (service: Service | null): string => {
  return service?.slug || '';
};

type Props = {}

const ConnectService = (props: Props) => {
  console.log('(CONNECT SERVICE)');

  const {id} = useLocalSearchParams();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const { sessionToken } = useAuth();
  const redirectUri = makeRedirectUri();
  // const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  const { apiUrl } = useApi();
  

  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Code,
      clientId: getServiceSlug(service),
      redirectUri,
    },
    { authorizationEndpoint: `${apiUrl}/oauth2/${getServiceSlug(service)}` }
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
          console.log('POST URL:', `${apiUrl}/oauth2/${getServiceSlug(service)}`);
          console.log('POST body:', { code: response.params.code, redirect_uri: redirectUri });
          const res = await fetch(`${apiUrl}/oauth2/${getServiceSlug(service)}`,
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
      console.log('Starting OAuth flow for service:', getServiceSlug(service));
      console.log('Session token:', sessionToken);
      
      if (!sessionToken) {
        Alert.alert('Error', 'No authentication token found. Please login again.');
        return;
      }

      // Step 1: Encrypt the token for OAuth2
      console.log('Step 1: Encrypting token...');
      const encryptResponse = await fetch(`${apiUrl}/oauth2/encrypt-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          platform: 'mobile',
        }),
      });

      if (!encryptResponse.ok) {
        const errorText = await encryptResponse.text();
        console.error('Failed to encrypt token:', errorText);
        Alert.alert('Error', 'Failed to prepare authentication. Please try again.');
        return;
      }

      const { encryptedToken } = await encryptResponse.json();
      console.log('Token encrypted successfully');

      // Step 2: Build OAuth URL with encrypted token
      const oauthUrl = `${apiUrl}/oauth2/${getServiceSlug(service)}?token=${encodeURIComponent(encryptedToken)}`;
      console.log('OAuth URL:', oauthUrl);

      // Step 3: Open OAuth in WebBrowser
      console.log('Opening OAuth session...');
      const result = await WebBrowser.openAuthSessionAsync(oauthUrl, redirectUri);
      console.log('WebBrowser result:', result);

      if (result.type === 'success') {
        console.log('OAuth success result:', result);
        Alert.alert('Success', 'Service connected successfully!');
        // Navigate back to refresh the connection status
        router.back();
      } else if (result.type === 'cancel') {
        console.log('User cancelled OAuth flow');
      } else {
        console.log('OAuth flow result:', result);
      }

    } catch (error) {
      console.error('OAuth error:', error);
      Alert.alert('Error', 'Failed to connect service. Please check your connection and try again.');
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
            source={getServiceImageSource(service)}
          />
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.serviceDescription}>{service.documentation_url}</Text>
          <TouchableOpacity style={styles.connectButton}
            onPress={handleOAuth}
            disabled={!request || !sessionToken}
          >
            <Text style={styles.connectButtonText}>Connect</Text>
          </TouchableOpacity>
          <Text style={styles.textWarning}>
            You must connect your account to this service before creating an action.
          </Text>
          {!sessionToken && (
            <Text style={styles.textWarning}>
              Please log in to link this service..
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
    width: 120,
    height: 120,
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

  textWarning: {
    fontSize: 16,
    lineHeight: 20,
    color: '#d40000ff',
    alignSelf: "center",
    maxWidth: 300,
    marginTop: 10,
    textAlign: "center",
    fontWeight: "500",
  },

})
