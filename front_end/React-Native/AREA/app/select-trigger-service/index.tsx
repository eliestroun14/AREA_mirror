import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet, FlatList, BackHandler } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import SearchBar from '@/components/molecules/search-bar/search-bar';
import { useState, useEffect } from 'react';
import LittleTriggerServiceCard from '@/components/molecules/little-trigger-service-card/little-trigger-service-card';
import { Service } from '@/types/type';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useApi } from '@/context/ApiContext';

export default function SelectTriggerService() {
  console.log('(SELECT TRIGGER SERVICE)');
  const [search, setSearch] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  // const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  const router = useRouter();

  const { apiUrl } = useApi();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${apiUrl}/services`);
        if (!res.ok) throw new Error('Failed to fetch services');
        const data = await res.json();
        console.log('Fetched services SELECT TRIGGER SERVICE:', data);
        setServices(data);
      } catch (err) {
        setServices([]);
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
          title: 'Select Trigger Service',
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#e8ecf4" }}>
        <FlatList
          style={styles.Cards}
          numColumns={2}
          data={services}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <LittleTriggerServiceCard item={item} />}
          ListHeaderComponent={() => (
            <View style={styles.searchBar}>
              <SearchBar value={search} onChangeText={setSearch} placeholder='Search...' />
            </View>
          )}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    marginBottom: 15,
  },
  Cards: {
    padding: 10,
    alignSelf: "center",
  },
});
