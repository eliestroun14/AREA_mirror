import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet, FlatList } from 'react-native';
import { Stack } from 'expo-router';
import SearchBar from '@/components/molecules/search-bar/search-bar';
import { useState, useEffect } from 'react';
import LittleTriggerServiceCard from '@/components/molecules/little-trigger-service-card/little-trigger-service-card';
import { Service } from '@/types/type';
import db from '@/data/db.json'

export default function SelectTriggerService() {

  const [search, setSearch] = useState("");

  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    setServices(db.services);
  }, []);

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
        {
        <SafeAreaView style={{ flex: 1, backgroundColor: "#e8ecf4"}}>
          <FlatList
            style={styles.Cards}
            numColumns={2}
            data={services}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({item}) => <LittleTriggerServiceCard item={item}/>}
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
