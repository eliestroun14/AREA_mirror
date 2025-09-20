import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import SearchBar from "@/components/molecules/search-bar/search-bar";


export default function HomeScreen() {

  const [search, setSearch] = useState("");

  return (
    <SafeAreaView>
      <View style={styles.container}>

        <View style={styles.header}>

          <Text style={styles.title}>
            AREA
          </Text>

          <Image
            source={require('@/assets/images/Default_pfp.svg.png')}
            style={styles.profileImage}
          />

        </View>

        <View style={styles.homeConfig}>

          <View>
            <SearchBar value={search}
              onChangeText={setSearch}
              placeholder='Search...' />
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
    padding: 10
  },

});
