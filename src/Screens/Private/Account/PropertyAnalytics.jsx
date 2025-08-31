import {View, Text, FlatList, Image, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../../Components/FeedHeader';
import {COLOR} from '../../../Constants/Colors';
import {useApi} from '../../../Backend/Api';
import {useIsFocused} from '@react-navigation/native';

const PropertyAnalytics = ({navigation}) => {
  const {getRequest} = useApi();
  const isFocus = useIsFocused();
  const [loader, setloader] = useState(true);
  const [propertyData, setPropertyData] = useState([]);

  const getPropertyData = async () => {
    setloader(true);
    const response = await getRequest('public/api/my-property');
    console.log('Property Analytics Data: ', response);
    if (response?.data?.status) {
      setPropertyData(response.data.data);
    }
    setloader(false);
  };

  useEffect(() => {
    if (isFocus) getPropertyData();
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
        source={
          item?.images?.length > 0 && item?.images[0]?.image_path
            ? {uri: item.images[0].image_path}
            : {uri: 'https://cdn-icons-png.flaticon.com/128/25/25694.png'} // 👈 your fallback image
        }
        style={{width: 80, height: 80, borderRadius: 8, marginRight: 10}}
      />
      <View style={{flex: 1}}>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>{item?.title}</Text>
        <Text style={{color: '#666', marginVertical: 2}}>{item?.location}</Text>
        <Text
          style={{color: COLOR.primary, fontWeight: 'bold', marginVertical: 2}}>
          {'₹' + item?.price}
        </Text>
        <View style={{flexDirection: 'row', marginTop: 4}}>
          <Text style={{marginRight: 15}}>👀 {item?.total_views}</Text>
          <Text>❤️ {item?.wishlist_count}</Text>
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
