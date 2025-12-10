import { useState, useEffect, useRef, useCallback } from "react";
import { Platform, Alert, Linking } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import createContextHook from "@nkzw/create-context-hook";

// --- CONFIG ---
const YOUR_PROJECT_ID = "e1aed192-86b5-4ebb-994f-9cd97adeafa7";

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
  sendImmediateNotification: (
    title: string,
    body: string,
    data?: any
  ) => Promise<void>;
  clearNotifications: () => void;
};

// -----------------------------------
// Expo Notification Handler
// -----------------------------------
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, 
    shouldPlaySound: true,
    shouldSetBadge: true, 
    shouldShowBanner: true, 
    shouldShowList: true,
  }),
});

// -----------------------------------
// Provider Component
// -----------------------------------
export const [NotificationProvider, useNotifications] =
  createContextHook<NotificationContextType>(() => {
    const [expoPushToken, setExpoPushToken] = useState<string>("");
    const [fcmToken, setFcmToken] = useState<string | null>(null);

    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [lastNotification, setLastNotification] =
      useState<NotificationData | null>(null);
    const [isReady, setIsReady] = useState(false);

    const notificationListener = useRef<Notifications.Subscription | null>(
      null
    );
    const responseListener = useRef<Notifications.Subscription | null>(null);

    // ------------------------------
    // Handle Received Notification
    // ------------------------------
    const handleNotificationReceived = useCallback(
      async (notification: Notifications.Notification) => {
        const content = notification.request.content;

        // Show banner even while app is open
        await Notifications.presentNotificationAsync({
          title: content.title,
          body: content.body,
          data: content.data,
        });

        const info: NotificationData = {
          id: notification.request.identifier,
          title: content.title ?? "",
          body: content.body ?? "",
          data: content.data,
          timestamp: Date.now(),
        };

        console.log("🔔 Notification received:", info);

        setLastNotification(info);
        setNotifications((prev) => [info, ...prev]);
      },
      []
    );

    // ------------------------------
    // Send Notification (Local)
    // ------------------------------
    const sendImmediateNotification = useCallback(
      async (title: string, body: string, data?: any) => {
        await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            data,
            sound: "notification.mp3", // iOS only
          },
          trigger: null,
        });
      },
      []
    );

    // ------------------------------
    // Clear Notification History
    // ------------------------------
    const clearNotifications = useCallback(() => {
      setNotifications([]);
      setLastNotification(null);
    }, []);

    // ------------------------------
    // Initialization
    // ------------------------------
    useEffect(() => {
      async function initialize() {
        try {
          // 1. Register for push notifications
          const token = await registerForPushNotificationsAsync(YOUR_PROJECT_ID);
          if (token) setExpoPushToken(token);

          // 2. FCM token (Android only)
          const { data: rawFcm } =
            await Notifications.getDevicePushTokenAsync();
          setFcmToken(rawFcm);

          // 3. Add listeners
          notificationListener.current =
            Notifications.addNotificationReceivedListener(
              handleNotificationReceived
            );

          responseListener.current =
            Notifications.addNotificationResponseReceivedListener((response) => {
              console.log("🔘 Notification clicked:", response);
            });
        } finally {
          setIsReady(true);
        }
      }

      initialize();

      return () => {
        notificationListener.current?.remove();
        responseListener.current?.remove();
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
// Register and Configure Notifications
// --------------------------------------------------------------------------
async function registerForPushNotificationsAsync(projectId: string) {
  let token: string | undefined;

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert("Permissions Needed", "Enable notifications in Settings.", [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: () => Linking.openSettings() },
      ]);
      return;
    }

    // Android: setup channel with custom sound
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Default",
        importance: Notifications.AndroidImportance.MAX,
        sound: "notification.mp3", // file from /res/raw/
        vibrationPattern: [0, 250, 250, 250],
      });
    }

    try {
      if (!projectId) throw new Error("Missing Project ID");

      token = (
        await Notifications.getExpoPushTokenAsync({ projectId })
      ).data;
    } catch (e) {
      console.error("Push token error:", e);
      token = `Error: ${String(e)}`;
    }
  }

  return token;
}
