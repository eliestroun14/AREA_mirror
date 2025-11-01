import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AuthProvider } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ApiProvider } from '@/context/ApiContext';
import { ZapCreationProvider } from '@/context/ZapCreationContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  useEffect(() => {
    const redirectToSetup = async () => {
      setTimeout(() => {
        router.replace('/setup-ip-screen');
      }, 100);
    };
    redirectToSetup();
  }, []);

  return (
    <AuthProvider>
      <ApiProvider>
        <ZapCreationProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="modal"
                options={{ presentation: 'modal', title: 'Modal' }}
              />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </ZapCreationProvider>
      </ApiProvider>
    </AuthProvider>
  );
}
