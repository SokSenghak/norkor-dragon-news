import { useState, useEffect, useRef, useCallback } from 'react';
import { Platform, Alert, Linking } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import createContextHook from "@nkzw/create-context-hook"; // Assuming this is used for context creation

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
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    };
  },
});

// ------------------------------
// Provider Component
// ------------------------------
export const [
  NotificationProvider,
  useNotifications
] = createContextHook<NotificationContextType>(() => {
  const [expoPushToken, setExpoPushToken] = useState<string>("");
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [lastNotification, setLastNotification] = useState<NotificationData | null>(null);
  const [isReady, setIsReady] = useState(false);

  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  // --- Notification Receiver Logic ---
  const handleNotificationReceived = useCallback(async (notification: Notifications.Notification) => {
    // 1. Force the banner to show up when the app is active
    await Notifications.presentNotificationAsync(notification.request.content);
    
    // 2. Process and store notification data in state
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

  // --- Local Notification Sender (Utility function for in-app testing) ---
  const sendImmediateNotification = useCallback(async (title: string, body: string, data?: any) => {
    await Notifications.scheduleNotificationAsync({
      content: { 
        title: title, 
        body: body, 
        data: data, 
        sound: "default" 
      },
      trigger: null, // Send immediately
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
        // 1. Register device and get token
        const token = await registerForPushNotificationsAsync(YOUR_PROJECT_ID);
        if (token) setExpoPushToken(token);

        // 2. Set up listeners
        notificationListener.current = Notifications.addNotificationReceivedListener(handleNotificationReceived);
        
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          console.log("Notification clicked:", response);
          // Your deep linking logic (handled in _layout.tsx)
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
    notifications,
    lastNotification,
    sendImmediateNotification,
    clearNotifications,
  };
});

// --------------------------------------------------------------------------
// 🛠️ Register Function (Independent)
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
        "To receive push notifications, please enable them in your app settings.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ]
      );
      return;
    }
    
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default Notifications',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    try {
      if (!projectId) {
        throw new Error('Project ID not found.');
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: projectId,
        })
      ).data;
      console.log('Expo Push Token generated:', token);
    } catch (e) {
      console.error("Error retrieving token:", e);
      token = `Error: ${e instanceof Error ? e.message : String(e)}`;
    }
    
  } else {
    Alert.alert('Device Required', 'Must use a physical device or custom build for Push Notifications.');
  }
  
  return token;
}