import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useApi } from '@/context/ApiContext';

interface ActivityItem {
  type: string;
  title: string;
  description?: string | null;
  created_at: string;
  meta?: Record<string, any> | null;
}

interface ActivityResponse {
  activities: ActivityItem[];
}

export default function ActivityScreen() {
  console.log('(ACTIVITY)');
  const { isAuthenticated, sessionToken } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const apiUrl = useApi();

  const fetchActivities = useCallback(async () => {
    if (!isAuthenticated || !sessionToken || !apiUrl) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<ActivityResponse>(`${apiUrl}/users/me/activities`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionToken,
        },
      });
      setError(null)
      if (response.status === 200) {
        setActivities(response.data.activities || []);
      } else {
        setError('Failed to load activities');
      }
    } catch (err: any) {
      console.error('Error fetching activities:', err);
      setError('Failed to load activities. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, sessionToken, apiUrl]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchActivities();
    setRefreshing(false);
  };

  useEffect(() => {
    if (apiUrl && isAuthenticated && sessionToken) {
      fetchActivities();
    }
  }, [apiUrl, isAuthenticated, sessionToken]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'connection':
        return '🔗';
      case 'zap_execution':
        return '⚡';
      case 'zap_created':
        return '✨';
      case 'zap_updated':
        return '📝';
      case 'zap_deleted':
        return '🗑️';
      default:
        return '📋';
    }
  };

  const renderActivityItem = ({ item }: { item: ActivityItem }) => (
    <View style={styles.activityCard}>
      <View style={styles.activityHeader}>
        <Text style={styles.activityIcon}>{getActivityIcon(item.type)}</Text>
        <View style={styles.activityInfo}>
          <Text style={styles.activityTitle}>{item.title}</Text>
          <Text style={styles.activityDate}>{formatDate(item.created_at)}</Text>
        </View>
      </View>
      {item.description && (
        <Text style={styles.activityDescription}>{item.description}</Text>
      )}
      {item.meta && Object.keys(item.meta).length > 0 && (
        <View style={styles.activityMeta}>
          {item.meta.service_name && (
            <Text style={styles.metaText}>Service: {item.meta.service_name}</Text>
          )}
          {item.meta.last_used_at && (
            <Text style={styles.metaText}>
              Last used: {formatDate(item.meta.last_used_at)}
            </Text>
          )}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#e8ecf4" }}>
      <View style={styles.container}>
        <Text style={styles.title}>Activity</Text>
        
        {!isAuthenticated ? (
          <View style={styles.authMessageContainer}>
            <Text style={styles.authMessageText}>
              You must be logged in to see your activity.
            </Text>
          </View>
        ) : loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#075eec" />
            <Text style={styles.loadingText}>Loading your activity...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchActivities}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : activities.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No activity to show yet.</Text>
            <Text style={styles.emptySubText}>
              Your connections and zap executions will appear here.
            </Text>
          </View>
        ) : (
          <FlatList
            data={activities}
            keyExtractor={(item, index) => `${item.type}-${item.created_at}-${index}`}
            renderItem={renderActivityItem}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#075eec']}
                tintColor="#075eec"
              />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1e1e1e',
    marginBottom: 20,
    marginTop: 10,
  },

  authMessageContainer: {
    marginTop: 30,
  },

  authMessageText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 15,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#929292',
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },

  errorText: {
    fontSize: 16,
    color: '#ec0707',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },

  retryButton: {
    backgroundColor: '#075eec',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },

  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },

  emptyText: {
    fontSize: 18,
    color: '#929292',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
  },

  emptySubText: {
    fontSize: 16,
    color: '#929292',
    textAlign: 'center',
    lineHeight: 22,
  },

  listContainer: {
    paddingBottom: 20,
  },

  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  activityHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  activityIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },

  activityInfo: {
    flex: 1,
  },

  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e1e1e',
    marginBottom: 4,
  },

  activityDate: {
    fontSize: 14,
    color: '#929292',
  },

  activityDescription: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginTop: 8,
  },

  activityMeta: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },

  metaText: {
    fontSize: 12,
    color: '#929292',
    marginBottom: 2,
  },
});
