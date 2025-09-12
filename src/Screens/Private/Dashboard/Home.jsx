import React, {useRef, useEffect, useState, useContext} from 'react';
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
  ActivityIndicator,
  RefreshControl,
  PermissionsAndroid,
} from 'react-native';
import {COLOR} from '../../../Constants/Colors';
import PropertyCard from '../../../Components/PropertyCard';
import MultiModal from '../../../Components/MultiModal';
import SortModal from '../../../Components/SortModal';
import LottieView from 'lottie-react-native';
import {windowHeight, windowWidth} from '../../../Constants/Dimensions';
import OptionSelector from './OptionSelector';
import {showPost} from '../../../Constants/Data';
import {useIsFocused} from '@react-navigation/native';
import {useApi} from '../../../Backend/Api';
import {useToast} from '../../../Constants/ToastContext';
import {AuthContext} from '../../../Backend/AuthContent';
import CreateAccountModal from '../../../Modals/CreateAccountModal';
import LocationModal from '../../../Modals/LocationModal';
import {getCityFromAddress} from '../../../utils/helper';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';

const {width} = Dimensions.get('window');

const Home = ({navigation}) => {
  Geocoder.init('AIzaSyDzX3Hm6mNG2It5znswq-2waUHj8gVUCVk');
  const {postRequest} = useApi();
  const {
    user,
    showDemoCard,
    setShowDemoCard,
    currentAddress,
    setCurrentAddress,
  } = useContext(AuthContext);

  const {currentStatus} = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);

  const {showToast} = useToast();
  const focus = useIsFocused();
  const [loader, setloader] = useState(true);
  const [properties, setProperties] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [likedProperties, setLikedProperties] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [sortQuery, setSortQuery] = useState('');
  const [multiFilter, setMultiFilter] = useState(false);
  const [attendedFilter, setAttendedFilter] = useState([]);
  const [locationModalVisible, setLocationModalVisible] = useState(false);

  const [AppliedModalFilter, setAppliedModalFilter] = useState({});

  const toggleLike = async id => {
    const formdata = new FormData();
    formdata.append('property_id', id);
    const response = await postRequest(
      'public/api/wishlist/add',
      formdata,
      true,
    );
    if (response?.data?.status) {
      showToast(response?.data?.message, 'success');
      GetProperties(1, false, appliedFilters, searchQuery, sortQuery);
      setLikedProperties(prev =>
        prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id],
      );
    } else {
      showToast(response?.error, 'error');
    }
  };

  const handleFilterChange = newFilters => {
    setAppliedFilters(newFilters);
  };

  const removeFilter = filter => {
    setAppliedFilters(appliedFilters.filter(f => f !== filter));
  };

  const buildFormData = (
    filters,
    pageNum = 1,
    search = '',
    sort = '',
    isDynamic = false,
  ) => {
    const formData = new FormData();
    formData.append('page', pageNum);

    if (isDynamic) {
      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v, i) => {
            formData.append(`${key.toLowerCase()}[${i}]`, v);
          });
        } else if (value) {
          formData.append(key.toLowerCase(), value);
        }
      });
    } else {
      if (filters.BHK) {
        filters.BHK.forEach((v, i) => formData.append(`bhk[${i}]`, v));
      }

      if (filters.propertyType) {
        filters.propertyType.forEach((v, i) =>
          formData.append(`property_type[${i}]`, v),
        );
      }

      if (filters.minPrice) formData.append('min_price', filters.minPrice);
      if (filters.maxPrice) formData.append('max_price', filters.maxPrice);

      if (filters.minRoomSize) formData.append('min_area', filters.minRoomSize);
      if (filters.maxRoomSize) formData.append('max_area', filters.maxRoomSize);

      if (filters.furnishing) {
        filters.furnishing.forEach((v, i) =>
          formData.append(`furnishing_status[${i}]`, v),
        );
      }

      if (filters.availability) {
        filters.availability.forEach((v, i) =>
          formData.append(`availability[${i}]`, v),
        );
      }

      if (filters.bathrooms) {
        filters.bathrooms.forEach((v, i) =>
          formData.append(`bathrooms[${i}]`, v),
        );
      }

      if (filters.parking) {
        filters.parking.forEach((v, i) =>
          formData.append(`parking_available[${i}]`, v),
        );
      }

      if (filters.facing) {
        filters.facing.forEach((v, i) =>
          formData.append(`facing_direction[${i}]`, v),
        );
      }

      if (filters.advanceValue) {
        filters.advanceValue.forEach((v, i) =>
          formData.append(`advance[${i}]`, v),
        );
      }

      if (filters.familyTypeValue) {
        filters.familyTypeValue.forEach((v, i) =>
          formData.append(`preferred_tenant_type[${i}]`, v),
        );
      }
      if (filters.selectedCommercialSpace) {
        filters.familyTypeValue.forEach((v, i) =>
          formData.append(`commercial_space[${i}]`, v),
        );
      }

      if (filters.selectedFloor) {
        filters.selectedFloor.forEach((v, i) =>
          formData.append(`floor[${i}]`, v),
        );
      }

      if (currentAddress?.lat) formData.append('lat', currentAddress.lat);
      if (currentAddress?.lng) formData.append('long', currentAddress.lng);
    }

    if (search && search.trim() !== '') {
      formData.append('search', search.trim());
    }

    if (sort && sort.trim() !== '') {
      formData.append('sort_by', sort.trim());
    }

    return formData;
  };

  const GetProperties = async (
    pageNum = 1,
    append = false,
    filters = appliedFilters,
    search = searchQuery,
    sort = sortQuery,
    isDynamic = false,
  ) => {
    if (pageNum === 1) setloader(true);
    else setLoadingMore(true);

    const formData = buildFormData(filters, pageNum, search, sort, isDynamic);
    const response = await postRequest('public/api/properties', formData, true);
    const resData = response?.data?.data;

    const newProperties = resData?.data || [];
    setLastPage(resData?.last_page || 1);

    if (append) {
      setProperties(prev => [...prev, ...newProperties]);
    } else {
      setProperties(newProperties);
    }

    setPage(resData?.current_page || 1);
    setloader(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    if (focus) {
      GetProperties(1, false, appliedFilters, searchQuery, sortQuery, false);
      setShowDemoCard(false);
    }
  }, [focus]);

  useEffect(() => {
    GetProperties(1, false, appliedFilters, searchQuery, sortQuery, false);
  }, [appliedFilters, searchQuery, sortQuery, currentAddress]);

  const handleLoadMore = () => {
    if (!loadingMore && page < lastPage) {
      GetProperties(
        page + 1,
        true,
        appliedFilters,
        searchQuery,
        sortQuery,
        false,
      );
    }
  };

  const animationRef = useRef();
  const [tabLoader, settabLoader] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);
  const [avaialbleFilter, setavaialbleFilter] = useState([
    {
      id: 'priceRange',
      type: 'price',
      name: 'Price Range',
      data: [],
    },
    {
      id: 'commercial_space',
      type: 'commercial_space',
      name: 'Commercial Space',
      data: ['Shop', 'Office', 'Warehouse', 'Showroom', 'Restaurant', 'Hotel'],
    },
    {
      id: 'bhkOptions',
      type: 'BHK',
      name: 'BHK',
      data: ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK+'],
    },
    {
      id: 'propertyTypes',
      type: 'property_type',
      name: 'Property Type',
      data: [
        'Apartment',
        'Flat',
        'Villa',
        'Independent House',
        'Duplex',
        'Roof sheets',
        'Tiled House',
      ],
    },
    {
      id: 'furnishingOptions',
      type: 'furnishing_status',
      name: 'Furnishing Status',
      data: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
    },
    {
      id: 'availabilityOptions',
      type: 'availability',
      name: 'Availability',
      data: ['Ready to Move', 'Under Construction'],
    },
    {
      id: 'floor',
      type: 'floor',
      name: 'Floor Options',
      data: ['Ground Floor', '1st', '2nd', '3rd', '4th', '5th', '6th+'],
    },
    {
      id: 'bathroomOptions',
      type: 'bathrooms',
      name: 'Bathrooms',
      data: ['1', '2', '3', '4+'],
    },
    {
      id: 'parkingOptions',
      type: 'parking_available',
      name: 'Parking Available',
      data: ['Car', 'Bike', 'Both', 'None'],
    },
    {
      id: 'advance',
      type: 'advance',
      name: 'Advance',
      data: ['1 month', '2 months', '3 months+'],
    },
    {
      id: 'familyType',
      type: 'preferred_tenant_type',
      name: 'Family Type',
      data: ['Family', 'Bachelors male', 'Bachelors female'],
    },
  ]);
  const sortOptions = [
    {label: 'Price: Low to High', value: 'price_low_to_high'},
    {label: 'Price: High to Low', value: 'price_high_to_low'},
    {label: 'Newest', value: 'newest_first'},
    {label: 'Oldest', value: 'oldest_first'},
  ];

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

  const [locationStatus, setLocationStatus] = useState('Checking location...');

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        console.log(
          granted,
          'GRANNNTEDDDD',
          PermissionsAndroid.RESULTS.GRANTED,
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          setLocationStatus('Location permission denied.');
        }
      } catch (err) {
        console.log('Permission error:', err);
        setLocationStatus('Permission error.');
      }
    } else if (Platform.OS === 'ios') {
      // iOS prompts automatically when using navigator.geolocation
      getCurrentLocation();
    } else {
      setLocationStatus('Unsupported platform.');
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      async pos => {
        console.log('POS (coarse):', pos);
        const {latitude, longitude} = pos.coords;
        setLocationStatus(`Latitude: ${latitude}, Longitude: ${longitude}`);

        try {
          const geoResponse = await Geocoder.from(latitude, longitude);
          const address = geoResponse.results[0].formatted_address;
          console.log('Full Address:', address);
          setLocationStatus(
            `Latitude: ${latitude}, Longitude: ${longitude}, Address: ${address}`,
          );
          setCurrentAddress({
            lat: latitude,
            lng: longitude,
            address: address,
          });
        } catch (geoErr) {
          console.log('Geocoding error:', geoErr);
          setLocationStatus(
            `Latitude: ${latitude}, Longitude: ${longitude}, Address: not found`,
          );
        }
      },
      err => {
        console.log('Error (coarse):', err);
        setLocationStatus(`Error: ${err.message}`);
      },
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 10000},
    );
  };

  useEffect(() => {
    requestPermission();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLOR.white} barStyle="dark-content" />

      {/* Header */}
      <HomeHeader
        setLocationModalVisible={setLocationModalVisible}
        navigation={navigation}
      />
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
      {showDemoCard && <DemoCard />}
      <View style={styles.searchContainer}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/128/622/622669.png',
          }}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search Properties or Location"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          placeholderTextColor={COLOR.grey}
        />
        <TouchableOpacity
          onPress={() => {
            GetProperties(
              1,
              false,
              appliedFilters,
              searchQuery,
              sortQuery,
              false,
            );
          }}>
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
            navigation.navigate('Filter', {
              onApplyFilter: handleFilterChange,
              existingFilters: appliedFilters,
            })
          }>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/7693/7693332.png',
            }}
            style={styles.filterIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={{width: windowWidth - 40, alignSelf: 'center'}}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={
            {
              // marginVertical: 2,
              // marginLeft: 20,
              // // borderWidth: 1,
              // flex: 0.5,
              // height: 44,
              // borderWidth: 1,
              // width: windowWidth,
            }
          }>
          {avaialbleFilter.map(filterGroup => {
            const selectedValues = AppliedModalFilter[filterGroup.type] || [];
            let displayText = filterGroup.name;

            if (filterGroup.type === 'price') {
              const minP = AppliedModalFilter.min_price;
              const maxP = AppliedModalFilter.max_price;
              if (minP !== undefined && maxP !== undefined) {
                displayText = `₹${minP} - ₹${maxP}`;
              }
            } else if (selectedValues.length > 0) {
              displayText = selectedValues.join(', ');
            }
            return (
              <TouchableOpacity
                onPress={() => {
                  setAttendedFilter(filterGroup);
                  setMultiFilter(true);
                }}
                key={filterGroup.id}
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 5,
                  backgroundColor:
                    attendedFilter?.id == filterGroup?.id
                      ? COLOR.primary
                      : '#fff',
                  marginRight: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  // height: 55,
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: 'bold',
                    color:
                      attendedFilter?.id == filterGroup?.id ? 'white' : '#333',
                    height: 20,
                    textTransform: 'capitalize',
                    textAlignVertical: 'center',
                  }}>
                  {displayText}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Properties Grid */}
      {showDemoCard && loader ? (
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
          <View style={{flex: 1}}>
            <FlatList
              data={properties}
              renderItem={({item}) => (
                <PropertyCard
                  item={item}
                  toggleLike={toggleLike}
                  type={'home'}
                />
              )}
              keyExtractor={item => item.id?.toString()}
              numColumns={2}
              contentContainerStyle={{paddingBottom: 20, marginHorizontal: 10}}
              showsVerticalScrollIndicator={false}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              refreshControl={
                <RefreshControl
                  refreshing={loader}
                  onRefresh={() => {
                    setAppliedModalFilter({});
                    setAttendedFilter(null);
                    setSortQuery(null);
                    GetProperties(
                      1,
                      false,
                      appliedFilters,
                      searchQuery,
                      sortQuery,
                      false,
                    );
                  }}
                  colors={[COLOR.primary]} // Android
                  tintColor={COLOR.primary} // iOS
                />
              }
              ListFooterComponent={
                loadingMore ? (
                  <View style={{padding: 16}}>
                    <ActivityIndicator size="small" color={COLOR.primary} />
                  </View>
                ) : null
              }
            />
          </View>
        </>
      )}
      {!loader && (
        <AnimatedButton
          onPress={() => {
            if (currentStatus == -1) {
              setModalVisible(true);
            } else {
              navigation.navigate('PostProperty');
            }
          }}
          iconUrl={'https://cdn-icons-png.flaticon.com/128/2163/2163350.png'}
        />
      )}
      <MultiModal
        filterValueData={attendedFilter}
        visible={multiFilter}
        initialSelected={AppliedModalFilter}
        onClose={() => {
          setMultiFilter(false);
        }}
        onSelectSort={selectedFilters => {
          setAppliedModalFilter(prev => ({
            ...prev,
            ...selectedFilters,
          }));
          GetProperties(
            1,
            false,
            selectedFilters,
            searchQuery,
            sortQuery,
            true,
          );
        }}
      />
      <SortModal
        sortOptions={sortOptions}
        visible={sortVisible}
        onClose={() => setSortVisible(false)}
        onSelectSort={sortType => {
          console.log('Selected Sort:', sortType);
          setSortQuery(sortType);
        }}
      />
      <CreateAccountModal
        visible={modalVisible}
        onCreateAccount={() => {
          console.log('Navigate to signup screen');
          setModalVisible(false);
        }}
        onCancel={() => setModalVisible(false)}
      />

      <LocationModal
        visible={locationModalVisible}
        onClose={() => setLocationModalVisible(false)}
        onCancel={() => setLocationModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default Home;

export const AnimatedButton = ({onPress, title = 'Post Property', iconUrl}) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
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

export const HomeHeader = ({navigation, setLocationModalVisible}) => {
  const {user, currentAddress} = useContext(AuthContext);
  const CityName = getCityFromAddress(currentAddress?.address);

  return (
    <View style={styles.header}>
      <View style={styles.locationContainer}>
        <Image
          source={{
            uri: 'https://i.postimg.cc/59BKnJZJ/second-page-1.jpg',
          }}
          style={styles.locationIcon}
        />
        <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center', width: '50%'}}
          onPress={() => setLocationModalVisible(true)}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/684/684908.png',
            }}
            style={[styles.locationIcon, {width: 25, height: 25}]}
          />

          <View>
            <Text style={styles.locationCity}>{CityName || 'Not Found'}</Text>
            <Text style={styles.locationAddress} numberOfLines={1}>
              {currentAddress?.address || 'Not Found'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Image
          source={{
            uri: user?.image
              ? user?.image
              : 'https://cdn-icons-png.flaticon.com/128/1077/1077114.png',
          }}
          style={styles.profileIcon}
        />
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
    marginRight: 5,
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
    color: '#138808',
    letterSpacing: 1,
  },
});
