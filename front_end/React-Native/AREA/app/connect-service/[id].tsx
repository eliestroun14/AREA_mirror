import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import * as WebBrowser from 'expo-web-browser';
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from 'react';
import { Service } from "@/types/type";
import { Stack } from 'expo-router';
import { imageMap } from "@/types/image";
import { useAuth } from "@/context/AuthContext";


type Props = {}

const ConnectService = (props: Props) => {
  console.log('(CONNECT SERVICE)');

  const {id} = useLocalSearchParams();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const { sessionToken } = useAuth();

  useEffect(() => {
    getServiceDetails();
  }, [id]);

  const getServiceDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/services/${id}`);
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

  const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  const handleConnect = async () => {
    if (!service || !service.name) {
      console.log('[Connect] No service or service name');
      return;
    }
    try {
      const oauthUrl = `${apiUrl}/oauth2/${service.name.toLowerCase()}`;
      console.log('[Connect] Requesting OAuth2 URL:', oauthUrl, 'with sessionToken:', sessionToken);
      const res = await fetch(oauthUrl, {
        method: 'GET',
        headers: {
          Authorization: `${sessionToken}`,
        },
      });
      console.log('[Connect] Response status:', res.status);
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const text = await res.text();
        console.log('[Connect] Raw response text:', text);
        let data;
        try {
          data = JSON.parse(text);
        } catch (parseErr) {
          console.log('[Connect] Failed to parse JSON:', parseErr);
          alert('Backend did not return valid JSON.');
          return;
        }
        if (data.url) {
          console.log('[Connect] Opening OAuth2 URL in-app:', data.url);
          await WebBrowser.openAuthSessionAsync(data.url);
        } else {
          alert('No OAuth2 URL returned by backend.');
          console.log('[Connect] No url in backend response:', data);
        }
      } else {
        // If not JSON, assume it's an HTML page and open the URL directly in-app
        console.log('[Connect] Non-JSON response, opening URL in-app:', oauthUrl);
        await WebBrowser.openAuthSessionAsync(oauthUrl);
      }
    } catch (err) {
      alert('Failed to start OAuth2 flow.');
      console.log('[Connect] OAuth2 connect error:', err);
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

  if (!sessionToken) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'red', textAlign: 'center', marginTop: 30 }}>
          You must be logged in to connect this service.
        </Text>
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
        {
        <View style={{ flex: 1, backgroundColor: "#e8ecf4"}}>
          <View style={[styles.header, {backgroundColor: service.services_color}]}>
            <Image
              style={styles.appLogo}
              source={imageMap[service.id] ?? imageMap["default"]}
            />

            <Text style={styles.serviceName}>
              {service.name}
            </Text>

            <Text style={styles.serviceDescription}>
              {service.documentation_url}
            </Text>

            <TouchableOpacity style={styles.connectButton}
              onPress={handleConnect}
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
