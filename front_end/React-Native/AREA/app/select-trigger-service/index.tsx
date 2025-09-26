import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet, FlatList } from 'react-native';
import { Stack } from 'expo-router';
import SearchBar from '@/components/molecules/search-bar/search-bar';
import { useState, useEffect } from 'react';
import LittleServiceCard from '@/components/molecules/little-service-card/little-service-card';
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
            renderItem={({item}) => <LittleServiceCard item={item}/>}
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
  container: {
    padding: 10
  },

  profileImage: {
    width: 80,
    height: 80,
    alignSelf: 'flex-end',
    borderRadius: 100
  },

  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1e1e1e',
    padding: 20,
    marginVertical: 10,
  },

  text: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center"
  },

  homeConfig: {
    padding: 10,
  },

  searchBar: {
    marginBottom: 15,
  },

  Cards: {
    alignSelf: "center"
  }

});
