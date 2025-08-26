import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Header from '../../Components/FeedHeader';
import {COLOR} from '../../Constants/Colors';
import {renderProperty} from './Dashboard/Home';
import PropertyCard from '../../Components/PropertyCard';
import {useApi} from '../../Backend/Api';
import {useIsFocused} from '@react-navigation/native';
import {AuthContext} from '../../Backend/AuthContent';
import CreateAccountModal from '../../Modals/CreateAccountModal';
import {useToast} from '../../Constants/ToastContext';

const Wishlist = ({navigation}) => {
  const {getRequest, postRequest} = useApi();
  const {showToast} = useToast();
  const isFocus = useIsFocused();
  const [isLoading, setIsLoading] = useState(false);
  const [propertyData, setPropertyData] = useState([]);
  const {currentStatus} = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const removewishlist = async id => {
    const response = await postRequest(`public/api/wishlist/remove/${id}`);
    if (response.data?.status) {
      showToast('Removed from wishlist successfully', 'success');
      getData();
    }
  };

  const getData = async () => {
    setIsLoading(true);
    const response = await getRequest('public/api/wishlist/stats');
    if (response.data?.status) {
      setPropertyData(response.data?.data);
      setIsLoading(false);
    } else {
      setPropertyData([]);
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isFocus) {
      getData();
    }
  }, [isFocus]);
  // useEffect(() => {
  //   if (isFocus) {
  //     if (currentStatus == -1) {
  //       setModalVisible(true);
  //     }
  //   }
  // }, [isFocus]);

  return (
    <View style={styles.container}>
      <Header
        title={'Wishlist'}
        showBack
        onBackPress={() => {
          navigation.goBack();
        }}
      />

      {/* Property Grid */}
      {isLoading ? (
        <ActivityIndicator
          size={'large'}
          color={COLOR?.primary}
          style={{top: '30%'}}
        />
      ) : (
        <FlatList
          data={propertyData}
          renderItem={({item}) => (
            <PropertyCard
              showDelete={true}
              item={item}
              type={'wishlist'}
              removewishlist={removewishlist}
            />
          )}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No properties found</Text>
            </View>
          )}
        />
      )}
      <CreateAccountModal
        visible={modalVisible}
        onCreateAccount={() => {
          console.log('Navigate to signup screen');
          setModalVisible(false);
        }}
        onCancel={() => {
          setModalVisible(false);
          navigation.goBack();
        }}
      />
    </View>
  );
};

export default Wishlist;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLOR.white},
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
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    // marginHorizontal: 10,
  },
  card: {
    backgroundColor: COLOR.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
    width: '48%',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  propertyImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  wishlistIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLOR.white,
    padding: 4,
    borderRadius: 20,
    elevation: 3,
  },
  propertyName: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 8,
    marginHorizontal: 6,
    color: COLOR.black,
  },
  propertyLocation: {
    fontSize: 12,
    marginHorizontal: 6,
    color: COLOR.grey,
  },
  propertyPrice: {
    fontSize: 14,
    marginHorizontal: 6,
    marginTop: 4,
    color: COLOR.primary,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 400,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLOR.black,
    fontWeight: 500,
  },
});
