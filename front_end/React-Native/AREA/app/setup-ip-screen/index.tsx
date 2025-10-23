// app/setup/index.tsx
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export default function SetupIpScreen() {
  const [ip, setIp] = useState('');
  const router = useRouter();

  const handleValidate = async () => {
    if (!ip.trim()) {
      Alert.alert('Error', "Please enter a valid IP.");
      return;
    }

    const payload = {
      ip: ip.trim(),
      date: new Date().toISOString(),
    };

    await AsyncStorage.setItem('backend_ip', JSON.stringify(payload));

    router.push('/(tabs)/profile');
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Set IP to access to the app",
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <View style={styles.container}>
        <Text style={styles.text}>
          Please enter the network location of the application server :
        </Text>
        <TextInput
          placeholder="http://...:8080"
          value={ip}
          onChangeText={setIp}
          style={styles.textBox}
        />
        <TouchableOpacity style={styles.connectButton}
          onPress={handleValidate}>
          <Text style={styles.connectButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    marginBottom: 50
  },

  text: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#000000ff',
    paddingBottom: 30
  },

  textBox: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    height: 50,
    fontSize: 20
  },

  connectButton: {
    height: 80,
    backgroundColor: "#000",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },

  connectButtonText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#fff"
  },

})
