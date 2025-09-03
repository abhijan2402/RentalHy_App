import {
  FlatList,
  Image,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {COLOR} from '../../../Constants/Colors';
import {AnimatedButton, HomeHeader} from '../Dashboard/Home';
import OptionSelector from '../Dashboard/OptionSelector';
import {showPost} from '../../../Constants/Data';
import {useIsFocused} from '@react-navigation/native';
import SortModal from '../../../Components/SortModal';
import {windowWidth} from '../../../Constants/Dimensions';
import PropertyCard from '../../../Components/PropertyCard';
import CreateAccountModal from '../../../Modals/CreateAccountModal';
import {AuthContext} from '../../../Backend/AuthContent';
import { useApi } from '../../../Backend/Api';

const Hostel = ({navigation}) => {
  const {postRequest} = useApi()
  const [propertiesFake , setpropertiesFake] = useState([]);
  const [tabLoader, settabLoader] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [sortQuery, setSortQuery] = useState('');
  const {currentStatus , currentAddress} = useContext(AuthContext);
  const sortOptions = [
    {label: 'Price: Low to High', value: 'price_low_high'},
    {label: 'Price: High to Low', value: 'price_high_low'},
    {label: 'Newest', value: 'newest_first'},
    {label: 'Oldest', value: 'oldest_first'},
  ];
  const isFocus = useIsFocused();
  useEffect(() => {
    settabLoader(true);
    setTimeout(() => {
      settabLoader(false);
    }, 10);
  }, [isFocus]);

   const handleFilterChange = newFilters => {
    setAppliedFilters(newFilters);
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
      if (filters.selectedRoomTypes) formData.append('room_types[0]', filters.selectedRoomTypes);
      if (filters.selectedGenders) formData.append('genders[0]', filters.selectedGenders);
      if (filters.minPrice) formData.append('min_price', filters.minPrice);
      if (filters.maxPrice) formData.append('max_price', filters.maxPrice);
      if (filters.selectedFacilities) formData.append('facilities[0]', filters.selectedFacilities);
      if (filters.selectedFoodOptions) formData.append('food_options[0]', filters.selectedFoodOptions);
      if (filters.selectedStayTypes) formData.append('stay_types[0]', filters.selectedStayTypes);
      if (filters.selectedOccupancy) formData.append('occupancy_capacity', filters.selectedOccupancy);
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
    if (pageNum === 1) settabLoader(true);
    else setLoadingMore(true);
    const formData = buildFormData(filters, pageNum, search, sort, isDynamic);

    console.log(formData,"formDataformData")
    const response = await postRequest(
      'public/api/hostels/list',
      formData,
      true,
    );
    const resData = response?.data?.data;
    const newProperties = resData || [];
    setLastPage(resData?.last_page || 1);

    if (append) {
      setpropertiesFake(prev => [...prev, ...newProperties]);
    } else {
      setpropertiesFake(newProperties);
    }

    setPage(resData?.current_page || 1);
    settabLoader(false);
    setLoadingMore(false);
  };

  useEffect(() => {
      if (isFocus) {
        GetProperties(1, false, appliedFilters, '', false);
      }
    }, [isFocus]);


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
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLOR.white} barStyle="dark-content" />
      <HomeHeader navigation={navigation} />
      {tabLoader ? (
        <View style={{height: 115}}></View>
      ) : (
        <OptionSelector
          navigation={navigation}
          defaultIndex={1}
          data={showPost}
          onSelect={(item, index) => {
            console.log('Selected:', item, index);
          }}
        />
      )}
        <View style={styles.searchContainer}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/622/622669.png',
            }}
            style={styles.searchIcon}
          />
          <TextInput
            value={searchQuery}
            placeholder="Search Convention Halls or Location"
            style={styles.searchInput}
            placeholderTextColor={COLOR.grey}
            onChangeText={setSearchQuery}

          />

          <TouchableOpacity onPress={() => setSortVisible(true)}>
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
            onPress={() => navigation.navigate('HostelFilterScreen',{
              onApplyFilter: handleFilterChange,
              existingFilters: appliedFilters,
            })}>

            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/128/7693/7693332.png',
              }}
              style={styles.filterIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={{flex: 1}}>
          <FlatList
            data={propertiesFake}
            renderItem={({item}) => <PropertyCard item={item} type={'hostel'} />}
            keyExtractor={item => item.id?.toString()}
            numColumns={2}
            contentContainerStyle={{paddingBottom: 20, marginHorizontal: 10}}
            showsVerticalScrollIndicator={false}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl
                refreshing={tabLoader}
                onRefresh={() => {
                  setSearchQuery('');
                  setSortQuery('');
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
                colors={[COLOR.primary]} 
                tintColor={COLOR.primary} 
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
      <AnimatedButton
        title="Upload Hostel"
        onPress={() => {
          if (currentStatus == -1) {
            setModalVisible(true);
          } else {
            navigation.navigate('PostHostel');
          }
        }}
        iconUrl={'https://cdn-icons-png.flaticon.com/128/648/648539.png'}
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
          setModalVisible(false);
        }}
        onCancel={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default Hostel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.white,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
    marginHorizontal: 20,
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
