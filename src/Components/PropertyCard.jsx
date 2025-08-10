// PropertyCard.js
import React from 'react';
import {TouchableOpacity, Image, Text, View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {COLOR} from '../Constants/Colors';

const PropertyCard = ({item, toggleLike}) => {
  const navigation = useNavigation();
  const isLiked = true; // replace with real like state

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('PropertyDetail', {propertyId: item.id});
      }}
      style={styles.card}>
      <Image source={{uri: item.image}} style={styles.propertyImage} />

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

      <Text style={styles.propertyName}>{item.name}</Text>
      <Text style={styles.propertyLocation}>{item.location}</Text>
      <Text style={styles.propertyPrice}>{item.price}</Text>
    </TouchableOpacity>
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
