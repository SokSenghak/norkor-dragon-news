import messaging from '@react-native-firebase/messaging';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { router } from 'expo-router';

// Helper to handle navigation
const handleNotificationNavigation = (data: any) => {
    if (data?.id) {
        console.log('🚀 Navigating to article:', data.id);
        
        // Use a small timeout to ensure Expo Router is ready 
        // especially during "Quit State" startup
        setTimeout(() => {
            router.push(`/article/${data.id}`);
        }, 500);
    }
};

export async function initPush() {
  try {
    // ✅ ANDROID 13+ RUNTIME PERMISSION
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('❌ Notification permission denied');
        return null;
      }

      console.log('✅ Notification permission granted');
    }

    // ✅ iOS or fallback permission
    await messaging().requestPermission();

    // ✅ Create notification channel (Android)
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: 'sound_channel',
        name: 'News Notifications',
        importance: AndroidImportance.HIGH,
        sound: 'sound',
      });
    }

    // ✅ Get FCM Token
    const token = await messaging().getToken();

    // console.log('🔥 FCM TOKEN:', token);

    return token;

  } catch (e) {
    console.log('initPush ERROR:', e);
    return null;
  }
}

export async function subscribeAllDevice() {
    if (Platform.OS !== 'android') return;
    await messaging().subscribeToTopic('allDevice');
    console.log('✅ Subscribed to topic: allDevice');
}

export function listenPush() {
    // 1. FOREGROUND: Handle clicks on the Notifee popup
    const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
        if (type === EventType.PRESS) {
            handleNotificationNavigation(detail.notification?.data);
        }
    });

    // 2. FOREGROUND: Listen for incoming FCM and show Notifee
    const unsubscribeMessaging = messaging().onMessage(async remoteMessage => {
        console.log('📩 Message received in foreground');
        await notifee.displayNotification({
            title: remoteMessage.notification?.title,
            body: remoteMessage.notification?.body,
            data: remoteMessage.data, // IMPORTANT: Must pass this for navigation to work
            android: {
                channelId: 'sound_channel',
                importance: AndroidImportance.HIGH, // Added this
                pressAction: { id: 'default' },
            },
        });
    });

    // 3. BACKGROUND: Handle click when app is in background (but not killed)
    const unsubscribeOpened = messaging().onNotificationOpenedApp(remoteMessage => {
        handleNotificationNavigation(remoteMessage.data);
    });

    return () => {
        unsubscribeNotifee();
        unsubscribeMessaging();
        unsubscribeOpened();
    };
}

export async function checkInitialNotification() {
    // Check Firebase initial notification
    const remoteMessage = await messaging().getInitialNotification();
    if (remoteMessage) {
        handleNotificationNavigation(remoteMessage.data);
    }

    // Check Notifee initial notification
    const initialNotifee = await notifee.getInitialNotification();
    if (initialNotifee) {
        handleNotificationNavigation(initialNotifee.notification.data);
    }
}