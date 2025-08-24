import {View, Text, FlatList, Image, TouchableOpacity} from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../../Components/FeedHeader';
import {COLOR} from '../../../Constants/Colors';
import { useApi } from '../../../Backend/Api';
import { useIsFocused } from '@react-navigation/native';

const PropertyAnalytics = ({navigation}) => {
   const {getRequest} = useApi();
   const isFocus = useIsFocused();
   const [loader , setloader] = useState(true);
   const [propertyData , setPropertyData] = useState([
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
    ]);

    const getPropertyData = async() => {
      setloader(true);
      const response = await getRequest('public/api/my-property');
      console.log('Property Analytics Data: ', response);
      if (response?.data?.status) {
        setPropertyData(response.data.data);
      }
      setloader(false);
    }

    useEffect(() => {
      if(isFocus)
        getPropertyData();
    }, [isFocus]);

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('PropertyDetail', {propertyData: item});
      }}
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
        source={{uri: item?.images[0]?.image_path}}
        style={{width: 80, height: 80, borderRadius: 8, marginRight: 10}}
      />
      <View style={{flex: 1}}>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>{item.title}</Text>
        <Text style={{color: '#666', marginVertical: 2}}>{item.location}</Text>
        <Text
          style={{color: COLOR.primary, fontWeight: 'bold', marginVertical: 2}}>
          {'₹' + item.price}
        </Text>
        <View style={{flexDirection: 'row', marginTop: 4}}>
          <Text style={{marginRight: 15}}>👀 {item.total_views}</Text>
          <Text>❤️ {item.wishlist_count}</Text>
        </View>
      </View>
    </TouchableOpacity>
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
