import { View, Text, StyleSheet } from 'react-native';

interface ErrorViewProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
}

/**
 * Reusable error/message view component
 */
const ErrorView: React.FC<ErrorViewProps> = ({ message, type = 'error' }) => {
  const getColor = () => {
    switch (type) {
      case 'error':
        return '#ff4444';
      case 'warning':
        return '#ff9800';
      case 'info':
        return '#2196F3';
      default:
        return '#666';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: getColor() }]}>{message}</Text>
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
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default ErrorView;
