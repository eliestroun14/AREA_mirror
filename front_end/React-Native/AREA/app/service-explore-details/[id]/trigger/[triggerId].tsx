import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import axios from "axios";
import { useApi } from "@/context/ApiContext";

export default function TriggerDetails() {
  const { id, triggerId } = useLocalSearchParams();
  const [trigger, setTrigger] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  const { apiUrl } = useApi();

  useEffect(() => {
    const fetchTrigger = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${apiUrl}/services/${id}/triggers/${triggerId}`);
        setTrigger(res.data);
      } catch (err: any) {
        setError("Trigger not found or error fetching trigger details.");
        setTrigger(null);
      } finally {
        setLoading(false);
      }
    };
    if (id && triggerId) fetchTrigger();
  }, [id, triggerId, apiUrl]);

  return (
    <>
      <Stack.Screen options={{ title: `Trigger Details`, headerStyle: { backgroundColor: '#075eec' }, headerTintColor: '#fff' }} />
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#075eec" />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : trigger ? (
          <View style={styles.card}>
            <Text style={styles.title}>{trigger.name || `Trigger #${trigger.id}`}</Text>
            <Text style={styles.label}>ID: <Text style={styles.value}>{trigger.id}</Text></Text>
            {trigger.description && <Text style={styles.label}>Description: <Text style={styles.value}>{trigger.description}</Text></Text>}
            {trigger.is_active !== undefined && <Text style={styles.label}>Active: <Text style={styles.value}>{trigger.is_active ? 'Yes' : 'No'}</Text></Text>}
            {trigger.service_id && <Text style={styles.label}>Service ID: <Text style={styles.value}>{trigger.service_id}</Text></Text>}
            {trigger.http_request_id && <Text style={styles.label}>HTTP Request ID: <Text style={styles.value}>{trigger.http_request_id}</Text></Text>}
            {trigger.created_at && <Text style={styles.label}>Created at: <Text style={styles.value}>{trigger.created_at}</Text></Text>}
            {trigger.updated_at && <Text style={styles.label}>Updated at: <Text style={styles.value}>{trigger.updated_at}</Text></Text>}
            {trigger.fields && Object.keys(trigger.fields).length > 0 && (
              <View style={{ marginTop: 12, marginBottom: 8 }}>
                <Text style={styles.label}>Fields:</Text>
                {Object.entries(trigger.fields).map(([fieldName, fieldObj]: [string, any]) => (
                  <Text key={fieldName} style={styles.value}>- {fieldName}{fieldObj?.type ? ` (${fieldObj.type})` : ''}</Text>
                ))}
              </View>
            )}
            {trigger.variables && trigger.variables.length > 0 && (
              <View style={{ marginTop: 12, marginBottom: 8 }}>
                <Text style={styles.label}>Variables:</Text>
                {trigger.variables.map((v: any, idx: number) => (
                  <Text key={idx} style={styles.value}>- {typeof v === 'string' ? v : JSON.stringify(v)}</Text>
                ))}
              </View>
            )}
          </View>
        ) : (
          <Text style={styles.error}>No trigger data found.</Text>
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
