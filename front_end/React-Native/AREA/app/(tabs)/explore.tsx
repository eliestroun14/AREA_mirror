import { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from "@/components/molecules/search-bar/search-bar";
import NewsCard from '@/components/molecules/news-card/news-card'
import news_bro from '../../assets/images/News-bro.png';
import news_rafiki from '../../assets/images/News-rafiki.png';
import linkedin from '../../assets/images/linkedinLogo.webp';
import youtube from '../../assets/images/youtubeLogo.webp';
import AppletCard from '@/components/molecules/applets-card/applets-card'
import { Service } from '@/types/type';
import axios from 'axios'
import db from "../../data/db.json"
import ServiceCard from '@/components/molecules/service-card/service-card'

export default function ExploreScreen() {

  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setServices(db.services);
  }, []);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getServices = async() => {
    const URL = 'http://localhost:3000/services';
      const response = await axios.get(URL);

      console.log(response.data);
      setServices(response.data);
      setIsLoading(false);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#e8ecf4"}}>
      <FlatList
        data={services}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ServiceCard item={item} />}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <View style={styles.searchBar}>
              <SearchBar value={search} onChangeText={setSearch} placeholder="Search..." />
            </View>

            <View style={styles.Cards}>
              <AppletCard description='Create an event on youtube in a linkedin post !'
              appName='Youtube'
              firstIconPath={youtube}
              secondIconPath={linkedin}
              backgroundColor='rgba(195, 0, 255, 1)'
              littleIconPath={youtube}
              />
            </View>

            <View style={styles.Cards}>
              <NewsCard category='Popular'
              description='New on AREA in September 2025'
              imageBackground={news_rafiki}
              backgroundColor='rgba(0, 163, 95, 1)'
              />
            </View>

            <View style={styles.Cards}>
              <NewsCard category='Linkedin'
              description='New on AREA in August 2025'
              imageBackground={news_bro}
              backgroundColor='rgba(202, 115, 0, 1)'
              />
            </View>

            <View style={styles.Cards}>
              <AppletCard description='Create an event on youtube in a linkedin post !'
              appName='Linkedin'
              firstIconPath={linkedin}
              backgroundColor='rgba(0, 126, 175, 1)'
              littleIconPath={linkedin}
              />
            </View>

            {/* Autres composants fixes ici */}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,

  },

  header: {
    padding: 10,
    marginTop: 30
  },

  searchBar: {
    marginBottom: 15,
  },

  Cards: {
    marginTop: 5
  }

});
