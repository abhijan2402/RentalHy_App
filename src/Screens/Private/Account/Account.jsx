import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Header from '../../../Components/FeedHeader';
import { COLOR } from '../../../Constants/Colors';
import CustomButton from '../../../Components/CustomButton';
import { AuthContext } from '../../../Backend/AuthContent';
import CreateAccountModal from '../../../Modals/CreateAccountModal';
import { useIsFocused } from '@react-navigation/native';

const Account = ({ navigation }) => {
  const { setUser } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const { currentStatus } = useContext(AuthContext);
  const isFocus = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);
  const profileUser = user?.user || user?.data?.user || user;
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
      id: 377,
      title: 'Reward Management',
      icon: 'https://cdn-icons-png.flaticon.com/128/3179/3179668.png',
      navigate: 'Reward',
    },
    {
      id: 2,
      title: 'Fav Properties',
      icon: 'https://cdn-icons-png.flaticon.com/512/833/833472.png',
      navigate: 'Wishlist',
    },
     {
      id: 222,
      title: 'Manage Space',
      icon: 'https://cdn-icons-png.flaticon.com/128/3009/3009489.png',
      navigate: 'Management',
    },

    {
      id: 15,
      title: 'Chat',
      icon: 'https://cdn-icons-png.flaticon.com/128/811/811476.png',
      navigate: 'ChatList',
    },
    {
      id: 7,
      title: 'Property Analytics',
      icon: 'https://cdn-icons-png.flaticon.com/128/602/602175.png',
      navigate: 'PropertyAnalytics',
    },
    {
      id: 18,
      title: 'Convention/Hall Orders',
      icon: 'https://cdn-icons-png.flaticon.com/128/9752/9752284.png',
      navigate: 'SpaceOrders',
    },
    {
      id: 8,
      title: 'Hostel Management',
      icon: 'https://cdn-icons-png.flaticon.com/128/10607/10607354.png',
      navigate: 'HostelReviewManagement',
    },
    {
      id: 119,
      title: 'Hotel Management',
      icon: 'https://cdn-icons-png.flaticon.com/128/3009/3009489.png',
      navigate: 'HotelManagement',
    },
    
  
    {
      id: 190,
      title: 'Hotel Booking Management',
      icon: 'https://cdn-icons-png.flaticon.com/128/3009/3009489.png',
      navigate: 'HotelBookings',
    },
    {
      id: 9,
      title: 'My Bookings',
      icon: 'https://cdn-icons-png.flaticon.com/128/2460/2460875.png',
      navigate: 'MyBooking',
    },
    {
      id: 19,
      title: 'Space Management',
      icon: 'https://cdn-icons-png.flaticon.com/128/1067/1067566.png',
      navigate: 'SpaceManagement',
    },
    {
      id: 10,
      title: 'Bank Account Details',
      icon: 'https://cdn-icons-png.flaticon.com/128/2830/2830289.png',
      navigate: 'BankAccount',
    },
    {
      id: 3,
      title: 'Terms & Conditions',
      icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828940.png',
      navigate: 'Cms',
      params: {
        title: `Terms & Conditions`,
        slug: 'terms-conditions',
      },
    },

    {
      id: 4,
      title: 'Privacy Policy',
      icon: 'https://cdn-icons-png.flaticon.com/512/471/471662.png',
      navigate: 'Cms',
      params: {
        title: `Privacy Policy`,
        slug: 'privacy-policy',
      },
    },
    {
      id: 5,
      title: 'Support',
      icon: 'https://cdn-icons-png.flaticon.com/128/1067/1067566.png',
      navigate: 'SupportList',
    },
  ];
  useEffect(() => {
    if (isFocus) {
      if (currentStatus == -1) {
        setModalVisible(true);
      }
    }
  }, [isFocus, currentStatus]);

  return (
    <View style={styles.container}>
      <Header
        title={'Account'}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageRing}>
            <Image
              source={{ uri: profileUser?.image || profileImage }}
              style={styles.profileImage}
            />
          </View>
          <View style={styles.profileCopy}>
            <Text style={styles.welcomeText}>Welcome back</Text>
            <Text style={styles.profileName} numberOfLines={1}>
              {profileUser?.first_name || 'Your Account'}
            </Text>
            <Text style={styles.profileEmail} numberOfLines={1}>
              {profileUser?.email}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.quickEditButton}
            onPress={() => navigation.navigate('EditProfile')}>
            <Text style={styles.quickEditText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Account & management</Text>
        <View style={styles.tabContainer}>
          {tabs.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.tabItem,
                index < tabs.length - 1 && styles.tabItemBorder,
              ]}
              activeOpacity={0.7}
              onPress={() => navigation.navigate(item.navigate, item.params)}>
              <View style={styles.tabLeft}>
                <View style={styles.iconContainer}>
                  <Image source={{ uri: item.icon }} style={styles.leftIcon} />
                </View>
                <Text style={styles.tabText}>{item.title}</Text>
              </View>
              <Image source={{ uri: arrowIcon }} style={styles.arrowIcon} />
            </TouchableOpacity>
          ))}
        </View>
        <CustomButton
          title={'Log Out'}
          style={styles.logoutButton}
          textStyle={styles.logoutText}
          onPress={() => {
            setUser('');
          }}
        />
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
      </ScrollView>
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 20,
    backgroundColor: COLOR.primary,
    shadowColor: '#590205',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 5,
  },
  profileImageRing: {
    padding: 3,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  profileImage: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 2,
    borderColor: COLOR.white,
  },
  profileCopy: {
    flex: 1,
    marginLeft: 14,
  },
  welcomeText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    marginBottom: 2,
  },
  profileName: {
    fontSize: 21,
    fontWeight: '700',
    color: COLOR.white,
  },
  profileEmail: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.82)',
    marginTop: 4,
  },
  quickEditButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  quickEditText: {
    color: COLOR.white,
    fontSize: 12,
    fontWeight: '700',
  },
  sectionTitle: {
    marginTop: 26,
    marginBottom: 10,
    marginLeft: 4,
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  tabContainer: {
    backgroundColor: COLOR.white,
    borderRadius: 18,
    paddingHorizontal: 14,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#111827',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  tabItem: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  tabLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF1F1',
    marginRight: 12,
  },
  leftIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  arrowIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    tintColor: '#999',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
  },
  logoutButton: {
    marginTop: 22,
    width: '100%',
    backgroundColor: COLOR.white,
    borderWidth: 1,
    borderColor: '#F1C7C9',
    borderRadius: 15,
  },
  logoutText: {
    color: COLOR.primary,
    fontWeight: '700',
  },
});
