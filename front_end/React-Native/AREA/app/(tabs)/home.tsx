import { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from "@/components/molecules/search-bar/search-bar";
import AppCard from '@/components/molecules/app-card/app-card';
import defaultPfp from '../../assets/images/Default_pfp.svg.png';
import youtubeLogo from '../../assets/images/youtubeLogo.webp';
import linkedinLogo from '../../assets/images/linkedinLogo.webp';

export default function HomeScreen() {

  const [search, setSearch] = useState("");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#e8ecf4"}}>
      <View style={styles.container}>

        <View style={styles.header}>

          <Text style={styles.title}>
            AREA
          </Text>

          <Image
            source={defaultPfp}
            style={styles.profileImage}
            alt="Profile picture"
          />

        </View>

        <View style={styles.homeConfig}>

          <View style={styles.searchBar}>
            <SearchBar value={search}
              onChangeText={setSearch}
              placeholder='Search...' />
          </View>

          <View style={styles.appCards}>
            <AppCard appName='Youtube'
            appLogoPath={youtubeLogo}
            backgroundColor='rgba(255, 17, 0, 1)'
            />
          </View>

          <View style={styles.appCards}>
            <AppCard appName='Linkedin'
            appLogoPath={linkedinLogo}
            backgroundColor='rgba(0, 4, 255, 1)'
            />
          </View>

        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,

  },

  header: {
    padding: 20,
    marginVertical: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  profileImage: {
    width: 80,
    height: 80,
    alignSelf: 'flex-end',
    borderRadius: 100
  },

  title: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#1e1e1e',
    marginBottom: 6,
  },

  homeConfig: {
    padding: 10,
  },

  searchBar: {
    marginBottom: 15,
  },

  appCards: {
    marginTop: 5
  }

});
