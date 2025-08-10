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
import {renderProperty} from './Dashboard/Home';
import PropertyCard from '../../Components/PropertyCard';

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

const Wishlist = ({navigation}) => {
  const [likedProperties, setLikedProperties] = useState([]);

  const toggleLike = id => {
    if (likedProperties.includes(id)) {
      setLikedProperties(likedProperties.filter(pid => pid !== id));
    } else {
      setLikedProperties([...likedProperties, id]);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title={'Wishlist'}
        showBack
        onBackPress={() => {
          navigation.goBack();
        }}
      />

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
    </View>
  );
};

export default Wishlist;

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
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    // marginHorizontal: 10,
  },
  card: {
    backgroundColor: COLOR.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
    width: '48%',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  propertyImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  wishlistIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLOR.white,
    padding: 4,
    borderRadius: 20,
    elevation: 3,
  },
  propertyName: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 8,
    marginHorizontal: 6,
    color: COLOR.black,
  },
  propertyLocation: {
    fontSize: 12,
    marginHorizontal: 6,
    color: COLOR.grey,
  },
  propertyPrice: {
    fontSize: 14,
    marginHorizontal: 6,
    marginTop: 4,
    color: COLOR.primary,
    fontWeight: 'bold',
    marginBottom: 6,
  },
});
