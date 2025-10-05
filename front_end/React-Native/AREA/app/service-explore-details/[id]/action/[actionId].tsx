import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import axios from "axios";

export default function ActionDetails() {
  const { id, actionId } = useLocalSearchParams();
  const [action, setAction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchAction = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${apiUrl}/services/${id}/actions/${actionId}`);
        setAction(res.data);
      } catch (err: any) {
        setError("Action not found or error fetching action details.");
        setAction(null);
      } finally {
        setLoading(false);
      }
    };
    if (id && actionId) fetchAction();
  }, [id, actionId, apiUrl]);

  return (
    <>
      <Stack.Screen options={{ title: `Action Details`, headerStyle: { backgroundColor: '#075eec' }, headerTintColor: '#fff' }} />
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#075eec" />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : action ? (
          <View style={styles.card}>
            <Text style={styles.title}>{action.name || `Action #${action.id}`}</Text>
            <Text style={styles.label}>ID: <Text style={styles.value}>{action.id}</Text></Text>
            {action.description && <Text style={styles.label}>Description: <Text style={styles.value}>{action.description}</Text></Text>}
            
            {action.is_active !== undefined && <Text style={styles.label}>Active: <Text style={styles.value}>{action.is_active ? 'Yes' : 'No'}</Text></Text>}
            
            {action.service_id && <Text style={styles.label}>Service ID: <Text style={styles.value}>{action.service_id}</Text></Text>}
            
            {action.http_request_id && <Text style={styles.label}>HTTP Request ID: <Text style={styles.value}>{action.http_request_id}</Text></Text>}
            
            {action.created_at && <Text style={styles.label}>Created at: <Text style={styles.value}>{action.created_at}</Text></Text>}
            
            {action.updated_at && <Text style={styles.label}>Updated at: <Text style={styles.value}>{action.updated_at}</Text></Text>}
            
            {action.fields && Object.keys(action.fields).length > 0 && (
              <View style={{ marginTop: 12, marginBottom: 8 }}>
                <Text style={styles.label}>Fields:</Text>
                {Object.entries(action.fields).map(([fieldName, fieldObj]: [string, any]) => (
                  <Text key={fieldName} style={styles.value}>- {fieldName}{fieldObj?.type ? ` (${fieldObj.type})` : ''}</Text>
                ))}
              </View>
            )}
            {action.variables && action.variables.length > 0 && (
              <View style={{ marginTop: 12, marginBottom: 8 }}>
                <Text style={styles.label}>Variables:</Text>
                {action.variables.map((v: any, idx: number) => (
                  <Text key={idx} style={styles.value}>- {typeof v === 'string' ? v : JSON.stringify(v)}</Text>
                ))}
              </View>
            )}
          </View>
        ) : (
          <Text style={styles.error}>No action data found.</Text>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8ecf4',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    elevation: 2,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#075eec',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#222',
  },
  value: {
    fontWeight: '400',
    color: '#444',
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});
