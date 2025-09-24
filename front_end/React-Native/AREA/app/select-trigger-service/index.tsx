import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import SearchBar from '@/components/molecules/search-bar/search-bar';
import { useState } from 'react';
import SelectTriggerCard from '@/components/molecules/select-trigger-card/select-trigger-card';
import linkedin from '../../assets/images/linkedinLogo.webp'
import youtube from '../../assets/images/youtubeLogo.webp'
import spotify from '../../assets/images/spotifyLogo.webp'

export default function SelectTriggerService() {

  const [search, setSearch] = useState("");

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
          <View style={styles.container}>

              <View style={styles.searchBar}>
                <SearchBar value={search}
                  onChangeText={setSearch}
                  placeholder='Search...' />
              </View>

              <View style={styles.Cards}>

                <SelectTriggerCard appName='Linkedin'
                appLogoPath={linkedin}
                backgroundColor='rgba(0, 4, 255, 1)'
                />

                <SelectTriggerCard appName='Youtube'
                appLogoPath={youtube}
                backgroundColor='rgba(255, 0, 0, 1)'
                />

                <SelectTriggerCard appName='Spotify'
                appLogoPath={spotify}
                backgroundColor='rgba(49, 180, 23, 1)'
                />

              </View>

          </View>
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
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row'
  }

});
