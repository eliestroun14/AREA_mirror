import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { Zap } from '@/types/type';
import axios from 'axios';
import { useApi } from '@/context/ApiContext';

export default function MyAppletsScreen() {
  console.log('(MY APPLETS)');
  const { user, isAuthenticated, sessionToken } = useAuth();
  const [zaps, setZaps] = useState<Zap[]>([]);
  const [loading, setLoading] = useState(true);
  const { apiUrl } = useApi();

  const fetchZaps = useCallback(async ()=> {
    if (!isAuthenticated || !sessionToken || !apiUrl) return;
    setLoading(true);
    try {
      const URL = `${apiUrl}/zaps`;
      console.log('Fetching zaps from:', URL);
      const response = await axios.get(URL, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionToken,
        },
        withCredentials: true,
      });
      console.log('Session token:', sessionToken);
      if (response.status === 200) {
        console.log('Fetched zaps:', response.data);
        setZaps(response.data as Zap[] || []);
      } else {
        setZaps([]);
      }
      console.log('Response from API:', response.data);
    } catch (err) {
      setZaps([]);
      console.log('(MY APPLETS) Error fetching zaps:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, sessionToken, apiUrl]);

  useEffect(() => {
    if (apiUrl && isAuthenticated && sessionToken) {
      fetchZaps();
    }
  }, [apiUrl, isAuthenticated, sessionToken, fetchZaps]);


  const handleToggleZap = async (zapId: number, isActive: boolean) => {
    if (!sessionToken) {
      Alert.alert('Error', 'Session token missing.');
      return;
    }
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(sessionToken ? { 'Authorization': sessionToken } : {}),
      };
      const res = await fetch(`${apiUrl}/zaps/${zapId}/toggle`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ is_active: !isActive }),
        credentials: 'include',
      });
      if (res.status === 200) {
        setZaps(zaps => {
          const updated = zaps.map(zap => zap.id === zapId ? { ...zap, is_active: !isActive } : zap);
          return updated;
        });
      } else {
        Alert.alert('Error', 'Unable to toggle zap.');
      }
    } catch (err) {
      Alert.alert('Error', 'Unable to toggle zap.');
    }
  };

  const handleDeleteZap = async (zapId: number) => {
    console.log('handleDeleteZap called with:', { zapId, sessionToken });
    if (!sessionToken) {
      Alert.alert('Error', 'Session token missing.');
      return;
    }
    Alert.alert(
      'Delete Zap',
      'Are you sure you want to delete this zap?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive', onPress: async () => {
            try {
              const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                ...(sessionToken ? { 'Authorization': sessionToken } : {}),
              };
              console.log('Delete zap request:', { url: `${apiUrl}/zaps/${zapId}`, headers });
              const res = await fetch(`${apiUrl}/zaps/${zapId}`, {
                method: 'DELETE',
                headers,
                credentials: 'include',
              });
              console.log('Delete zap response status:', res.status);
              if (res.status === 200) {
                setZaps(zaps => {
                  const updated = zaps.filter(zap => zap.id !== zapId);
                  console.log('Updated zaps after delete:', updated);
                  return updated;
                });
                fetchZaps();
              } else {
                Alert.alert('Error', 'Unable to delete zap.');
              }
            } catch (err) {
              Alert.alert('Error', 'Unable to delete zap.');
            }
          }
        }
      ]
    );
  };

  if (!apiUrl) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#075eec" />
        <Text style={{ marginTop: 10 }}>Loading configuration...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>My Applets</Text>
      {!isAuthenticated ? (
        <View style={styles.authMessageContainer}>
          <Text style={styles.authMessageText}>
            You must be logged in to see your applets.
          </Text>
        </View>
      ) : loading ? (
        <ActivityIndicator size="large" color="#075eec" />
      ) : zaps.length === 0 ? (
        <Text style={styles.empty}>No applets found.</Text>
      ) : (
        zaps.map((zap: Zap) => (
          <View key={zap.id} style={styles.zapCard}>
            <Text style={styles.zapName}>{zap.name}</Text>
            <Text style={styles.zapStatus}>Status: {zap.is_active ? 'Active' : 'Inactive'}</Text>
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: zap.is_active ? '#ec0707ff' : '#075eec' }]}
                onPress={() => handleToggleZap(zap.id, zap.is_active)}
              >
                <Text style={styles.buttonText}>{zap.is_active ? 'Deactivate' : 'Activate'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#929292', marginLeft: 10 }]}
                onPress={() => handleDeleteZap(zap.id)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>

        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    backgroundColor: '#e8ecf4',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1e1e1e',
    padding: -4,
    marginVertical: 40,
    marginBottom: 20,
  },
  authMessageContainer: {
    marginTop: 30,
  },
  authMessageText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 15,
  },
  empty: {
    fontSize: 18,
    color: '#929292',
    textAlign: 'center',
    marginTop: 40,
  },
  zapCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  zapName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  zapStatus: {
    fontSize: 15,
    color: '#929292',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

