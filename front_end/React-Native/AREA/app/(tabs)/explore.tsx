import { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, FlatList, ListRenderItem } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from "@/components/molecules/search-bar/search-bar";
import NewsCard from '@/components/molecules/news-card/news-card'
import news_bro from '../../assets/images/News-bro.png';
import news_rafiki from '../../assets/images/News-rafiki.png';
import { AppletsCard, Service } from '@/types/type';
import db from "../../data/db.json"
import ServiceCard from '@/components/molecules/service-card/service-card'
import AppletCard from '@/components/molecules/applets-card/applets-card';

type ServiceWithType = Service & { itemType: 'service' };
type AppletWithType = AppletsCard & { itemType: 'applet' };
type CombinedItem = ServiceWithType | AppletWithType;

export default function ExploreScreen() {

  const [services, setServices] = useState<Service[]>([]);
  const [applets, setApplets] = useState<AppletsCard[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setServices(db.services);
  }, []);

  useEffect(() => {
    setApplets(db.appletsCard);
  }, []);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const combinedData = useMemo(() => {
    const servicesWithType: ServiceWithType[] = services.map((item: Service) => ({
      ...item,
      itemType: 'service' as const
    }));

    const appletsWithType: AppletWithType[] = applets.map((item: AppletsCard) => ({
      ...item,
      itemType: 'applet' as const
    }));

    const combined: CombinedItem[] = [...servicesWithType, ...appletsWithType];
    return shuffleArray(combined);
  }, [services, applets]);

  const renderItem: ListRenderItem<CombinedItem> = ({ item }) => {
    if (item.itemType === 'service')
      return <ServiceCard item={item} />;
    else if (item.itemType === 'applet')
      return <AppletCard item={item} />;
    return null;
  };

  // const [isLoading, setIsLoading] = useState<boolean>(true);

  // const getServices = async() => {
  //   const URL = 'http://localhost:3000/services';
  //     const response = await axios.get(URL);

  //     console.log(response.data);
  //     setServices(response.data);
  //     setIsLoading(false);
  // }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#e8ecf4"}}>
      <FlatList
        data={combinedData}
        keyExtractor={(item, index) => `${item.itemType}-${item.id}-${index}`}
        renderItem={renderItem}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <View style={styles.searchBar}>
              <SearchBar value={search} onChangeText={setSearch} placeholder="Search..." />
            </View>

            {/* <View style={styles.Cards}>
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
            </View> */}
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
