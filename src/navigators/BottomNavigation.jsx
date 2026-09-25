import React, { useContext, useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Account from '../Screens/Private/Account/Account';
import { COLOR } from '../Constants/Colors';
import HomeStack from './HomeStack';
import MyBooking from '../Screens/Private/ConventionSection/MyBooking';
import ChatList from '../Screens/Private/Account/ChatList';
import Chat from '../Screens/Private/Dashboard/Chat';
import { AuthContext } from '../Backend/AuthContent';
import CreateAccountModal from '../Modals/CreateAccountModal';

const Tab = createBottomTabNavigator();
const ChatStack = createNativeStackNavigator();

const ChatStackScreen = () => (
  <ChatStack.Navigator screenOptions={{headerShown: false}}>
    <ChatStack.Screen name="ChatHome" component={ChatList} />
    <ChatStack.Screen name="Chat" component={Chat} />
  </ChatStack.Navigator>
);

const icons = {
  Home: 'https://cdn-icons-png.flaticon.com/128/1946/1946488.png',
  'My Bookings': 'https://cdn-icons-png.flaticon.com/128/747/747310.png',
  Chat: 'https://cdn-icons-png.flaticon.com/128/134/134914.png',
  Profile: 'https://cdn-icons-png.flaticon.com/128/456/456283.png',
};

const AnimatedTabIcon = ({ focused, routeName }) => {
  const animation = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(animation, {
      toValue: focused ? 1 : 0,
      friction: 6,
      tension: 90,
      useNativeDriver: true,
    }).start();
  }, [animation, focused]);

  const animatedStyle = {
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -3],
        }),
      },
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.1],
        }),
      },
    ],
  };

  return (
    <View style={styles.iconArea}>
      <Animated.View
        style={[
          styles.iconCapsule,
          focused && styles.activeIconCapsule,
          animatedStyle,
        ]}>
        <Image
          source={{ uri: icons[routeName] }}
          style={[
            styles.icon,
            { tintColor: focused ? COLOR.primary : '#8a9099' },
          ]}
          resizeMode="contain"
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.activeDot,
          {
            opacity: animation,
            transform: [{ scale: animation }],
          },
        ]}
      />
    </View>
  );
};

const BottomNavigation = () => {
  const insets = useSafeAreaInsets();
  const safeBottom = insets.bottom;
  const { currentStatus } = useContext(AuthContext);
  const [accountModalVisible, setAccountModalVisible] = useState(false);

  const handleProtectedTabPress = event => {
    if (currentStatus === -1) {
      event.preventDefault();
      setAccountModalVisible(true);
    }
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: COLOR.primary,
          tabBarInactiveTintColor: '#8a9099',
          tabBarStyle: [
            styles.tabBar,
            {
              height: 62 + safeBottom,
              paddingBottom: Math.max(5, safeBottom),
            },
          ],
          tabBarItemStyle: styles.tabItem,
          tabBarLabelStyle: styles.label,
          tabBarIconStyle: styles.tabBarIcon,
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon focused={focused} routeName={route.name} />
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.label, focused && styles.activeLabel]}>
              {route.name}
            </Text>
          ),
        })}>
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen
          name="My Bookings"
          component={MyBooking}
          listeners={{ tabPress: handleProtectedTabPress }}
        />
        <Tab.Screen
          name="Chat"
          component={ChatStackScreen}
          listeners={{ tabPress: handleProtectedTabPress }}
        />
        <Tab.Screen name="Profile" component={Account} />
      </Tab.Navigator>
      <CreateAccountModal
        visible={accountModalVisible}
        onCreateAccount={() => setAccountModalVisible(false)}
        onCancel={() => setAccountModalVisible(false)}
      />
    </>
  );
};

export default BottomNavigation;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eceef2',
    paddingTop: 5,
    paddingBottom: 5,
    shadowColor: '#111827',
    shadowOpacity: 0.09,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 12,
    elevation: 12,
  },
  tabItem: {
    paddingVertical: 1,
  },
  tabBarIcon: {
    marginTop: 1,
  },
  iconArea: {
    width: 52,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCapsule: {
    width: 43,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  activeIconCapsule: {
    backgroundColor: '#fff1e8',
  },
  icon: {
    width: 21,
    height: 21,
  },
  activeDot: {
    position: 'absolute',
    bottom: -1,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLOR.primary,
  },
  label: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '600',
    color: '#8a9099',
    textAlign: 'center',
  },
  activeLabel: {
    color: COLOR.primary,
    fontWeight: '700',
  },
});
