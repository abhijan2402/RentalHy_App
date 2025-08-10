import React, {useRef, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Platform,
  TextInput,
} from 'react-native';
import {COLOR} from '../../../Constants/Colors';
import PropertyCard from '../../../Components/PropertyCard';
import CustomButton from '../../../Components/CustomButton';

const {width} = Dimensions.get('window');

const Home = ({navigation}) => {
  const banners = [
    'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1200',
    'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=1200',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
  ];

  const properties = [
    {
      id: '1',
      name: 'Luxury Villa',
      location: 'Jaipur, Rajasthan',
      description: 'Beautiful 4BHK villa with garden view.',
      price: '₹ 1.5 Cr',
      image:
        'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800',
    },
    {
      id: '2',
      name: 'Modern Apartment',
      location: 'Mumbai, Maharashtra',
      description: '2BHK apartment near the sea.',
      price: '₹ 85 Lakh',
      image:
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    },
    {
      id: '3',
      name: 'Cozy House',
      location: 'Pune, Maharashtra',
      description: '3BHK house in peaceful neighborhood.',
      price: '₹ 95 Lakh',
      image:
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    },
    {
      id: '4',
      name: 'Beach View Villa',
      location: 'Goa, India',
      description: 'Luxury property with private beach.',
      price: '₹ 3 Cr',
      image:
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800',
    },
  ];

  const [bannerIndex, setBannerIndex] = useState(0);
  const bannerRef = useRef(null);
  const [appliedFilters, setAppliedFilters] = useState([
    'Family',
    '2 BHK',
    'Jaipur',
  ]); // demo filters
  // Auto-scroll banners
  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (bannerIndex + 1) % banners.length;
      setBannerIndex(nextIndex);
      bannerRef.current.scrollToIndex({index: nextIndex, animated: true});
    }, 3000);

    return () => clearInterval(timer);
  }, [bannerIndex]);

  const toggleLike = id => {
    setLikedProperties(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id],
    );
  };

  const handleFilterChange = newFilters => {
    console.log('Applied Filters:', newFilters);
    setAppliedFilters(newFilters);
  };

  const removeFilter = filter => {
    setAppliedFilters(appliedFilters.filter(f => f !== filter));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLOR.white} barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/1865/1865269.png',
            }}
            style={styles.locationIcon}
          />
          <View>
            <Text style={styles.locationCity}>Jaipur</Text>
            <Text style={styles.locationAddress}>Abc, Jaipur, Rajasthan</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?w=100',
            }}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Banner Slider */}
      <View style={{marginVertical: 10}}>
        <FlatList
          ref={bannerRef}
          data={banners}
          renderItem={({item}) => (
            <Image source={{uri: item}} style={styles.banner} />
          )}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingHorizontal: 15}}
        />
      </View>
      <View style={styles.searchContainer}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/128/622/622669.png',
          }}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search Properties” or Location"
          style={styles.searchInput}
          placeholderTextColor={COLOR.grey}
        />
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Filter', {onApplyFilter: handleFilterChange})
          }>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/7693/7693332.png',
            }}
            style={styles.filterIcon}
          />
        </TouchableOpacity>
      </View>
      {/* Applied Filters */}
      {appliedFilters.length > 0 && (
        <View style={styles.filterTagsContainer}>
          {appliedFilters.map((filter, index) => (
            <View key={index} style={styles.filterTag}>
              <Text style={styles.filterText}>{filter}</Text>
              <TouchableOpacity onPress={() => removeFilter(filter)}>
                <Image
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/128/1828/1828778.png',
                  }}
                  style={styles.crossIcon}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Trending Properties Title */}
      <Text style={styles.sectionTitle}>Trending Properties</Text>

      {/* Properties Grid */}
      <FlatList
        data={properties}
        renderItem={({item}) => (
          <PropertyCard item={item} toggleLike={toggleLike} />
        )}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={{paddingBottom: 20, marginHorizontal: 10}}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity
        onPress={() => {
          console.log('hi');

          navigation.navigate('PostProperty');
        }}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/128/753/753317.png',
          }}
          style={{
            width: 70,
            height: 70,
            position: 'absolute',
            bottom: 50,
            right: 30,
            borderRadius: 25,
            // backgroundColor: COLOR.primary,
            padding: 10,
          }}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.white,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: COLOR.white,
    borderBottomWidth: 0.5,
    borderBottomColor: COLOR.lightGrey,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    width: 22,
    height: 22,
    marginRight: 8,
  },
  locationCity: {
    fontSize: 16,
    fontWeight: '700',
    color: COLOR.black,
  },
  locationAddress: {
    fontSize: 12,
    color: COLOR.grey,
  },
  profileIcon: {
    width: 35,
    height: 35,
    borderRadius: 20,
  },
  banner: {
    width: width - 60,
    height: 140,
    resizeMode: 'cover',
    borderRadius: 10,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLOR.black,
    paddingHorizontal: 15,
    marginTop: 15, // extra space from top
    marginBottom: 5,
  },
  card: {
    backgroundColor: COLOR.white,
    flex: 1,
    margin: 8,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: COLOR.black,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  propertyImage: {
    width: '100%',
    height: 120,
  },
  wishlistIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLOR.white,
    borderRadius: 15,
    padding: 4,
  },
  propertyName: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 5,
    paddingHorizontal: 6,
  },
  propertyLocation: {
    fontSize: 12,
    color: COLOR.grey,
    paddingHorizontal: 6,
    marginBottom: 2,
  },
  propertyPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: COLOR.primary,
    paddingHorizontal: 6,
    marginBottom: 5,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 12,
    backgroundColor: COLOR.white,
    borderRadius: 10,
    paddingHorizontal: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingVertical: 8,
    marginHorizontal: 20,
  },
  searchIcon: {width: 20, height: 20, tintColor: COLOR.grey, marginRight: 8},
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 14,
    color: COLOR.black,
  },
  filterIcon: {width: 22, height: 22, tintColor: COLOR.primary, marginLeft: 8},
  filterTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 20,
    marginBottom: 8,
  },
  filterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 6,
  },
  filterText: {fontSize: 12, color: COLOR.white, marginRight: 6},
  crossIcon: {width: 11, height: 11, tintColor: COLOR.white},
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
});
