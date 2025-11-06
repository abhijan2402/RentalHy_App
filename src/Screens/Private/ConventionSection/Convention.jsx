import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  TextInput,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
  Animated,
  Alert,
} from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Header from '../../../Components/FeedHeader';
import { COLOR } from '../../../Constants/Colors';
import { AnimatedButton, HomeHeader } from '../Dashboard/Home';
import SortModal from '../../../Components/SortModal';
import { windowWidth } from '../../../Constants/Dimensions';
import OptionSelector from '../Dashboard/OptionSelector';
import { showPost } from '../../../Constants/Data';
import { useIsFocused } from '@react-navigation/native';
import { AuthContext } from '../../../Backend/AuthContent';
import CreateAccountModal from '../../../Modals/CreateAccountModal';
import { useApi } from '../../../Backend/Api';
import LocationModal from '../../../Modals/LocationModal';
import MultiModal from '../../../Components/MultiModal';
import RenderFilterOptions from '../../../Components/renderFilterOptions';

const TabButton = ({ title, isActive, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.tab, isActive && styles.activeTab]}
      onPress={onPress}>
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const HallCard = ({
  image,
  title,
  description,
  location,
  capacity,
  price,
  priceType,
  ac,
  onBook,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Image
        source={{ uri: image?.hall && image?.hall[0]?.image_path }}
        style={styles.cardImage}
      />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDesc} numberOfLines={2}>
          {description}
        </Text>
        <Text style={styles.cardInfo}>📍 {location}</Text>
        <Text style={styles.cardInfo}>👥 Capacity: {capacity} people</Text>

        {/* AC + Price + Book Now in one row */}
        <View style={styles.bottomRow}>
          <View>
            <Text style={styles.cardInfo}>
              {ac ? '❄️ AC Available' : '🔥 Non-AC'}
            </Text>
            <Text
              style={[
                styles.cardInfo,
                { marginLeft: 5, fontWeight: '600', color: COLOR.primary },
              ]}>
              ₹ {price?.min_amount} - ₹{price?.max_amount}
            </Text>
          </View>
          <TouchableOpacity style={styles.bookBtn} onPress={onBook}>
            <Text style={styles.bookBtnText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ConventionHall = ({
  navigation,
  onPressSort,
  onPressFilter,
  currentStatus,
  setShowModal,
  avaialbleFilter,
  setavaialbleFilter,
  attendedFilter,
  setAttendedFilter,
  multiFilter,
  setMultiFilter,
  hallData,
  onHandleMore,
  loader,
  loadingMore,
  GetProperties,
  setAppliedFilters,
  setSearchQuery,
  setSortQuery,
  appliedFilters,
  searchQuery,
  sortQuery,
  AppliedModalFilter,
  setAppliedModalFilter,
  filterHeight,
  scrollOffset,
}) => {
  const onScrollFlatlist = event => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const diff = currentOffset - scrollOffset;

    if (diff > 10 && currentOffset > 40) {
      Animated.timing(filterHeight, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else if (diff < -10) {
      Animated.timing(filterHeight, {
        toValue: 40,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    scrollOffset = currentOffset;
  };
  const renderHall = ({ item }) => (
    <HallCard
      key={item.id}
      image={item?.images_grouped}
      title={item?.title}
      description={item?.description}
      location={item?.location}
      capacity={item?.seating_capacity}
      price={item}
      priceType={item?.priceType}
      ac={item.ac_available}
      onPress={() => {
        if (currentStatus === -1) {
          setShowModal(true);
        } else {
          navigation.navigate('PropertyDetail', {
            type: 'convention',
            propertyData: item,
          });
        }
      }}
      onBook={() =>
        navigation.navigate('Booking', {
          type: 'convention',
          propertyData: item?.id,
        })
      }
    />
  );

  return (
    <View style={styles.content}>
      <View style={styles.searchContainer}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/128/622/622669.png',
          }}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search Convention Halls or Location"
          style={styles.searchInput}
          placeholderTextColor={COLOR.grey}
          onChangeText={setSearchQuery}
          value={searchQuery}
        />

        <TouchableOpacity onPress={() => { }}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/54/54481.png',
            }}
            style={styles.filterIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressSort}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/4662/4662255.png',
            }}
            style={styles.filterIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressFilter}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/7693/7693332.png',
            }}
            style={styles.filterIcon}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          overflow: 'hidden',
          height: filterHeight,
          width: windowWidth - 40,
          alignSelf: 'center',
          backgroundColor: COLOR.white,
          justifyContent: 'center',
        }}>
        {RenderFilterOptions({
          avaialbleFilter,
          AppliedModalFilter,
          attendedFilter,
          setAppliedModalFilter,
          setAttendedFilter,
          setMultiFilter,
          COLOR,
          appliedFilters
        })}
      </View>

      <FlatList
        data={hallData}
        keyExtractor={(item, index) => item.id?.toString() ?? index.toString()}
        renderItem={renderHall}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        onEndReached={onHandleMore}
        onEndReachedThreshold={0.5}
        nestedScrollEnabled={true}
        // onScroll={onScrollFlatlist}
        refreshControl={
          <RefreshControl
            refreshing={loader}
            onRefresh={() => {
              setSortQuery(null);
              setAppliedFilters({});
              setAppliedModalFilter({});
              setAttendedFilter(null);
              GetProperties(
                1,
                false,
                appliedFilters,
                searchQuery,
                sortQuery,
                false,
              );
            }}
            colors={[COLOR.primary]}
            tintColor={COLOR.primary}
          />
        }
        ListEmptyComponent={() => {
          if (!loader) {
            return (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 50,
                }}>
                <Image
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/128/4076/4076549.png',
                  }}
                  style={{ width: 100, height: 100, tintColor: '#ccc' }}
                />
                <Text
                  style={{
                    fontSize: 16,
                    color: '#666',
                    marginTop: 10,
                    textAlign: 'center',
                    paddingHorizontal: 20,
                  }}>
                  No Convention Hall Found{'\n'}Try adjusting your filters or
                  search criteria.
                </Text>
              </View>
            );
          }
          return null;
        }}
        ListFooterComponent={
          loadingMore ? (
            <View style={{ padding: 16 }}>
              <ActivityIndicator size="small" color={COLOR.primary} />
            </View>
          ) : null
        }
      />
    </View>
  );
};

