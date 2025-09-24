import { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from "@/components/molecules/search-bar/search-bar";
import BasicExploreCard from '@/components/molecules/basic-explore-card/basic-explore-card'
import news_bro from '../../assets/images/News-bro.png';
import news_rafiki from '../../assets/images/News-rafiki.png';
import linkedin from '../../assets/images/linkedinLogo.webp';
import youtube from '../../assets/images/youtubeLogo.webp';
import SimpleExploreCard from '@/components/molecules/simple-explore-card/simple-explore-card'
import ComplexExploreCard from '@/components/molecules/complex-explore-card/complex-explore-card'


export default function ExploreScreen() {

  const [search, setSearch] = useState("");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#e8ecf4"}}>
      <ScrollView>
        <View style={styles.container}>

          <View style={styles.header}>

            <View style={styles.searchBar}>
              <SearchBar value={search}
                onChangeText={setSearch}
                placeholder='Search...' />
            </View>

            <View style={styles.Cards}>
              <SimpleExploreCard appName='Youtube'
              appLogoPath={youtube}
              backgroundColor='rgba(255, 17, 0, 1)'
              />
            </View>

            <View style={styles.Cards}>
              <ComplexExploreCard description='Create an event on youtube in a linkedin post !'
              appName='Youtube'
              firstIconPath={youtube}
              secondIconPath={linkedin}
              backgroundColor='rgba(195, 0, 255, 1)'
              littleIconPath={youtube}
              />
            </View>

            <View style={styles.Cards}>
              <BasicExploreCard category='Popular'
              description='New on AREA in September 2025'
              imageBackground={news_rafiki}
              backgroundColor='rgba(0, 163, 95, 1)'
              />
            </View>

            <View style={styles.Cards}>
              <SimpleExploreCard appName='Linkedin'
              appLogoPath={linkedin}
              backgroundColor='rgba(0, 4, 255, 1)'
              />
            </View>

            <View style={styles.Cards}>
              <BasicExploreCard category='Linkedin'
              description='New on AREA in August 2025'
              imageBackground={news_bro}
              backgroundColor='rgba(202, 115, 0, 1)'
              />
            </View>

            <View style={styles.Cards}>
              <ComplexExploreCard description='Create an event on youtube in a linkedin post !'
              appName='Linkedin'
              firstIconPath={linkedin}
              backgroundColor='rgba(0, 126, 175, 1)'
              littleIconPath={linkedin}
              />
            </View>

          </View>

        </View>
      </ScrollView>
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
