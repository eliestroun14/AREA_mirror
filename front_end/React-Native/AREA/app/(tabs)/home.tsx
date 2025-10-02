import { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from "@/components/molecules/search-bar/search-bar";
import defaultPfp from '../../assets/images/Default_pfp.svg.png';
import { router } from 'expo-router';
import build from '../../assets/images/Construction crane-pana.png';

export default function HomeScreen() {

  const [search, setSearch] = useState("");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#e8ecf4"}}>
      <View style={styles.container}>

        <View style={styles.header}>

          <Text style={styles.title}>
            AREA
          </Text>

          <TouchableOpacity
            onPress={() => (
              router.push("/profile")
            )}
          >
            <Image
              source={defaultPfp}
              style={styles.profileImage}
              alt="Profile picture"
            />
          </TouchableOpacity>

        </View>

        <View style={styles.homeConfig}>

          <View style={styles.searchBar}>
            <SearchBar value={search}
              onChangeText={setSearch}
              placeholder='Search...' />
          </View>

          <Text style={styles.text}>
            My Applets
          </Text>

          <Image style={styles.image}
            source={build}
          />

          <Text style={styles.text}>
            No Applets for Moment
          </Text>

        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  },

  text: {
    fontSize: 22,
    fontWeight: "bold",
    alignSelf: "center",
  },

  image: {
    width: 300,
    height: 300,
    marginTop: 50,
    alignSelf: "center"
  },

});
