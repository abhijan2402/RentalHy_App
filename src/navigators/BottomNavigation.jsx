import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Platform, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LanguageContext } from '../localization/LanguageContext';
import Home from '../Screens/Private/Dashboard/Home';
import Account from '../Screens/Private/Account/Account';
import { COLOR } from '../Constants/Colors';
import Wishlist from '../Screens/Private/Wishlist';
import Convention from '../Screens/Private/ConventionSection/Convention';
import Hostel from '../Screens/Private/HostelSection/Hostel';
import HotelMain from '../Screens/Private/Hotel/HotelMain';
import HomeStack from './HomeStack';

const Tab = createBottomTabNavigator();

const BottomNavigation = () => {
  // const {strings} = useContext(LanguageContext);
  const insets = useSafeAreaInsets();

  const icons = {
    Home: 'https://cdn-icons-png.flaticon.com/128/1946/1946488.png',
    Convention: 'https://cdn-icons-png.flaticon.com/128/3211/3211487.png',
    Hotels: 'https://cdn-icons-png.flaticon.com/128/3619/3619368.png',
    Profile: 'https://cdn-icons-png.flaticon.com/128/456/456283.png',
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLOR.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 4,
        },
        tabBarStyle: {
          paddingVertical: 8,
          height: 65 + insets.bottom,
          paddingBottom: 0 + insets.bottom,
          height:
            Platform.OS === 'android' && Platform.Version < 35
              ? 60
              : 55 + insets.bottom,
          paddingBottom:
            Platform.OS === 'android' && Platform.Version < 35
              ? 10
              : insets.bottom,
        },
        tabBarIcon: ({ focused }) => {
          const iconUri = icons[route.name];

          return (
            <Image
              source={{ uri: iconUri }}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? COLOR.primary : 'gray',
              }}
              resizeMode="contain"
            />
          );
        },
        tabBarLabel: ({ color }) => {
          let label = route.name;
          if (route.name === 'MyBids') label = 'My Bids';

          return (
            <Text
              style={{ color, fontSize: 12, marginTop: 4, textAlign: 'center' }}>
              {label}
            </Text>
          );
        },
      })}>
      <Tab.Screen name={'Home'} component={HomeStack} />
      <Tab.Screen name={'Hotels'} component={HotelMain} />
      {/* <Tab.Screen name={'Hostel'} component={Hostel} /> */}
      {/* <Tab.Screen name={'Convention'} component={Convention} /> */}
      {/* <Tab.Screen name={strings.analytics} component={Analytics} /> */}
      <Tab.Screen name={'Profile'} component={Account} />
    </Tab.Navigator>
  );
};

export default BottomNavigation;
