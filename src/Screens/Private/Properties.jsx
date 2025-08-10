import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../../Components/FeedHeader';
import {COLOR} from '../../Constants/Colors';
import PropertyCard from '../../Components/PropertyCard';
import SortModal from '../../Components/SortModal';

// Demo property data
const propertyData = [
  {
    id: '1',
    name: 'Luxury Villa',
    location: 'Jaipur',
    price: '₹ 75,00,000',
    image:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80',
  },
  {
    id: '2',
    name: 'Modern Apartment',
    location: 'Delhi',
    price: '₹ 45,00,000',
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80',
  },
  {
    id: '3',
    name: 'Beach House',
    location: 'Goa',
    price: '₹ 1,20,00,000',
    image:
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&q=80',
  },
  {
    id: '4',
    name: 'Penthouse Suite',
    location: 'Mumbai',
    price: '₹ 2,50,00,000',
    image:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80',
  },
  {
    id: '3',
    name: 'Beach House',
    location: 'Goa',
    price: '₹ 1,20,00,000',
    image:
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&q=80',
  },
  {
    id: '4',
    name: 'Penthouse Suite',
    location: 'Mumbai',
    price: '₹ 2,50,00,000',
    image:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80',
  },
  {
    id: '3',
    name: 'Beach House',
    location: 'Goa',
    price: '₹ 1,20,00,000',
    image:
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&q=80',
  },
  {
    id: '4',
    name: 'Penthouse Suite',
    location: 'Mumbai',
    price: '₹ 2,50,00,000',
    image:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80',
  },
  {
    id: '3',
    name: 'Beach House',
    location: 'Goa',
    price: '₹ 1,20,00,000',
    image:
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&q=80',
  },
  {
    id: '4',
    name: 'Penthouse Suite',
    location: 'Mumbai',
    price: '₹ 2,50,00,000',
    image:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80',
  },
];

const Properties = ({navigation}) => {
  const [likedProperties, setLikedProperties] = useState([]);
  const [sortVisible, setSortVisible] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState([
    'Family',
    '2 BHK',
    'Jaipur',
  ]); // demo filters

  const toggleLike = id => {
    if (likedProperties.includes(id)) {
      setLikedProperties(likedProperties.filter(pid => pid !== id));
    } else {
      setLikedProperties([...likedProperties, id]);
    }
  };

  const handleFilterChange = newFilters => {
    console.log('Applied Filters:', newFilters);
    setAppliedFilters(newFilters);
  };

  const removeFilter = filter => {
    setAppliedFilters(appliedFilters.filter(f => f !== filter));
  };

  return (
    <View style={styles.container}>
      <Header
        title={'Properties on Rent'}
        showBack
        onBackPress={() => {
          navigation.goBack();
        }}
      />

      {/* Search & Filter */}
      <View style={styles.searchContainer}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/128/622/622669.png',
          }}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search Properties or Location"
          style={styles.searchInput}
          placeholderTextColor={COLOR.grey}
        />
        <TouchableOpacity onPress={() => setSortVisible(true)}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/4662/4662255.png',
            }}
            style={styles.filterIcon}
          />
        </TouchableOpacity>
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

      {/* Property Grid */}
      <FlatList
        data={propertyData}
        renderItem={({item}) => (
          <PropertyCard item={item} toggleLike={toggleLike} />
        )}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
      <SortModal
        visible={sortVisible}
        onClose={() => setSortVisible(false)}
        onSelectSort={sortType => {
          console.log('Selected Sort:', sortType);
        }}
      />
    </View>
  );
};

export default Properties;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLOR.white},
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
  crossIcon: {width: 8, height: 8, tintColor: COLOR.white},
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
});