const FarmHouse = ({
  navigation,
  onPressSort,
  onPressFilter,
  currentStatus,
  setShowModal,
  avaialbleFilter,
  setavaialbleFilter,
  avaialbleFilterFarm,
  attendedFilter,
  setAttendedFilter,
  multiFilter,
  setMultiFilter,
  data,
  onHandleMore,
  loader,
  loadingMore,
  GetProperties,
  setAppliedFilters,
  setSearchQuery,
  setSortQuery,
  appliedFilters,
  searchQuery,
  sortQuery,
  AppliedModalFilter,
  setAppliedModalFilter,
  filterHeight,
  scrollOffset,
}) => {
  const renderHall = ({ item }) => {
    // console.log(item, 'ITEMMMMM');
    return (
      <HallCard
        key={item.id}
        image={item?.images_grouped}
        title={item?.title}
        description={item?.description}
        location={item?.address || item?.location}
        capacity={item?.seating_capacity}
        price={item}
        priceType={item?.priceType}
        ac={item.ac_available}
        onPress={() => {
          if (currentStatus === -1) {
            setShowModal(true);
          } else {
            navigation.navigate('PropertyDetail', {
              type: 'convention',
              propertyData: item,
            });
          }
        }}
        onBook={() =>
          navigation.navigate('Booking', {
            type: 'convention',
            propertyData: item?.id,
          })
        }
      />
    );
  };

  const onScrollFlatlist = event => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const diff = currentOffset - scrollOffset;

    if (diff > 10 && currentOffset > 40) {
      Animated.timing(filterHeight, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else if (diff < -10) {
      Animated.timing(filterHeight, {
        toValue: 40,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    scrollOffset = currentOffset;
  };
  return (
    <View style={styles.content}>
      <View style={styles.searchContainer}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/128/622/622669.png',
          }}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="search for Resort/Farm"
          style={styles.searchInput}
          placeholderTextColor={COLOR.grey}
          onChangeText={setSearchQuery}
          value={searchQuery}
        />

        <TouchableOpacity onPress={() => { }}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/54/54481.png',
            }}
            style={styles.filterIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressSort}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/4662/4662255.png',
            }}
            style={styles.filterIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressFilter}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/7693/7693332.png',
            }}
            style={styles.filterIcon}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          overflow: 'hidden',
          height: filterHeight,
          width: windowWidth - 40,
          alignSelf: 'center',
          backgroundColor: COLOR.white,
          justifyContent: 'center',
        }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {avaialbleFilterFarm.map(filterGroup => {
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
                  marginBottom: 10,
                  borderRadius: 5,
                  backgroundColor:
                    attendedFilter?.id == filterGroup?.id
                      ? COLOR.primary
                      : '#fff',
                  marginRight: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: 'bold',
                    color:
                      attendedFilter?.id == filterGroup?.id ? 'white' : '#333',
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

      <FlatList
        data={data}
        keyExtractor={(item, index) => item.id?.toString() ?? index.toString()}
        renderItem={renderHall}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        onEndReached={onHandleMore}
        onEndReachedThreshold={0.5}
        // onScroll={onScrollFlatlist}
        refreshControl={
          <RefreshControl
            refreshing={loader}
            onRefresh={() => {
              setSortQuery(null);
              setAppliedFilters({});
              setAppliedModalFilter({});
              setAttendedFilter(null);
              GetProperties(
                1,
                false,
                appliedFilters,
                searchQuery,
                sortQuery,
                false,
              );
            }}
            colors={[COLOR.primary]}
            tintColor={COLOR.primary}
          />
        }
        ListEmptyComponent={() => {
          if (!loader) {
            return (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 50,
                }}>
                <Image
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/128/4076/4076549.png',
                  }}
                  style={{ width: 100, height: 100, tintColor: '#ccc' }}
                />
                <Text
                  style={{
                    fontSize: 16,
                    color: '#666',
                    marginTop: 10,
                    textAlign: 'center',
                    paddingHorizontal: 20,
                  }}>
                  No Farm House Found{'\n'}Try adjusting your filters or search
                  criteria.
                </Text>
              </View>
            );
          }
          return null;
        }}
        ListFooterComponent={
          loadingMore ? (
            <View style={{ padding: 16 }}>
              <ActivityIndicator size="small" color={COLOR.primary} />
            </View>
          ) : null
        }
      />
    </View>
  );
};

