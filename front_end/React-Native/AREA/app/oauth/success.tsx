import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function OAuthSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Give user a moment to see the success message, then navigate back
    const timer = setTimeout(() => {
      // Navigate back to the previous screen or to the main create flow
      router.replace('/(tabs)/create');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#075eec" style={styles.loader} />
      <Text style={styles.title}>Success!</Text>
      <Text style={styles.message}>
        Service connected successfully. Redirecting...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loader: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#075eec',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
