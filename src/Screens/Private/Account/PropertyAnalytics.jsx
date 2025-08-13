import {View, Text, FlatList, Image} from 'react-native';
import React from 'react';
import Header from '../../../Components/FeedHeader';
import {COLOR} from '../../../Constants/Colors';

const PropertyAnalytics = ({navigation}) => {
  // Example data
  const propertyData = [
    {
      id: '1',
      name: 'Luxury Apartment',
      location: 'Mumbai, Maharashtra',
      price: '₹1.2 Cr',
      image:
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800',
      views: 120,
      likes: 45,
    },
    {
      id: '2',
      name: 'Cozy Villa',
      location: 'Jaipur, Rajasthan',
      price: '₹85 Lakh',
      image:
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800',
      views: 90,
      likes: 30,
    },
    {
      id: '3',
      name: 'Modern Studio',
      location: 'Delhi',
      price: '₹45 Lakh',
      image:
        'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800',
      views: 200,
      likes: 80,
    },
  ];

  const renderItem = ({item}) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 8,
        elevation: 2,
      }}>
      <Image
        source={{uri: item.image}}
        style={{width: 80, height: 80, borderRadius: 8, marginRight: 10}}
      />
      <View style={{flex: 1}}>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>{item.name}</Text>
        <Text style={{color: '#666', marginVertical: 2}}>{item.location}</Text>
        <Text
          style={{color: COLOR.primary, fontWeight: 'bold', marginVertical: 2}}>
          {item.price}
        </Text>
        <View style={{flexDirection: 'row', marginTop: 4}}>
          <Text style={{marginRight: 15}}>👀 {item.views}</Text>
          <Text>❤️ {item.likes}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{flex: 1, backgroundColor: COLOR.white}}>
      <Header
        title="Property Analytics"
        showBack
        onBackPress={() => {
          navigation.goBack();
        }}
      />

      <FlatList
        data={propertyData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{paddingVertical: 10}}
      />
    </View>
  );
};

export default PropertyAnalytics;
