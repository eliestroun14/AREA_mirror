import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface LoadingViewProps {
  message?: string;
}

/**
 * Reusable loading view component
 */
const LoadingView: React.FC<LoadingViewProps> = ({ message = 'Loading...' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#075eec" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
});

export default LoadingView;
