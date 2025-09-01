import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import {AuthContext} from '../Backend/AuthContent';
import RootNavigation from './RootNavigation';
import AuthStack from './AuthNavigation';
import {ToastProvider} from '../Constants/ToastContext';
import Geolocation from '@react-native-community/geolocation';

const MainNavigation = () => {
  const auth = useContext(AuthContext);
  const {currentStatus} = useContext(AuthContext);

  if (!auth) {
    console.error('AuthContext not found');
    return null;
  }

  const {user, loading} = auth;
  const [locationStatus, setLocationStatus] = useState('Checking location...');

  const requestPermission = async () => {
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
  };

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

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log('POS:', position);
        Alert.alert(JSON.stringify(position));
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
  };

  useEffect(() => {
    requestPermission();
  }, []);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <ToastProvider>
        {user || currentStatus === -1 ? <RootNavigation /> : <AuthStack />}
      </ToastProvider>
    </View>
  );
};

export default MainNavigation;
