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
import {useApi} from '../../../Backend/Api';
import {useToast} from '../../../Constants/ToastContext';
import {AuthContext} from '../../../Backend/AuthContent';
import CreateAccountModal from '../../../Modals/CreateAccountModal';

const {width} = Dimensions.get('window');

const Home = ({navigation}) => {
  const {postRequest} = useApi();
  const {user, showDemoCard, setShowDemoCard} = useContext(AuthContext);
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

  const [AppliedModalFilter,setAppliedModalFilter] = useState({})

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
      setLikedProperties(prev =>
        prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id],
      );
      GetProperties(1, false, appliedFilters, searchQuery, sortQuery);
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
          value.forEach(v => {
            formData.append(key.toLowerCase(), v);
          });
        } else if (value) {
          formData.append(key.toLowerCase(), value);
        }
      });
    } else {
      if (filters.BHK) formData.append('bhk', filters.BHK);
      if (filters.propertyType)
        formData.append('property_type', filters.propertyType);
      if (filters.minPrice) formData.append('min_price', filters.minPrice);
      if (filters.maxPrice) formData.append('max_price', filters.maxPrice);
      if (filters.minRoomSize) formData.append('min_area', filters.minRoomSize);
      if (filters.maxRoomSize) formData.append('max_area', filters.maxRoomSize);
      if (filters.furnishing)
        formData.append('furnishing_status', filters.furnishing);
      if (filters.availability)
        formData.append('availability', filters.availability);
      if (filters.bathrooms) formData.append('bathrooms', filters.bathrooms);
      if (filters.parking)
        formData.append('parking_available', filters.parking);
      if (filters.facing) formData.append('facing_direction', filters.facing);
      if (filters.advanceValue)
        formData.append('advance', filters.advanceValue);
      if (filters.familyTypeValue)
        formData.append('preferred_tenant_type', filters.familyTypeValue);
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
  }, [appliedFilters, searchQuery, sortQuery]);

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
      id: 'bhkOptions',
      type: 'BHK',
      name: 'BHK',
      data: ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK+'],
    },
    {
      id: 'propertyTypes',
      type: 'property_type',
      name: 'Property Type',
      data: ['Apartment', 'Flat', 'Villa'],
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

  const getSelectedValues = type => appliedFilters[type] || [];

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
              uri: user?.image,
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
          const displayText =
            selectedValues.length > 0
              ? selectedValues.join(', ')
              : filterGroup.name;
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
            )
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
                    setAppliedModalFilter({})
                    setAttendedFilter(null);
                    setSortQuery(null)
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
          console.log('selectedFilters:', selectedFilters);
          setAppliedModalFilter(prev => ({
            ...prev,
            ...selectedFilters
          }))
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
