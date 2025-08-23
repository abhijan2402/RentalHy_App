// PropertyCard.js
import React from 'react';
import {TouchableOpacity, Image, Text, View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {COLOR} from '../Constants/Colors';

const PropertyCard = ({item, toggleLike , type}) => {
  const navigation = useNavigation();
  const isLiked = true; 

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('PropertyDetail', {propertyData: type === 'wishlist' ? item?.property : item});
      }}
      style={styles.card}>
      <Image source={{uri: item?.property?.images[0]?.image_url || item?.images[0]?.image_url}} style={styles.propertyImage} />

      <TouchableOpacity
        style={styles.wishlistIcon}
        onPress={() => toggleLike(item.id)}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/128/13369/13369080.png',
          }}
          style={{
            width: 20,
            height: 20,
            tintColor: isLiked ? COLOR.primary : COLOR.grey,
          }}
        />
      </TouchableOpacity>

      <Text style={styles.propertyName}>{item.title || item?.property?.title}</Text>
      <Text style={styles.propertyLocation}>{item?.property?.location || item.location}</Text>
      <Text style={styles.propertyLocation}>Family </Text>
<Text style={styles.propertyPrice}>
  {item?.property?.price != null && item?.property?.price !== undefined
    ? '₹' + item.property.price
    : item?.price != null && item?.price !== undefined
    ? '₹' + item.price
    : ''}
</Text>    </TouchableOpacity>
  );
};

export default PropertyCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 5,
    borderRadius: 10,
    padding: 8,
    elevation: 2,
  },
  propertyImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  wishlistIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  propertyName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  propertyLocation: {
    fontSize: 14,
    color: COLOR.grey,
  },
  propertyPrice: {
    fontSize: 14,
    color: COLOR.primary,
    fontWeight: 'bold',
  },
});
