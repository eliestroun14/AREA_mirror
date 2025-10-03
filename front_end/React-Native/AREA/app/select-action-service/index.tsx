import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet, FlatList } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import SearchBar from '@/components/molecules/search-bar/search-bar';
import { useState, useEffect } from 'react';
import { Service } from '@/types/type';
import db from '@/data/db.json'
import LittleActionServiceCard from '@/components/molecules/little-action-service-card/little-action-service-card';

export default function SelectActionService() {

  const { triggerId, serviceTriggerId } = useLocalSearchParams<{
    triggerId?: string;
    serviceTriggerId?: string
  }>();

  const [search, setSearch] = useState("");

  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    setServices(db.services);
  }, []);

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
