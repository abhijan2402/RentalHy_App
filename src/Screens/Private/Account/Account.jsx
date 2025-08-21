import React, {useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Header from '../../../Components/FeedHeader';
import {COLOR} from '../../../Constants/Colors';
import CustomButton from '../../../Components/CustomButton';
import {AuthContext} from '../../../Backend/AuthContent';

const Account = ({navigation}) => {
  const {setUser} = useContext(AuthContext);
  const {user} = useContext(AuthContext);

  const profileImage =
    'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'; // default profile icon

  const arrowIcon = 'https://cdn-icons-png.flaticon.com/512/271/271228.png'; // right arrow icon

  const tabs = [
    {
      id: 1,
      title: 'Edit Profile',
      icon: 'https://cdn-icons-png.flaticon.com/512/2922/2922561.png',
      navigate: 'EditProfile',
    },
    {
      id: 2,
      title: 'Fav Properties',
      icon: 'https://cdn-icons-png.flaticon.com/512/833/833472.png',
      navigate: 'Wishlist',
    },
    {
      id: 7,
      title: 'Property Analytics',
      icon: 'https://cdn-icons-png.flaticon.com/128/602/602175.png',
      navigate: 'PropertyAnalytics',
    },
    {
      id: 8,
      title: 'Convention/Hall Orders',
      icon: 'https://cdn-icons-png.flaticon.com/128/9752/9752284.png',
      navigate: 'SpaceOrders',
    },
    {
      id: 9,
      title: 'My Bookings',
      icon: 'https://cdn-icons-png.flaticon.com/128/2460/2460875.png',
      navigate: 'MyBooking',
    },
    {
      id: 3,
      title: 'Terms & Conditions',
      icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828940.png',
      navigate: 'Cms',
      params: {
        title: `Terms & Conditions`,
        slug: 'terms-condition',
      },
    },

    {
      id: 4,
      title: 'About Us',
      icon: 'https://cdn-icons-png.flaticon.com/512/471/471662.png',
      navigate: 'Cms',
      params: {
        title: `About Us`,
        slug: 'about-us',
      },
    },
    {
      id: 5,
      title: 'Support',
      icon: 'https://cdn-icons-png.flaticon.com/128/1067/1067566.png',
      navigate: 'SupportList',
    },
  ];

  return (
    <View style={styles.container}>
      <Header title={'Account'} showBack />

      <ScrollView contentContainerStyle={{paddingBottom: 20}}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={{uri: user?.image || profileImage}}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{user?.name}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {tabs.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.tabItem}
              activeOpacity={0.7}
              onPress={() => navigation.navigate(item.navigate, item.params)}>
              <View style={styles.tabLeft}>
                <Image source={{uri: item.icon}} style={styles.leftIcon} />
                <Text style={styles.tabText}>{item.title}</Text>
              </View>
              <Image source={{uri: arrowIcon}} style={styles.arrowIcon} />
            </TouchableOpacity>
          ))}
        </View>
        <CustomButton
          title={'Log Out'}
          style={{marginTop: '10%'}}
          onPress={() => {
            setUser('');
          }}
        />
      </ScrollView>
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.white,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: COLOR.white || '#f9f9f9',
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLOR.black,
  },
  profileEmail: {
    fontSize: 14,
    color: COLOR.GRAY,
    marginTop: 4,
  },
  tabContainer: {
    marginTop: 20,
    backgroundColor: COLOR.white,
  },
  tabItem: {
    backgroundColor: COLOR.white,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginHorizontal: 25,
    marginVertical: 6,
    borderRadius: 10,
    borderWidth: 0.8,
    borderColor: COLOR.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: COLOR.primary,
  },
  tabLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginRight: 12,
  },
  arrowIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    tintColor: '#999',
  },
  tabText: {
    fontSize: 16,
    color: COLOR.black,
  },
});
