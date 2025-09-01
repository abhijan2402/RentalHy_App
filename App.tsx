import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Platform,
  Linking,
  View,
  Text,
} from 'react-native';
// import Geolocation from 'react-native-geolocation-service';
import {LanguageProvider} from './src/localization/LanguageContext';
import {AuthProvider} from './src/Backend/AuthContent';
import {NavigationContainer} from '@react-navigation/native';
import MainNavigation from './src/navigators/MainNavigation';

const App = () => {
  const [locationStatus, setLocationStatus] = useState('Checking location...');

  useEffect(() => {
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
            // getCurrentLocation();
          } else {
            setLocationStatus('Location permission denied.');
          }
        } catch (err) {
          setLocationStatus('Permission error.');
        }
      } else if (Platform.OS === 'ios') {
        const auth = await Geolocation.requestAuthorization('whenInUse');
        if (auth === 'granted') {
          // getCurrentLocation();
        } else {
          setLocationStatus('Location permission denied.');
        }
      } else {
        setLocationStatus('Unsupported platform.');
      }
    };

    const getCurrentLocation = () => {
      Geolocation.getCurrentPosition(
        position => {
          setLocationStatus(
            `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`,
          );
        },
        error => {
          setLocationStatus('Failed to fetch location.');
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    };

    requestPermission();
  }, []);

  return (
    <LanguageProvider>
      <AuthProvider>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
          <NavigationContainer>
            <MainNavigation />
          </NavigationContainer>
        </SafeAreaView>
      </AuthProvider>
    </LanguageProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
