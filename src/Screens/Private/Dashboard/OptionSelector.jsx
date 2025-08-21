import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, Dimensions} from 'react-native';
import {COLOR} from '../../../Constants/Colors';

const {width: windowWidth, height: windowHeight} = Dimensions.get('window');

const OptionSelector = ({data, onSelect, navigation, defaultIndex = 0}) => {
  console.log(defaultIndex, 'IDNEXXX');

  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);

  const handlePress = (item, index) => {
    setSelectedIndex(index); // ✅ update immediately
    onSelect?.(item, index);

    // navigation logic
    if (index === 0) {
      navigation.navigate('Home');
    } else if (index === 1) {
      navigation.navigate('Convention', {type: 'conv'});
    } else {
      navigation.navigate('Convention', {type: 'farm'});
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        alignSelf: 'center',
      }}>
      {data?.map((item, index) => {
        const isSelected = selectedIndex === index;

        return (
          <TouchableOpacity
            key={index}
            onPress={() => handlePress(item, index)}
            style={{
              width: windowWidth / 3.3,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              height: windowHeight * 0.12,
              marginHorizontal: 4,
              marginVertical: 10,
              elevation: 4,
              backgroundColor: COLOR.white,
              shadowColor: COLOR.primary,
              borderWidth: isSelected ? 2 : 0,
              borderColor: isSelected ? COLOR.primary : 'transparent',
            }}>
            <Image
              source={{uri: item?.image}}
              style={{width: 45, height: 45, marginBottom: 5}}
            />
            <View
              style={{
                backgroundColor: isSelected ? COLOR.primary : COLOR.lightGrey,
                width: '100%',
                paddingVertical: 6,
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
                height: 45,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: 'white',
                  textAlignVertical: 'center',
                }}>
                {item?.title}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default OptionSelector;
