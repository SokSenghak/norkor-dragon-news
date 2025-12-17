import { useState, useEffect, useRef, useCallback } from 'react';
import { Platform, Alert, Linking } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import createContextHook from "@nkzw/create-context-hook";

// --- CONFIGURATION ---
const YOUR_PROJECT_ID = 'e1aed192-86b5-4ebb-994f-9cd97adeafa7';

// ------------------------------
// Types
// ------------------------------
type NotificationData = {
  id: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  timestamp: number;
};

type NotificationContextType = {
  expoPushToken: string;
  fcmToken: string | null;
  lastNotification: NotificationData | null;
  notifications: NotificationData[];
  isReady: boolean;
  sendImmediateNotification: (title: string, body: string, data?: any) => Promise<void>;
  clearNotifications: () => void;
};

// ------------------------------
// Expo Notification Handler
// ------------------------------
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ------------------------------
// Provider Component
// ------------------------------
export const [
  NotificationProvider,
  useNotifications
] = createContextHook<NotificationContextType>(() => {

  const [expoPushToken, setExpoPushToken] = useState<string>("");
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [lastNotification, setLastNotification] = useState<NotificationData | null>(null);
  const [isReady, setIsReady] = useState(false);

  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  // --- Notification Receiver Logic ---
  const handleNotificationReceived = useCallback(async (notification: Notifications.Notification) => {

    // Force banner to show even when app is active
    // await Notifications.presentNotificationAsync(notification.request.content);

    const info: NotificationData = {
      id: notification.request.identifier,
      title: notification.request.content.title ?? "",
      body: notification.request.content.body ?? "",
      data: notification.request.content.data,
      timestamp: Date.now(),
    };

    console.log("🔔 Notification received:", info);

    setLastNotification(info);
    setNotifications((prev) => [info, ...prev]);
  }, []);

  // --- Local Notification Sender ---
  const sendImmediateNotification = useCallback(async (title: string, body: string, data?: any) => {
    await Notifications.scheduleNotificationAsync({
      content: { title, body, data, sound: "default" },
      trigger: null,
    });
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setLastNotification(null);
  }, []);

  useEffect(() => {
    async function initialize() {
      let cleanup: (() => void) | undefined;

      try {
        // 1. Expo Push Token
        const token = await registerForPushNotificationsAsync(YOUR_PROJECT_ID);
        console.log("Loadding Token", token);
        
        // if (token) setExpoPushToken(token);

        // 2. FCM Token
        const { data: rawFcm } = await Notifications.getDevicePushTokenAsync();
        // console.log("FCM Token:", rawFcm);
        setFcmToken(rawFcm);
        setExpoPushToken(rawFcm);
        // console.log("Expo Push Token:", token);

        // 3. Add listeners
        notificationListener.current = Notifications.addNotificationReceivedListener(
          handleNotificationReceived
        );

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          console.log("Notification clicked:", response);
        });

        cleanup = () => {
          notificationListener.current?.remove();
          responseListener.current?.remove();
        };

        return cleanup;

      } finally {
        setIsReady(true);
      }
    }

    const cleanupPromise = initialize();
    return () => {
      cleanupPromise.then((cleanupFn) => cleanupFn?.());
    };
  }, [handleNotificationReceived]);

  return {
    isReady,
    expoPushToken,
    fcmToken,
    notifications,
    lastNotification,
    sendImmediateNotification,
    clearNotifications,
  };
});

// --------------------------------------------------------------------------
// 🛠️ Register Function
// --------------------------------------------------------------------------
async function registerForPushNotificationsAsync(projectId: string) {
  let token: string | undefined;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert(
        "Notification Required",
        "Please enable notifications in Settings.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ]
      );
      return;
    }

    // Android notification channel
    if (Platform.OS === 'android') {
      // console.log("Yea android");
      await Notifications.setNotificationChannelAsync("sound_channel", {
        name: "Sound Channel",
        importance: Notifications.AndroidImportance.MAX,
        sound: "sound.wav",   // must match res/raw/notification.mp3
        vibrationPattern: [0, 250, 250, 250]
      });
    }

    try {
      if (!projectId) throw new Error("Project ID missing");

      token = (
        await Notifications.getExpoPushTokenAsync({ projectId })
      ).data;

      console.log("Expo Push Token: ===>", token);

    } catch (e) {
      console.error("Token error:", e);
      token = `Error: ${e instanceof Error ? e.message : String(e)}`;
    }
  } else {
    Alert.alert("Physical Device Needed", "Push notifications require a real device.");
  }

  return token;
}
