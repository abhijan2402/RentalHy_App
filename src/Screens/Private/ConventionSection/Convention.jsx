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
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Header from '../../../Components/FeedHeader';
import {COLOR} from '../../../Constants/Colors';
import {AnimatedButton, HomeHeader} from '../Dashboard/Home';
import SortModal from '../../../Components/SortModal';
import {windowWidth} from '../../../Constants/Dimensions';
import OptionSelector from '../Dashboard/OptionSelector';
import {showPost} from '../../../Constants/Data';
import {useIsFocused} from '@react-navigation/native';
import {AuthContext} from '../../../Backend/AuthContent';
import CreateAccountModal from '../../../Modals/CreateAccountModal';
import {useApi} from '../../../Backend/Api';
import LocationModal from '../../../Modals/LocationModal';

const TabButton = ({title, isActive, onPress}) => {
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
        source={{uri: image?.hall && image?.hall[0]?.image_path}}
        style={styles.cardImage}
      />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDesc}>{description}</Text>
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
                {marginLeft: 5, fontWeight: '600', color: COLOR.primary},
              ]}>
              ₹ {price?.min_amount} -/- ₹{price?.max_amount}
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
}) => {
  const renderHall = ({item}) => (
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
          navigation.navigate('PropertyDetail', {type: 'convention', propertyData: item});
        }
      }}
      onBook={() => navigation.navigate('Booking', {type: 'convention'})}
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

        <TouchableOpacity onPress={onPressSort}>
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

      <FlatList
        data={hallData}
        keyExtractor={(item, index) => item.id?.toString() ?? index.toString()}
        renderItem={renderHall}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 20}}
        onEndReached={onHandleMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={loader}
            onRefresh={() => {
              setSortQuery(null);
              setAppliedFilters({});
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
  );
};

const FarmHouse = ({navigation, onPressSort, onPressFilter}) => {
  const farms = [
    {
      id: 1,
      image:
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=60',
      title: 'Green Valley Farm',
      description: 'Peaceful farmhouse surrounded by greenery.',
      location: 'Hilltop Area',
      capacity: 200,
      price: 1500,
      priceType: 'per day',
      ac: true,
    },
    {
      id: 2,
      image:
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=60',
      title: 'Sunset Farm',
      description: 'Perfect weekend getaway with scenic sunset views.',
      location: 'Countryside Road',
      capacity: 150,
      price: 400,
      priceType: 'per hour',
      ac: false,
    },
  ];

  return (
    <ScrollView style={styles.content}>
      <View style={styles.searchContainer}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/128/622/622669.png',
          }}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search Farm "
          style={styles.searchInput}
          placeholderTextColor={COLOR.grey}
        />
        <TouchableOpacity onPress={onPressSort}>
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
        <TouchableOpacity
          // onPress={() =>
          //   navigation.navigate('Filter', {onApplyFilter: handleFilterChange})
          // }
          onPress={onPressFilter}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/7693/7693332.png',
            }}
            style={styles.filterIcon}
          />
        </TouchableOpacity>
      </View>
      {farms.map(farm => (
        <HallCard
          key={farm.id}
          image={farm.image}
          title={farm.title}
          description={farm.description}
          location={farm.location}
          capacity={farm.capacity}
          price={farm.price}
          priceType={farm.priceType}
          ac={farm.ac}
          onBook={() => navigation.navigate('Booking', {type: 'farmHouse'})}
          onPress={() => {
            if (currentStatus == -1) {
              setShowModal(true);
            } else {
              navigation.navigate('PropertyDetail', {type: 'convention'});
            }
          }}
        />
      ))}
    </ScrollView>
  );
};

const Convention = ({navigation, route}) => {
  const {currentAddress} = useContext(AuthContext);

  const {postRequest} = useApi();
  const type = route?.params?.type;
  const {currentStatus} = useContext(AuthContext);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastPage, setLastPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('convention'); // default tab
  const [sortVisible, setSortVisible] = useState(false);
  const [tabLoader, settabLoader] = useState(false);
  const [defaultIndex, setdefaultIndex] = useState(type == 'farm' ? 3 : 2);
  const [hallData, setHallData] = useState([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortQuery, setSortQuery] = useState('');
  const [locationModalVisible, setLocationModalVisible] = useState(false);

  const [appliedFilters, setAppliedFilters] = useState([]);
  const sortOptions = [
    {label: 'Price: Low to High', value: 'price_low_to_high'},
    {label: 'Price: High to Low', value: 'price_high_to_low'},
    {label: 'Newest', value: 'newest_first'},
    {label: 'Oldest', value: 'oldest_first'},
  ];
  const handleFilterChange = newFilters => {
    setAppliedFilters(newFilters);
  };
  const isFocus = useIsFocused();

  useEffect(() => {
    settabLoader(true);
    setTimeout(() => {
      if (type == 'farm') {
        setdefaultIndex(2);
      }
      if (type == 'conv') {
        setdefaultIndex(1);
      }
      settabLoader(false);
    }, 0);
    return () => {
      settabLoader(false);
    };
  }, [isFocus]);

  useEffect(() => {
    if (isFocus) {
      GetProperties(1, false, appliedFilters, '', false);
    }
  }, [isFocus]);

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
  ) => {
    if (pageNum === 1) settabLoader(true);
    else setLoadingMore(true);
    const formData = buildFormData(filters, pageNum, search, sort, isDynamic);
    const response = await postRequest(
      'public/api/hall_listing',
      formData,
      true,
    );
    const resData = response?.data?.data;
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

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      }}>
      {/* <Header title={'Convention Space'} /> */}
      <StatusBar backgroundColor={COLOR.white} barStyle="dark-content" />

      <HomeHeader
        setLocationModalVisible={setLocationModalVisible}
        navigation={navigation}
      />
      {tabLoader ? (
        <View style={{height: 115}}></View>
      ) : (
        <OptionSelector
          navigation={navigation}
          defaultIndex={defaultIndex}
          data={showPost}
          onSelect={(item, index) => {
            console.log('Selected:', item, index);
            if (index == 1) {
              setActiveTab('convention');
              setdefaultIndex(1);
            } else {
              setActiveTab('farmhouse');
              setdefaultIndex(2);
            }
          }}
        />
      )}

      {/* Render Components */}
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
        />
      ) : (
        <FarmHouse
          currentStatus={currentStatus}
          setShowModal={() => {
            setModalVisible(true);
          }}
          navigation={navigation}
          onPressSort={() => setSortVisible(true)}
          onPressFilter={() => {
            navigation.navigate('ConventionFilter', {
              onApplyFilter: handleFilterChange,
            });
          }}
        />
      )}
      <AnimatedButton
        title="Upload a Hall/Farm"
        onPress={() => navigation.navigate('CreateConvention')}
        iconUrl={'https://cdn-icons-png.flaticon.com/128/3211/3211467.png'}
      />
      <SortModal
        sortOptions={sortOptions}
        type={'Convention'}
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
    </View>
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
  searchIcon: {width: 20, height: 20, tintColor: COLOR.grey, marginRight: 8},
  searchInput: {
    // flex: 0.7,
    paddingVertical: 8,
    fontSize: 14,
    color: COLOR.black,
    width: windowWidth / 2,
  },
  filterIcon: {width: 22, height: 22, tintColor: COLOR.primary, marginLeft: 8},
});
