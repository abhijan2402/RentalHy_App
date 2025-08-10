import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {COLOR} from '../../Constants/Colors';
import CustomButton from '../../Components/CustomButton';
import strings from '../../localization/en';

const {width, height} = Dimensions.get('window');
const slides = [
  {
    key: '1',
    title: 'Find Your Dream Property',
    description:
      'Browse thousands of listings and discover the perfect home, apartment, or land that fits your needs.',
    image:
      'https://www.tribecacare.com/wp-content/uploads/2022/07/Edinburgh-Property-management.jpg',
  },
  {
    key: '2',
    title: 'List Your Property Easily',
    description:
      'Sell faster by listing your property with detailed photos, descriptions, and pricing in just minutes.',
    image:
      'https://www.crescent-builders.com/blog/wp-content/uploads/2021/07/Handshake-over-Property-Deal.original-e1619002308793.jpg',
  },
  {
    key: '3',
    title: 'Track Your Deals',
    description:
      'Stay updated on buyer inquiries, offers, and negotiations to close your deals smoothly.',
    image:
      'https://images.squarespace-cdn.com/content/v1/666ca4a15f960973478ddc7f/7e8db128-f9a7-4ab7-bdf9-7d6096a1c78e/Screen+Shot+2024-06-14+at+6.36.44+PM.png',
  },
];

const OnBoarding = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef();

  const handleScroll = event => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current.scrollToIndex({index: currentIndex + 1});
    } else {
      navigation.navigate('Login');
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.slide}>
      <Image
        source={{uri: item.image}}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        keyExtractor={item => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentIndex === index && styles.activeDot]}
            />
          ))}
        </View>
        <CustomButton
          title={currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          style={{marginBottom: 20}}
        />
      </View>
    </View>
  );
};

export default OnBoarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.white,
  },
  slide: {
    width: width,
    alignItems: 'center',
    // padding: 20,
  },
  image: {
    height: height * 0.5,
    width: width,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLOR.black,
    textAlign: 'center',
    marginTop: 20,
  },
  description: {
    fontSize: 15,
    color: COLOR.black,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 15,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  dot: {
    height: 8,
    width: 8,
    backgroundColor: '#ccc',
    borderRadius: 4,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: COLOR.primary || '#007AFF',
    width: 20,
  },
});
