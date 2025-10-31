import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getApiBaseUrl(): Promise<string> {
  try {
    const stored = await AsyncStorage.getItem('backend_ip');
    if (stored) {
      const { ip } = JSON.parse(stored);
      console.log('Retrieved IP:', ip);
      if (ip) {
        return `${ip}`;
      }
    }
  } catch (err) {
    console.warn('Error about backend_ip', err);
  }

  return process.env.EXPO_PUBLIC_API_BASE_URL!;
}
