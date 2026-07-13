import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  View,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { AuthContext } from '../Backend/AuthContent';
import RootNavigation from './RootNavigation';
import AuthStack from './AuthNavigation';
import { ToastProvider } from '../Constants/ToastContext';
import Geolocation from '@react-native-community/geolocation';
import { SafeAreaView } from 'react-native-safe-area-context';

const MainNavigation = () => {
  const auth = useContext(AuthContext);
  const currentStatus = auth?.currentStatus;

  const { user, loading } = auth || {};
  const [, setLocationStatus] = useState('Checking location...');

  const getCurrentLocation = useCallback(() => {
    Geolocation.getCurrentPosition(
      position => {
        console.log('POS:', position);
        // Alert.alert(JSON.stringify(position));
        setLocationStatus(
          `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`,
        );
      },
      error => {
        console.log('Location error:', error);
        setLocationStatus('Failed to fetch location.');
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  }, []);

  const requestPermission = useCallback(async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          setLocationStatus('Location permission denied.');
        }
      } catch (err) {
        console.log('Permission error:', err);
        setLocationStatus('Permission error.');
      }
    } else if (Platform.OS === 'ios') {
      // iOS prompts automatically when using navigator.geolocation
      getCurrentLocation();
    } else {
      setLocationStatus('Unsupported platform.');
    }
  }, [getCurrentLocation]);

  // const getCurrentLocation = () => {
  //   navigator.geolocation.getCurrentPosition(
  //     position => {
  //       console.log('POS:', position);
  //       setLocationStatus(
  //         `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`,
  //       );
  //     },
  //     error => {
  //       console.log('Location error:', error);
  //       setLocationStatus('Failed to fetch location.');
  //     },
  //     {
  //       enableHighAccuracy: true,
  //       timeout: 15000,
  //       maximumAge: 10000,
  //     },
  //   );
  // };

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  if (!auth) {
    console.error('AuthContext not found');
    return null;
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <ToastProvider>
        {user || currentStatus === -1 ? <RootNavigation /> : <AuthStack />}
      </ToastProvider>
    </SafeAreaView>
  );
};

export default MainNavigation;