const Convention = ({ navigation, route }) => {
  const filterHeight = useRef(new Animated.Value(40)).current;
  let scrollOffset = 0;

  const { currentAddress } = useContext(AuthContext);
  const { postRequest } = useApi();
  const type = route?.params?.type;
  const { currentStatus } = useContext(AuthContext);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastPage, setLastPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('convention');
  const [sortVisible, setSortVisible] = useState(false);
  const [tabLoader, settabLoader] = useState(false);
  const [defaultIndex, setdefaultIndex] = useState(type == 'farm' ? 3 : 2);
  const [hallData, setHallData] = useState([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortQuery, setSortQuery] = useState('');
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [multiFilter, setMultiFilter] = useState(false);
  const [attendedFilter, setAttendedFilter] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [AppliedModalFilter, setAppliedModalFilter] = useState({});
  const [avaialbleFilter, setavaialbleFilter] = useState([
    {
      id: 'priceRange',
      type: 'price',
      name: 'Price',
      data: [],
    },
    {
      id: 'seating_capacity',
      type: 'seating_capacity',
      name: 'Seating Capacity',
      data: [],
    },
    {
      id: 'time_of_occasion',
      type: 'time_of_occasion',
      name: 'Time of Occasion',
      data: ['Daytime', 'Night time', 'Full day'],
    },
    {
      id: 'ac_available',
      type: 'ac_available',
      name: 'A/C Available',
      state: 'boolean',
      data: ['Yes', 'No'],
    },
    {
      id: 'valet_parking',
      type: 'valet_parking',
      name: 'Valet Parking',
      state: 'boolean',
      data: ['Yes', 'No'],
    },
    {
      id: 'alcohol_allowed',
      type: 'alcohol_allowed',
      name: 'Alcohol Allowed',
      state: 'boolean',
      data: ['Yes', 'No'],
    },
    {
      id: 'royalty_decoration',
      type: 'royalty_decoration',
      name: 'Royalty for Decoration',
      state: 'boolean',
      data: ['Yes', 'No'],
    },
    {
      id: 'royalty_kitchen',
      type: 'royalty_kitchen',
      name: 'Royalty for Kitchen',
      state: 'boolean',
      data: ['Yes', 'No'],
    },
    {
      id: 'generator_available',
      type: 'generator_available',
      name: 'Generator Available',
      state: 'boolean',
      data: ['Yes', 'No'],
    },
    {
      id: 'photoshoot_all',
      type: 'photoshoot_all',
      name: 'Photo Shoot Allowed',
      state: 'boolean',
      data: ['Yes', 'No'],
    },
    {
      id: 'adult_games',
      type: 'adult_games',
      name: 'Children Games',
      state: 'boolean',
      data: ['Yes', 'No'],
    },
  ]);

  const [avaialbleFilterFarm, setavaialbleFilterFarm] = useState([
    {
      id: 'priceRange',
      type: 'price',
      name: 'Price',
      data: [],
    },
    {
      id: 'visit_type',
      type: 'visit_type',
      name: 'Visit type',
      data: [
        'Day',
        'Night',
        'Full Day',
        'Corporate',
        'Banquet hall',
        'Occassion Booking',
        'Room Booking',
        'Any other',
      ],
    },
    {
      id: 'ac_available',
      type: 'ac_available',
      name: 'A/C Available',
      state: 'boolean',
      data: ['Yes', 'No'],
    },
    {
      id: 'room_available',
      type: 'room_available',
      name: 'Room Available',
      state: 'boolean',
      data: ['Yes', 'No'],
    },
    {
      id: 'pool_type',
      type: 'pool_type',
      name: 'Pool type',
      data: ['Adult', 'Child', 'Both'],
    },
    {
      id: 'adult_games',
      type: 'adult_games',
      name: 'Adult Games',
      state: 'boolean',
      data: ['Yes', 'No'],
    },
    {
      id: 'children_games',
      type: 'children_games',
      name: 'Children Games',
      state: 'boolean',
      data: ['Yes', 'No'],
    },
    {
      id: 'Parking_available',
      type: 'Parking_available',
      name: 'Parking available',
      state: 'boolean',
      data: ['Yes', 'No'],
    },
    {
      id: 'Sound_system',
      type: 'Sound_system',
      name: 'Sound system',
      state: 'boolean',
      data: ['Yes', 'No'],
    },
  ]);

  const sortOptions = [
    { label: 'Price: Low to High', value: 'price_low_to_high' },
    { label: 'Price: High to Low', value: 'price_high_to_low' },
    { label: 'Nearby', value: 'nearby' },
    { label: 'Relavance', value: 'relevance' },
  ];
  const handleFilterChange = newFilters => {
    setAppliedFilters(newFilters);
    // setActiveTab(newFilters?.activeTab || 'farmhouse');
  };
  const isFocus = useIsFocused();

  useEffect(() => {
    settabLoader(true);
    console.log(type, 'TYPE');

    setTimeout(() => {
      if (type == 'farm') {
        setdefaultIndex(3);
        setActiveTab("farmhouse")
      }
      if (type == 'conv') {
        setdefaultIndex(2);
        setActiveTab("convention")
      }
      settabLoader(false);
    }, 0);
    return () => {
      settabLoader(false);
    };
  }, [isFocus]);

  useEffect(() => {
    if (isFocus) {
      console.log(activeTab, "TABBBB___");

      GetProperties(1, false, appliedFilters, '', '', false, activeTab);
    }
  }, [isFocus, activeTab]);

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
          if (value.length === 1 && (value[0] === 'Yes' || value[0] === 'No')) {
            formData.append(key.toLowerCase(), value[0] === 'Yes' ? 1 : 0);
          } else {
            value.forEach((v, i) => {
              formData.append(`${key.toLowerCase()}[${i}]`, v);
            });
          }
        } else if (value !== undefined && value !== null) {
          formData.append(key.toLowerCase(), value);
        }
      });
    } else {
      if (filters?.minCapacity)
        formData.append('seating_capacity_min', filters.minCapacity);
      if (filters?.maxCapacity)
        formData.append('seating_capacity_max', filters.maxCapacity);
      if (filters.acAvailable)
        formData.append('ac_available', filters.acAvailable == 'Yes' ? 1 : 0);
      if (filters.valetParking)
        formData.append('valet_parking', filters.valetParking == 'Yes' ? 1 : 0);
      if (filters.minPrice) formData.append('price_min', filters.minPrice);
      if (filters.maxPrice) formData.append('price_max', filters.maxPrice);
      if (filters.alcoholAllowed)
        formData.append(
          'alcohol_allowed',
          filters.alcoholAllowed == 'Yes' ? 1 : 0,
        );

      if (filters.royaltyDecoration)
        formData.append(
          'royalty_decoration',
          filters.royaltyDecoration == 'Yes' ? 1 : 0,
        );
      if (filters.royaltyKitchen)
        formData.append(
          'royalty_kitchen',
          filters.royaltyKitchen == 'Yes' ? 1 : 0,
        );

      if (filters.generator)
        formData.append(
          'generator_available',
          filters.generator == 'Yes' ? 1 : 0,
        );
      if (filters.drinkingWater)
        formData.append(
          'water_for_cooking',
          filters.drinkingWater == 'Yes' ? 1 : 0,
        );
      if (filters.cateringPersons)
        formData.append(
          'provides_catering_persons',
          filters.cateringPersons == 'Yes' ? 1 : 0,
        );
      if (filters.photoShootsAllowed)
        formData.append(
          'photographers_required',
          filters.photoShootsAllowed == 'Yes' ? 1 : 0,
        );
      if (filters.childrenGames)
        formData.append('adult_games', filters.childrenGames == 'Yes' ? 1 : 0);
      if (filters.timeOfOccasion)
        formData.append('occasion', filters.timeOfOccasion);
    }

    if (currentAddress?.lat) formData.append('lat', currentAddress.lat);
    if (currentAddress?.lng) formData.append('long', currentAddress.lng);

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
    activeTab = 'convention',
  ) => {
    if (pageNum === 1) settabLoader(true);
    else setLoadingMore(true);
    const formData = buildFormData(filters, pageNum, search, sort, isDynamic);

    let url =
      activeTab == 'convention'
        ? 'public/api/hall_listing'
        : 'public/api/farm_listing';
    const response = await postRequest(url, formData, true);
    const resData = response?.data?.data;
    // console.log(resData, 'DATATTATAT');

    const newProperties = resData?.data || [];
    setLastPage(resData?.last_page || 1);

    if (append) {
      setHallData(prev => [...prev, ...newProperties]);
    } else {
      setHallData(newProperties);
    }

    setPage(resData?.current_page || 1);
    settabLoader(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    // console.log("I___M_CALLED");
    // console.log(activeTab, "ACTIVE___TAB");

    GetProperties(
      1,
      false,
      appliedFilters,
      searchQuery,
      sortQuery,
      false,
      activeTab,
    );
  }, [appliedFilters, searchQuery, sortQuery, currentAddress, activeTab]);

  const handleLoadMore = () => {
    if (!loadingMore && page < lastPage) {
      GetProperties(
        page + 1,
        true,
        appliedFilters,
        searchQuery,
        sortQuery,
        false,
        activeTab,
      );
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      }}>
      <StatusBar backgroundColor={COLOR.white} barStyle="dark-content" />
      <HomeHeader
        setLocationModalVisible={setLocationModalVisible}
        navigation={navigation}
      />
      {tabLoader ? (
        <View style={{ height: 115 }}></View>
      ) : (
        <OptionSelector
          navigation={navigation}
          defaultIndex={defaultIndex}
          data={showPost}
          onSelect={(item, index) => {
            if (index == 2) {
              setActiveTab('convention');
              setdefaultIndex(2);
              GetProperties(
                1,
                false,
                appliedFilters,
                searchQuery,
                sortQuery,
                false,
                'convention',
              );
              setAppliedFilters({});
              setSearchQuery('');
              setSearchQuery('');
              setAppliedModalFilter({});
            } else {
              setActiveTab('farmhouse');
              setdefaultIndex(3);
              GetProperties(
                1,
                false,
                appliedFilters,
                searchQuery,
                sortQuery,
                false,
                'farmhouse',
              );
              setAppliedFilters({});
              setSearchQuery('');
              setSearchQuery('');
              setAppliedModalFilter({});
            }
          }}
        />
      )}
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              GetProperties(
                1,
                false,
                appliedFilters,
                searchQuery,
                sortQuery,
                false,
                activeTab,
              );
              setSearchQuery('');
              setAppliedFilters({});
              setAppliedModalFilter({});
              setAttendedFilter(null);
            }}
            colors={[COLOR.primary]}
            tintColor={COLOR.primary}
          />
        }>
        {activeTab === 'convention' ? (
          <ConventionHall
            loader={tabLoader}
            hallData={hallData}
            navigation={navigation}
            onPressSort={() => {
              setSortVisible(true);
            }}
            currentStatus={currentStatus}
            setShowModal={() => {
              setModalVisible(true);
            }}
            onPressFilter={() =>
              navigation.navigate('ConventionMainFilter', {
                onApplyFilter: handleFilterChange,
                existingFilters: appliedFilters,
                modalFilters: AppliedModalFilter,
                setAppliedModalFilter: setAppliedModalFilter,
              })
            }
            onHandleMore={() => {
              handleLoadMore();
            }}
            setAppliedFilters={setAppliedFilters}
            setSortQuery={setSortQuery}
            appliedFilters={appliedFilters}
            searchQuery={searchQuery}
            sortQuery={sortQuery}
            GetProperties={GetProperties}
            loadingMore={loadingMore}
            setSearchQuery={setSearchQuery}
            avaialbleFilter={avaialbleFilter}
            setavaialbleFilter={setavaialbleFilter}
            setAttendedFilter={setAttendedFilter}
            attendedFilter={attendedFilter}
            setMultiFilter={setMultiFilter}
            MultiFilter={multiFilter}
            AppliedModalFilter={AppliedModalFilter}
            setAppliedModalFilter={setAppliedModalFilter}
            Animated={Animated}
            filterHeight={filterHeight}
            scrollOffset={scrollOffset}
          />
        ) : (
          <FarmHouse
            currentStatus={currentStatus}
            loader={tabLoader}
            data={hallData}
            onPressSort={() => {
              setSortVisible(true);
            }}
            setShowModal={() => {
              setModalVisible(true);
            }}
            navigation={navigation}
            onPressFilter={() => {
              navigation.navigate('ConventionFilter', {
                onApplyFilter: handleFilterChange,
                existingFilters: appliedFilters,
                modalFilters: AppliedModalFilter,
              });
            }}
            onHandleMore={() => {
              handleLoadMore();
            }}
            setAppliedFilters={setAppliedFilters}
            setSortQuery={setSortQuery}
            appliedFilters={appliedFilters}
            searchQuery={searchQuery}
            sortQuery={sortQuery}
            GetProperties={GetProperties}
            loadingMore={loadingMore}
            setSearchQuery={setSearchQuery}
            avaialbleFilter={avaialbleFilter}
            setavaialbleFilter={setavaialbleFilter}
            setAttendedFilter={setAttendedFilter}
            attendedFilter={attendedFilter}
            setMultiFilter={setMultiFilter}
            MultiFilter={multiFilter}
            AppliedModalFilter={AppliedModalFilter}
            setAppliedModalFilter={setAppliedModalFilter}
            avaialbleFilterFarm={avaialbleFilterFarm}
            Animated={Animated}
            filterHeight={filterHeight}
            scrollOffset={scrollOffset}
          />
        )}
      </ScrollView>
      <AnimatedButton
        title={
          activeTab === 'convention'
            ? 'Upload Convention Hall'
            : 'Upload Farm House'
        }
        onPress={() =>
          navigation.navigate('CreateConvention', { activeTabKey: activeTab })
        }
        iconUrl={'https://cdn-icons-png.flaticon.com/128/3211/3211467.png'}
      />
      <SortModal
        sortOptions={sortOptions}
        type={'Convention'}
        visible={sortVisible}
        onClose={() => setSortVisible(false)}
        onSelectSort={sortType => {
          setSortQuery(sortType);
        }}
      />
      <CreateAccountModal
        visible={modalVisible}
        onCreateAccount={() => {
          setModalVisible(false);
        }}
        onCancel={() => setModalVisible(false)}
      />

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

      <LocationModal
        visible={locationModalVisible}
        onClose={() => setLocationModalVisible(false)}
        onCancel={() => setLocationModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default Convention;

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,

    borderColor: '#ddd',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: COLOR.primary || '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#555',
  },
  activeTabText: {
    fontWeight: 'bold',
    color: COLOR.primary || '#007AFF',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 160,
  },
  cardBody: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  cardInfo: {
    fontSize: 13,
    color: '#444',
    marginBottom: 2,
  },
  bookBtn: {
    marginTop: 8,
    backgroundColor: COLOR.primary || '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  bookBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  bookBtn: {
    backgroundColor: COLOR.primary || '#007AFF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  bookBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
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

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // margin: 12,
    marginVertical: 10,
    backgroundColor: COLOR.white,
    borderRadius: 10,
    paddingHorizontal: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingVertical: 8,
    // marginHorizontal: 20,
  },
  searchIcon: { width: 20, height: 20, tintColor: COLOR.grey, marginRight: 8 },
  searchInput: {
    // flex: 0.7,
    paddingVertical: 8,
    fontSize: 14,
    color: COLOR.black,
    width: windowWidth / 2,
  },
  filterIcon: { width: 22, height: 22, tintColor: COLOR.primary, marginLeft: 8 },
});
