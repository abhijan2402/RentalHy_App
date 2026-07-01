import React, { useEffect } from 'react';
import {
  StyleSheet,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { LanguageProvider } from './src/localization/LanguageContext';
import { AuthProvider } from './src/Backend/AuthContent';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigation from './src/navigators/MainNavigation';
import messaging from '@react-native-firebase/messaging';
import {
  flushPendingNavigation,
  navigationRef,
} from './src/navigators/navigationService';

import {
  requestNotifeePermission,
  createDefaultChannel,
  displayLocalNotification,
  handleBookingNotificationPress,
  setupNotifeeListeners,
} from './src/service/notifeeService';

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
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      console.log('Foreground notification:', remoteMessage);

      await displayLocalNotification({
        title:
          remoteMessage.notification?.title ||
          String(remoteMessage.data?.title || 'New Notification'),
        body:
          remoteMessage.notification?.body ||
          String(remoteMessage.data?.body || ''),
        data: remoteMessage.data,
      });
    });

    const unsubscribeOpenedApp = messaging().onNotificationOpenedApp(
      remoteMessage => {
        console.log('Opened from background:', remoteMessage);
        handleBookingNotificationPress({
          ...remoteMessage?.data,
          title: remoteMessage?.notification?.title,
          body: remoteMessage?.notification?.body,
        });
      },
    );

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Opened from quit state:', remoteMessage);
          handleBookingNotificationPress({
            ...remoteMessage?.data,
            title: remoteMessage?.notification?.title,
            body: remoteMessage?.notification?.body,
          });
        }
      });

    return () => {
      unsubscribeOnMessage();
      unsubscribeOpenedApp();
    };
  };

  useEffect(() => {
    const initNotifications = async () => {
      await requestUserPermission();
      await requestNotifeePermission();
      await createDefaultChannel();

      await getFcmToken();
    };

    initNotifications();

    const unsubscribeFirebase = notificationListener();
    const unsubscribeNotifee = setupNotifeeListeners();

    return () => {
      unsubscribeFirebase();
      unsubscribeNotifee();
    };
  }, []);

  return (
    <LanguageProvider>
      <AuthProvider>
        <NavigationContainer
          ref={navigationRef}
          onReady={flushPendingNavigation}>
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
