import {
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {COLOR} from '../../../Constants/Colors';
import {AnimatedButton, HomeHeader} from '../Dashboard/Home';
import OptionSelector from '../Dashboard/OptionSelector';
import {propertiesFake, showPost} from '../../../Constants/Data';
import {useIsFocused} from '@react-navigation/native';
import SortModal from '../../../Components/SortModal';
import {windowWidth} from '../../../Constants/Dimensions';
import PropertyCard from '../../../Components/PropertyCard';
import CreateAccountModal from '../../../Modals/CreateAccountModal';
import {AuthContext} from '../../../Backend/AuthContent';

const Hostel = ({navigation}) => {
  const [tabLoader, settabLoader] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const {currentStatus} = useContext(AuthContext);
  const sortOptions = [
    {label: 'Price: Low to High', value: 'price_low_to_high'},
    {label: 'Price: High to Low', value: 'price_high_to_low'},
    {label: 'Nearest', value: 'Nearest'},
    {label: 'Farthest', value: 'Farthest'},
  ];
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
      <ScrollView>
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
            onPress={() => navigation.navigate('HostelFilterScreen')}>
            {/* // () =>
                  // navigation.navigate('Filter', {onApplyFilter: handleFilterChange}) */}

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
            renderItem={({item}) => <PropertyCard item={item} type={'home'} />}
            keyExtractor={item => item.id?.toString()}
            numColumns={2}
            contentContainerStyle={{paddingBottom: 20, marginHorizontal: 10}}
            showsVerticalScrollIndicator={false}
            // onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            // refreshControl={
            //   <RefreshControl
            //     refreshing={loader}
            //     onRefresh={() => {
            //       setAppliedModalFilter({});
            //       setAttendedFilter(null);
            //       setSortQuery(null);
            //       GetProperties(
            //         1,
            //         false,
            //         appliedFilters,
            //         searchQuery,
            //         sortQuery,
            //         false,
            //       );
            //     }}
            //     colors={[COLOR.primary]} // Android
            //     tintColor={COLOR.primary} // iOS
            //   />
            // }
            // ListFooterComponent={
            //   loadingMore ? (
            //     <View style={{padding: 16}}>
            //       <ActivityIndicator size="small" color={COLOR.primary} />
            //     </View>
            //   ) : null
            // }
          />
        </View>
      </ScrollView>
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
          // setSortQuery(sortType);
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
