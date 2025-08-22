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
  Animated,
  ScrollView,
} from 'react-native';
import {COLOR} from '../../../Constants/Colors';
import PropertyCard from '../../../Components/PropertyCard';
import CustomButton from '../../../Components/CustomButton';
import MultiModal from '../../../Components/MultiModal';
import SortModal from '../../../Components/SortModal';
import LottieView from 'lottie-react-native';
import {windowHeight, windowWidth} from '../../../Constants/Dimensions';
import OptionSelector from './OptionSelector';
import {showPost} from '../../../Constants/Data';
import {useIsFocused} from '@react-navigation/native';
import { useApi } from '../../../Backend/Api';

const {width} = Dimensions.get('window');

const Home = ({navigation}) => {
  const {postRequest} = useApi();
  const focus = useIsFocused();
  const banners = [
    'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1200',
    'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=1200',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
  ];
  const [loader, setloader] = useState(true);

  const [properties , setProperties] = useState([]);

  const GetProperties = async () => {
    setloader(true);
    const response = await postRequest('public/api/properties');
    setProperties(response?.data?.data?.data);
    setloader(false)
  }


  useEffect(() => {
    if(focus){
      GetProperties();
    }
  },[focus])


  const animationRef = useRef();
  const [tabLoader, settabLoader] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);
  const bannerRef = useRef(null);
  const [multiFilter, setMultiFilter] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState([
    'Family',
    '2 BHK',
    'Jaipur',
  ]); // demo filters
  // Auto-scroll banners
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     const nextIndex = (bannerIndex + 1) % banners.length;
  //     setBannerIndex(nextIndex);
  //     bannerRef.current.scrollToIndex({index: nextIndex, animated: true});
  //   }, 3000);

  //   return () => clearInterval(timer);
  // }, [bannerIndex]);

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

  const [attendedFilter, setAttendedFilter] = useState([]);
  const [sortVisible, setSortVisible] = useState(false);

  const [avaialbleFilter, setavaialbleFilter] = useState([
    {
      id: 'price',
      type: 'price',
      data: [],
    },
    {
      id: 'bhkOptions',
      type: 'bhk',
      data: ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK+'],
    },
    {
      id: 'commercialSpace',
      type: 'Commercial Space',
      data: ['Yes', 'No'],
    },
    {
      id: 'familyType',
      type: 'Tenant Type',
      data: ['Family', 'Bachelors Male', 'Bachelors Female'],
    },
    {
      id: 'propertyTypes',
      type: 'property Type',
      data: ['Apartment', 'Flat', 'Villa'],
    },
    {
      id: 'furnishingOptions',
      type: 'furnishing',
      data: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
    },
    {
      id: 'availabilityOptions',
      type: 'availability',
      data: ['Ready to Move', 'Under Construction'],
    },
    {
      id: 'bathroomOptions',
      type: 'bathroom',
      data: ['1', '2', '3', '4+'],
    },
    {
      id: 'parkingOptions',
      type: 'parking',
      data: ['Car', 'Bike', 'Both', 'None'],
    },
    {
      id: 'advance',
      type: 'advance',
      data: ['1 month', '2 months', '3 months+', 'No Advance'],
    },
  ]);

  useEffect(() => {
    animationRef.current?.play(30, 120);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setloader(false);
    }, 1000);
  }, []);
  const isFocus = useIsFocused();
  useEffect(() => {
    settabLoader(true);
    setTimeout(() => {
      settabLoader(false);
    }, 10);
  }, [isFocus]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLOR.white} barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <Image
            source={{
              uri: 'https://i.postimg.cc/59BKnJZJ/second-page-1.jpg',
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
      {tabLoader ? (
        <View style={{height: 115}}></View>
      ) : (
        <OptionSelector
          navigation={navigation}
          defaultIndex={0}
          data={showPost}
          onSelect={(item, index) => {
            console.log('Selected:', item, index);
          }}
        />
      )}
      <DemoCard />
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
        <TouchableOpacity onPress={() => {}}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/54/54481.png',
            }}
            style={styles.filterIcon}
          />
        </TouchableOpacity>
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

      {/* Properties Grid */}
      {loader ? (
        <>
          <LottieView
            ref={animationRef}
            source={require('../../../assets/Lottie/Loading1.json')}
            style={styles.image}
          />
          <View style={styles.flagcontainer}>
            <Image
              source={{uri: 'https://flagcdn.com/w20/in.png'}}
              style={styles.flag}
            />
            <Text style={styles.text}>Made in India</Text>
            <Image
              source={{uri: 'https://flagcdn.com/w20/in.png'}}
              style={styles.flag}
            />
          </View>
          <View style={styles.flagcontainer}>
            <Image
              source={{uri: 'https://flagcdn.com/w20/in.png'}}
              style={styles.flag}
            />
            <Text style={styles.text}>Made for India</Text>
            <Image
              source={{uri: 'https://flagcdn.com/w20/in.png'}}
              style={styles.flag}
            />
          </View>
        </>
      ) : (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{marginVertical: 2, marginLeft: 20}}>
            {avaialbleFilter.map(filterGroup => (
              <TouchableOpacity
                onPress={() => {
                  console.log(filterGroup, 'IFIFIFIFFI');
                  setAttendedFilter(filterGroup.data);
                  setMultiFilter(true);
                }}
                key={filterGroup.id}
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  borderRadius: 5,
                  backgroundColor: COLOR.white,
                  marginRight: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: 'bold',
                    color: '#333',
                    height: 20,
                    textTransform: 'capitalize',
                    textAlignVertical: 'center',
                  }}>
                  {filterGroup.type}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

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
        </>
      )}
      {!loader && (
        <AnimatedButton
          onPress={() => navigation.navigate('PostProperty')}
          iconUrl={'https://cdn-icons-png.flaticon.com/128/2163/2163350.png'}
        />
      )}
      <MultiModal
        filterValueData={attendedFilter}
        visible={multiFilter}
        initialSelected={[]} // pass existing selected if you want to preselect
        onClose={() => setMultiFilter(false)}
        onSelectSort={selectedFilters => {
          console.log('Applied Filters:', selectedFilters); // array of filters
        }}
      />
      <SortModal
        visible={sortVisible}
        onClose={() => setSortVisible(false)}
        onSelectSort={sortType => {
          console.log('Selected Sort:', sortType);
        }}
      />
    </SafeAreaView>
  );
};

