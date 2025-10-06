import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from 'react';
import { AppletsCard } from "@/types/type";
import { Stack } from 'expo-router';
import { imageMap } from "@/types/image";

type Props = {}

const AppletDetails = (props: Props) => {
  console.log('(APPLET DETAILS)');

  const {id} = useLocalSearchParams();
  const [applet, setApplet] = useState<AppletsCard | null>(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchApplet = async () => {
      setLoading(true);
      try {
        // TODO: Replace with real backend endpoint if available
        // Example: const res = await fetch(`${apiUrl}/applets/${id}`);
        // if (!res.ok) throw new Error('Applet not found');
        // const data = await res.json();
        // setApplet(data);
        setApplet(null); // No backend, so always not found for now
      } catch (err) {
        setApplet(null);
        console.log('[AppletDetails] Error fetching applet:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchApplet();
  }, [id, apiUrl]);

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
            <View style={styles.serviceLogos}>
              <Image
              style={styles.serviceLogo}
              source={imageMap[applet.firstIconId] ?? imageMap["default"]}
              />

              <Image
              style={styles.serviceLogo}
              source={imageMap[applet.secondeIconId] ?? imageMap["default"]}
              />
            </View>

            <Text style={styles.appletDescription}>
              {applet.description}
            </Text>

            <View style={styles.appIconWithText}>
              <Image source={imageMap[applet.littleIconId] ?? imageMap["default"]} style={styles.littleIcon} />
              <Text style={styles.serviceName}>
                {applet.appName}
              </Text>
            </View>

              <TouchableOpacity style={styles.connectButton}
              // onPress={() => {

              // }}
              >
              <Text style={styles.connectButtonText}>
                  Connect
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.texts}>

              <Text style={styles.howItWorkTitle}>
                How this automation works
              </Text>

              <Text style={styles.howItWorkDescription}>
                {applet.howItWorks}
              </Text>

            </View>

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

  serviceLogos: {
    flexDirection: "row",
    paddingLeft: 20,
  },

  serviceLogo: {
    width: 60,
    height: 60,
    alignSelf: "center",
    marginTop: 30,
    marginRight: 15,
  },

  appletDescription: {
    fontSize: 25,
    fontWeight: 'bold',
    alignSelf: "center",
    marginTop: 20,
    color: '#fff',
    marginLeft: 20
  },

  connectButton: {
    marginHorizontal: 20,
    width: "90%",
    height: 80,
    backgroundColor: "#fff",
    borderRadius: 100,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  connectButtonText: {
    fontSize: 25,
    fontWeight: "bold",
  },

  content: {
    padding: 20
  },

  appIconWithText: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginLeft: 20,
  },

  littleIcon: {
    width: 20,
    height: 20,
  },

  serviceName: {
    flex: 1,
    fontSize: 16,
    color: "#eee",
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginLeft: 10
  },

  texts: {
    alignSelf: "flex-start"
  },

  howItWorkTitle: {
    fontSize: 23,
    fontWeight: "bold",
    marginBottom: 10
  },

  howItWorkDescription: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 22,
    letterSpacing: 0.5
  },

})
