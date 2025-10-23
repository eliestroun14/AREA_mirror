import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getApiBaseUrl(): Promise<string> {
  try {
    const stored = await AsyncStorage.getItem('backend_ip');
    if (stored) {
      const { ip } = JSON.parse(stored);
      if (ip) {
          console.log("ip = ", ip);
          return `http://${ip}:8080`;
      }
    }
  } catch (err) {
    console.warn('Error about backend_ip', err);
  }

  return process.env.EXPO_PUBLIC_API_BASE_URL!;
}
