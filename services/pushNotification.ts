import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

// Request permission + get FCM token
export async function initPush() {
  if (Platform.OS !== 'android') return;

  await messaging().requestPermission();

  const token = await messaging().getToken();
  console.log('🔥 FCM TOKEN:', token);

  return token;
}

// Subscribe to topic
export async function subscribeAllDevice() {
  if (Platform.OS !== 'android') return;

  await messaging().subscribeToTopic('allDevice');
  console.log('✅ Subscribed to topic: allDevice');
}

// Listen foreground messages
export function listenPush() {
  return messaging().onMessage(async remoteMessage => {
    console.log('📩 Push received (foreground):', remoteMessage);
  });
}
