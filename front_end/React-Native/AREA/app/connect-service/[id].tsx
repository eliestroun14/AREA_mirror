import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, BackHandler } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from 'react';
import { Service } from "@/types/type";
import { Stack } from 'expo-router';
import { imageMap } from "@/types/image";
import { useAuth } from "@/context/AuthContext";
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useRouter, useNavigation } from "expo-router";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from "react";
import { useApi } from "@/context/ApiContext";
import * as Linking from 'expo-linking';

// const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;


type Props = {}

const ConnectService = (props: Props) => {
  console.log('(CONNECT SERVICE)');

  const {id} = useLocalSearchParams();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const { sessionToken } = useAuth();
  
  // Use the custom redirect URI that matches your backend configuration (updated to double dashes)
  const redirectUri = "area://--/oauth/success";
  // Also get what Expo would generate for comparison
  const expoRedirectUri = makeRedirectUri();
  
  console.log('Custom redirect URI:', redirectUri);
  console.log('Expo generated redirect URI:', expoRedirectUri);

  const { apiUrl } = useApi();


  useEffect(() => {
    getServiceDetails();
  }, [id]);

  // Add deep link listener for OAuth success (as backup)
  useEffect(() => {
    console.log('Setting up deep link listener as backup...');
    
    const handleDeepLink = (event: any) => {
      console.log('Deep link received:', event.url);
      
      if (event.url && event.url.startsWith('area://--/oauth/success')) {
        console.log('OAuth success deep link detected (backup mechanism)!');
        setTimeout(async () => {
          console.log('Checking connection status after deep link...');
          await checkConnectionStatus();
        }, 1000);
      } else {
        console.log('Other deep link received:', event.url);
      }
    };    const subscription = Linking.addEventListener('url', handleDeepLink);
    
    // Check if app was opened via deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('App opened with initial URL:', url);
        handleDeepLink({ url });
      }
    });

    return () => {
      console.log('Removing deep link listener...');
      subscription.remove();
    };
  }, [service]); // Depend on service so we can check the right connection

  const getServiceDetails = async () => {
    setLoading(true);
    try {
      const cleanApiUrl = apiUrl?.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
      const res = await fetch(`${cleanApiUrl}/services/${id}`);
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

  const exchangeCodeForToken = async (code: string) => {
    try {
      console.log('--- EXCHANGING CODE FOR TOKEN ---');
      console.log('sessionToken:', sessionToken);
      const cleanApiUrl = apiUrl?.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
      const postUrl = `${cleanApiUrl}/oauth2/${service?.name?.toLowerCase()}/callback`;
      console.log('POST URL:', postUrl);
      console.log('POST body:', { code, redirect_uri: redirectUri });
      
      const res = await fetch(postUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ 
          code, 
          redirect_uri: redirectUri 
        }),
      });
      
      console.log('Raw response:', res);
      const result = await res.json();
      console.log('Parsed response:', result);
      
      if (res.ok) {
        Alert.alert('Success!', 'Service connected successfully!');
        console.log('OAuth backend result:', result);
        // Navigate back or to success page
        // router.back();
      } else {
        Alert.alert('Error', 'Failed to connect service.');
        console.log('OAuth backend error:', result);
      }
    } catch (e) {
      Alert.alert('Network Error', 'Failed to connect to service.');
      console.log('Network error:', e);
    }
  };

  const checkConnectionStatus = async () => {
    try {
      console.log('--- CHECKING CONNECTION STATUS ---');
      const cleanApiUrl = apiUrl?.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
      
      // Check if user has a connection for this service
      const res = await fetch(`${cleanApiUrl}/users/me/connections`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
        },
      });
      
      console.log('Connection check response status:', res.status);
      
      if (res.ok) {
        const response = await res.json();
        console.log('User connections response:', response);
        console.log('Looking for service name:', service?.name);
        
        // Check if the service is in the connections
        const hasConnection = response.connections?.some((conn: any) => {
          console.log('Checking connection:', conn.service_name, 'against', service?.name);
          return conn.service_name === service?.name;
        });
        
        console.log('Has connection:', hasConnection);
        
        if (hasConnection) {
          Alert.alert('Success!', 'Service connected successfully!');
          console.log('Service connection found!');
          return true;
        } else {
          console.log('No matching connection found in response');
        }
      } else {
        console.log('Failed to fetch connections:', res.status, res.statusText);
      }
      
      console.log('No connection found, OAuth might have failed');
      Alert.alert('OAuth Status', 'Please try connecting again or check if the connection was successful.');
      return false;
    } catch (e) {
      console.log('Error checking connection status:', e);
      Alert.alert('OAuth Status', 'Could not verify connection status. Please check manually.');
      return false;
    }
  };


  const handleOAuth = async () => {
    try {
      // Step 1: Get encrypted token
      console.log('Step 1: Getting encrypted token...');
      const cleanApiUrl = apiUrl?.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
      const encryptResponse = await fetch(`${cleanApiUrl}/oauth2/encrypt-token`, {
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
        throw new Error('Failed to get encrypted token');
      }

      const encryptData = await encryptResponse.json();
      console.log('Encrypted token response:', encryptData);
      
      if (!encryptData.encryptedToken) {
        throw new Error('No encrypted token received');
      }

      // Step 2: Use encrypted token to get OAuth URL
      console.log('Step 2: Using encrypted token to get OAuth URL...');
      const oauth2Slug = service?.name?.toLowerCase();
      // Ensure no double slashes in URL
      const cleanApiUrl2 = apiUrl?.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
      // Don't send redirect_uri - backend already knows to use area://oauth/success for mobile
      const url = `${cleanApiUrl2}/oauth2/${oauth2Slug}?token=${encodeURIComponent(encryptData.encryptedToken)}`;
      console.log('OAuth GET URL:', url);
      console.log('Backend will use MOBILE_SUCCESS_OAUTH2_REDIRECT_URL for final redirect');
      console.log('Expected OAuth flow:');
      console.log('1. Backend will redirect to Discord OAuth with backend callback');
      console.log('2. Discord will redirect to backend callback');
      console.log('3. Backend will process and redirect to area://--/oauth/success');
      console.log('4. WebBrowser should catch the area://--/oauth/success redirect');
      
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        redirect: 'manual',
      });

      let redirect = res.headers.get('Location');
      console.log('Redirection Location:', redirect);
      console.log('Response status:', res.status);
      console.log('Response URL:', res.url);
      
      // Handle different types of redirects
      if (!redirect) {
        // Check if response is a redirect status code
        if (res.status >= 300 && res.status < 400) {
          redirect = res.url;
          console.log('Using response URL as redirect:', redirect);
        } else {
          // Try to parse as JSON only if it's not a redirect
          try {
            const data = await res.json();
            console.log('Response body:', data);
            redirect = data.redirect || data.url || null;
          } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Unknown error';
            console.log('Response is not JSON (likely HTML redirect):', errorMessage);
            // If res.url is different from the original URL, it's likely a redirect
            if (res.url && res.url !== url && res.url.startsWith('http')) {
              redirect = res.url;
              console.log('Using final URL as redirect:', redirect);
            }
          }
        }
      }
      
      if (redirect) {
        console.log('Opening OAuth session with URL:', redirect);
        console.log('Backend redirect URI (from OAuth URL):', redirect.includes('redirect_uri=') ? decodeURIComponent(redirect.split('redirect_uri=')[1].split('&')[0]) : 'Not found');
        console.log('Custom redirect URI we want:', redirectUri);
        console.log('Expo redirect URI for comparison:', expoRedirectUri);
        
        console.log('--- CORRECTED APPROACH ---');
        console.log('Backend already knows mobile redirect URI: area://--/oauth/success');
        console.log('We need to use WebBrowser.openAuthSessionAsync with area://--/oauth/success');
        console.log('This should match the backend flow and catch the redirect properly');
        
        console.log('--- ENHANCED DEBUG ---');
        console.log('About to call WebBrowser.openAuthSessionAsync with:');
        console.log('  authUrl:', redirect);
        console.log('  returnUrl:', redirectUri);
        
        console.log('--- IMPORTANT UNDERSTANDING ---');
        console.log('Discord will redirect to backend callback URL first:');
        console.log('  Backend callback: https://api.manech.va.sauver.le.monde.area.projects.epitech.bzh/oauth2/discord/callback');
        console.log('Then backend will redirect to our mobile URL:');
        console.log('  Final mobile redirect: area://--/oauth/success');
        console.log('WebBrowser needs to follow this full redirect chain!');
        
        // Set up linking listener to catch the final mobile redirect
        let linkingSubscription: any = null;
        
        const setupLinkingListener = () => {
          console.log('Setting up linking listener for final mobile redirect...');
          linkingSubscription = Linking.addEventListener('url', (event) => {
            console.log('Linking listener caught URL:', event.url);
            if (event.url && event.url.startsWith('area://--/oauth/success')) {
              console.log('SUCCESS: Final mobile redirect caught!');
              // Clean up the subscription
              if (linkingSubscription) {
                linkingSubscription.remove();
                linkingSubscription = null;
              }
              // Check connection status
              setTimeout(async () => {
                console.log('Checking connection status after OAuth redirect...');
                await checkConnectionStatus();
              }, 1000);
            }
          });
        };
        
        setupLinkingListener();
        
        // Use openBrowserAsync instead of openAuthSessionAsync to follow the full redirect chain
        console.log('Using openBrowserAsync to follow complete redirect chain...');
        const result = await WebBrowser.openBrowserAsync(redirect, {
          showTitle: false,
          enableBarCollapsing: false,
          // This should follow redirects and eventually hit our custom scheme
        });
        
        console.log('WebBrowser result:', result);
        console.log('WebBrowser result type:', result.type);
        
        // Clean up linking listener if it's still active
        if (linkingSubscription) {
          console.log('Cleaning up linking listener...');
          linkingSubscription.remove();
          linkingSubscription = null;
        }
        
        // Handle the result from WebBrowser
        if (result.type === 'cancel') {
          console.log('OAuth was cancelled by user');
          Alert.alert('OAuth cancelled');
        } else if (result.type === 'dismiss') {
          console.log('Browser was dismissed');
          console.log('This is normal - checking if OAuth completed successfully...');
          setTimeout(async () => {
            await checkConnectionStatus();
          }, 2000);
        } else {
          console.log('WebBrowser result type:', result.type);
          console.log('Full result:', JSON.stringify(result, null, 2));
          
          // For openBrowserAsync, we mainly rely on the linking listener
          // Check connection status as fallback
          setTimeout(async () => {
            await checkConnectionStatus();
          }, 2000);
        }
      } else {
        Alert.alert('Error: No redirection URL found.');
        console.log('Raw response details:', {
          status: res.status,
          statusText: res.statusText,
          url: res.url,
          headers: Object.fromEntries(res.headers.entries())
        });
      }
    } catch (e) {
      Alert.alert('Network error while connecting to the service.');
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
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!service) {
    return (
      <View style={styles.container}>
        <Text>Service not found for ID: {id}</Text>
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
            disabled={!sessionToken || !service}
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
