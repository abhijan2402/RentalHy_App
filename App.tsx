import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  PermissionsAndroid,
  Platform
} from 'react-native';
import {LanguageProvider} from './src/localization/LanguageContext';
import {AuthProvider} from './src/Backend/AuthContent';
import {NavigationContainer} from '@react-navigation/native';
import MainNavigation from './src/navigators/MainNavigation';
import messaging from '@react-native-firebase/messaging';

const App = () => {
 const requestUserPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }

  const authStatus = await messaging().requestPermission();
  console.log('Notification permission:', authStatus);
};

 const getFcmToken = async () => {
  const token = await messaging().getToken();
  console.log('FCM TOKEN:', token);
  return token;
};

 const notificationListener = () => {
  console.log("hiii");
  
  messaging().onMessage(async remoteMessage => {
    console.log('Foreground notification:', remoteMessage);
  });

  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('Opened from background:', remoteMessage);
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('Opened from quit state:', remoteMessage);
      }
    });
};
  useEffect(() => {
    requestUserPermission();
    getFcmToken();
    notificationListener();
  }, []);

  return (
    <LanguageProvider>
      <AuthProvider>
          <NavigationContainer>
            <MainNavigation />
          </NavigationContainer>
      </AuthProvider>
    </LanguageProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'red',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
