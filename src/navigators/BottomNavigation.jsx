import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, Text} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {LanguageContext} from '../localization/LanguageContext';
import Home from '../Screens/Private/Dashboard/Home';
import Account from '../Screens/Private/Account/Account';
import {COLOR} from '../Constants/Colors';
import Wishlist from '../Screens/Private/Wishlist';
import Convention from '../Screens/Private/ConventionSection/Convention';

const Tab = createBottomTabNavigator();

const BottomNavigation = () => {
  const {strings} = useContext(LanguageContext);
  const insets = useSafeAreaInsets();

  const icons = {
    [strings.home]: 'https://cdn-icons-png.flaticon.com/128/1946/1946488.png',
    Convention: 'https://cdn-icons-png.flaticon.com/128/1250/1250680.png',
    Wishlist: 'https://cdn-icons-png.flaticon.com/128/833/833314.png',
    [strings.analytics]:
      'https://cdn-icons-png.flaticon.com/128/2099/2099058.png',
    Profile: 'https://cdn-icons-png.flaticon.com/128/456/456283.png',
  };

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: COLOR.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 4,
        },
        tabBarStyle: {
          paddingVertical: 8,
          height: 60 + insets.bottom, // Add safe area bottom inset for Android/iOS
          paddingBottom: 0 + insets.bottom, // Padding to prevent overlap with nav buttons
        },
        tabBarIcon: ({focused}) => {
          const iconUri = icons[route.name];

          return (
            <Image
              source={{uri: iconUri}}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? COLOR.primary : 'gray',
              }}
              resizeMode="contain"
            />
          );
        },
        tabBarLabel: ({color}) => {
          let label = route.name;
          if (route.name === 'MyBids') label = 'My Bids'; // Fix label spacing

          return (
            <Text
              style={{color, fontSize: 12, marginTop: 4, textAlign: 'center'}}>
              {label}
            </Text>
          );
        },
      })}>
      <Tab.Screen name={strings.home} component={Home} />
      <Tab.Screen name={'Convention'} component={Convention} />
      <Tab.Screen name={'Wishlist'} component={Wishlist} />
      {/* <Tab.Screen name={strings.analytics} component={Analytics} /> */}
      <Tab.Screen name={'Profile'} component={Account} />
    </Tab.Navigator>
  );
};

export default BottomNavigation;
