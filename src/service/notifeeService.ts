import notifee, {
  AndroidImportance,
  AndroidVisibility,
  EventType,
} from '@notifee/react-native';
import { Platform } from 'react-native';

export const requestNotifeePermission = async () => {
  if (Platform.OS === 'ios') {
    await notifee.requestPermission();
  }

  if (Platform.OS === 'android') {
    await notifee.requestPermission();
  }
};

export const createDefaultChannel = async () => {
  await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PUBLIC,
    sound: 'default',
    vibration: true,
  });
};

export const displayLocalNotification = async ({
  title,
  body,
  data,
}: {
  title?: string;
  body?: string;
  data?: any;
}) => {
  await notifee.displayNotification({
    title: title || 'New Notification',
    body: body || '',
    data: data || {},
    android: {
      channelId: 'default',
      smallIcon: 'ic_launcher',
      pressAction: {
        id: 'default',
      },
      sound: 'default',
    },
    ios: {
      sound: 'default',
    },
  });
};

export const setupNotifeeListeners = () => {
  const unsubscribeForeground = notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS) {
      console.log('Notifee notification pressed:', detail.notification);

      // You can navigate here using detail.notification?.data
    }
  });

  notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.PRESS) {
      console.log('Notifee background press:', detail.notification);

      // You can handle background press here
    }
  });

  return () => {
    unsubscribeForeground();
  };
};