export default Home;
export const AnimatedButton = ({onPress, title = 'Post Property', iconUrl}) => {
  const fadeAnim = useRef(new Animated.Value(1)).current; // fully visible
  const floatAnim = useRef(new Animated.Value(0)).current; // initial Y position
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10, // move up 10px
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0, // move back down
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);
  return (
    <Animated.View
      style={{
        position: 'absolute',
        bottom: 50,
        right: 20,
        opacity: fadeAnim,
        transform: [{translateY: floatAnim}],
      }}>
      <TouchableOpacity
        style={{
          backgroundColor: COLOR.primary,
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: 10,
          elevation: 4,
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onPress={onPress}>
        <Image
          source={{
            uri: iconUrl,
          }}
          style={{width: 25, height: 25}}
        />
        <Text
          style={{
            color: '#fff',
            fontWeight: 'bold',
            marginLeft: 10,
          }}>
          {title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
export const DemoCard = ({
  title = 'App Demo video',
  buttonText = 'Click here',
  onPress,
}) => {
  return (
    <View
      style={{
        borderWidth: 0.5,
        borderColor: COLOR.lightGrey,
        marginHorizontal: 20,
        marginVertical: 8,
        padding: 15,
        paddingVertical: 10,
        backgroundColor: COLOR.primary,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <Text
        style={{
          color: '#fff',
          fontSize: 16,
          fontWeight: '500',
        }}>
        {title}
      </Text>

      <TouchableOpacity
        onPress={onPress}
        style={{
          backgroundColor: 'rgba(255,255,255,0.2)',
          paddingVertical: 8,
          paddingHorizontal: 15,
          borderRadius: 10,
          alignSelf: 'flex-start',
        }}>
        <Text style={{color: '#fff', fontWeight: '600'}}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};
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
    width: 45,
    height: 30,
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
    // marginTop: 15, // extra space from top
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
  image: {
    width: windowWidth,
    height: windowHeight * 0.3,
  },

  flagcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 30,
    // borderWidth: 2,
    // borderColor: '#FF9933', // saffron
    // backgroundColor: '#fdfdfd',
    // shadowColor: '#000',
    // shadowOpacity: 0.15,
    // shadowOffset: {width: 0, height: 3},
    // shadowRadius: 5,
    // elevation: 4,
    marginHorizontal: 20,
    marginBottom: 5,
  },
  flag: {
    width: 20,
    height: 15,
    resizeMode: 'contain',
    marginHorizontal: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    color: '#138808', // green
    letterSpacing: 1,
  },
});
