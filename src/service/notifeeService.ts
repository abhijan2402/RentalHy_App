import notifee, {
  AndroidImportance,
  AndroidVisibility,
  EventType,
} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { navigate } from '../navigators/navigationService';

const bookingNotificationKeywords = [
  'booking',
  'book',
  'order',
  'payment',
  'status',
  'hall',
  'convention',
];

const vendorKeywords = ['vendor', 'owner', 'host', 'seller', 'provider'];
const customerKeywords = ['customer', 'user', 'buyer', 'client'];

const normalizeValue = (value?: unknown) => String(value || '').toLowerCase();

const hasAnyKeyword = (value: string, keywords: string[]) => {
  return keywords.some(keyword => value.includes(keyword));
};

const getExplicitRoute = (data?: any) => {
  const explicitRoute = normalizeValue(data?.route || data?.screen);

  if (
    explicitRoute === 'mybooking' ||
    explicitRoute === 'my_booking' ||
    explicitRoute === 'my_bookings' ||
    explicitRoute === 'my bookings'
  ) {
    return 'MyBooking';
  }

  if (
    explicitRoute === 'spaceorders' ||
    explicitRoute === 'space_orders' ||
    explicitRoute === 'convention_orders' ||
    explicitRoute === 'hall_orders' ||
    explicitRoute === 'convention/hall orders'
  ) {
    return 'SpaceOrders';
  }

  return null;
};

const getNotificationRoute = async (data?: any) => {
  const notificationData = data || {};
  const explicitRoute = getExplicitRoute(notificationData);

  if (explicitRoute) {
    return explicitRoute;
  }

  const targetText = [
    notificationData.user_type,
    notificationData.role,
    notificationData.receiver_type,
    notificationData.account_type,
    notificationData.notification_for,
    notificationData.target,
    notificationData.audience,
    notificationData.type,
    notificationData.screen,
  ]
    .map(normalizeValue)
    .join(' ');

  if (
    notificationData.is_vendor === '1' ||
    notificationData.is_vendor === 1 ||
    notificationData.is_vendor === true ||
    hasAnyKeyword(targetText, vendorKeywords)
  ) {
    return 'SpaceOrders';
  }

  if (hasAnyKeyword(targetText, customerKeywords)) {
    return 'MyBooking';
  }

  try {
    const storedUser = await AsyncStorage.getItem('user');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const user = parsedUser?.user || parsedUser;
    const storedRoleText = [
      user?.role,
      user?.user_type,
      user?.account_type,
      user?.type,
      user?.is_vendor ? 'vendor' : '',
    ]
      .map(normalizeValue)
      .join(' ');

    if (hasAnyKeyword(storedRoleText, vendorKeywords)) {
      return 'SpaceOrders';
    }
  } catch (error) {
    console.log('Unable to read user for notification route:', error);
  }

  return 'MyBooking';
};

export const handleBookingNotificationPress = async (data?: any) => {
  const explicitRoute = getExplicitRoute(data);
  const notificationText = [
    data?.type,
    data?.notification_type,
    data?.category,
    data?.action,
    data?.screen,
    data?.route,
    data?.title,
    data?.body,
  ]
    .map(normalizeValue)
    .join(' ');

  const shouldHandleNotification =
    !!explicitRoute ||
    hasAnyKeyword(notificationText, bookingNotificationKeywords);

  if (!shouldHandleNotification) return;

  const route = await getNotificationRoute(data);
  navigate(route, {fromNotification: true});
};

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
      handleBookingNotificationPress({
        ...detail.notification?.data,
        title: detail.notification?.title,
        body: detail.notification?.body,
      });
    }
  });

  notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.PRESS) {
      console.log('Notifee background press:', detail.notification);
      await handleBookingNotificationPress({
        ...detail.notification?.data,
        title: detail.notification?.title,
        body: detail.notification?.body,
      });
    }
  });

  notifee.getInitialNotification().then(initialNotification => {
    if (initialNotification?.notification) {
      handleBookingNotificationPress({
        ...initialNotification.notification.data,
        title: initialNotification.notification.title,
        body: initialNotification.notification.body,
      });
    }
  });

  return () => {
    unsubscribeForeground();
  };
};
