import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getApiBaseUrl(): Promise<string> {
  try {
    const stored = await AsyncStorage.getItem('backend_ip');
    if (stored) {
      console.log('Using stored backend_ip for API base URL: ' + stored);
      return JSON.parse(stored).ip;
    }
  } catch (err) {
    console.warn('Error about backend_ip', err);
  }
  console.log('Using default EXPO_PUBLIC_API_BASE_URL for API base URL: ' + process.env.EXPO_PUBLIC_API_BASE_URL);
  return process.env.EXPO_PUBLIC_API_BASE_URL!;
}
