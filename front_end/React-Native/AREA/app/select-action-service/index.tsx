import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet, FlatList } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import SearchBar from '@/components/molecules/search-bar/search-bar';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import { Service } from '@/types/type';
import LittleActionServiceCard from '@/components/molecules/little-action-service-card/little-action-service-card';

export default function SelectActionService() {

  const { triggerId, serviceTriggerId } = useLocalSearchParams<{
    triggerId?: string;
    serviceTriggerId?: string
  }>();

  const [search, setSearch] = useState("");

  const [services, setServices] = useState<Service[]>([]);
  const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  const router = useRouter();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${apiUrl}/services`);
        if (!res.ok) throw new Error('Failed to fetch services');
        const data = await res.json();
        setServices(data);
      } catch (err) {
        setServices([]);
        console.log('[SelectActionService] Error fetching services:', err);
      }
    };
    fetchServices();
  }, [apiUrl]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        router.replace('/create');
        return true;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [router])
  );

  return (
    <>
      <Stack.Screen
          options={{
            title: 'Select Action Service',
            headerStyle: {
              backgroundColor: '#000',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        {
        <SafeAreaView style={{ flex: 1, backgroundColor: "#e8ecf4"}}>
          <FlatList
            style={styles.Cards}
            numColumns={2}
            data={services}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({item}) => <LittleActionServiceCard
              item={item}
              triggerId={triggerId}
              serviceTriggerId={serviceTriggerId}
              />}
            ListHeaderComponent={() =>
                <View style={styles.searchBar}>
                  <SearchBar value={search}
                    onChangeText={setSearch}
                    placeholder='Search...' />
                </View>
            }
          >
          </FlatList>
        </SafeAreaView>
        }
    </>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    marginBottom: 15,
  },

  Cards: {
    padding: 10,
    alignSelf: "center"
  }
});
