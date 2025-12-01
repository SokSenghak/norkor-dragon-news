import createContextHook from "@nkzw/create-context-hook";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { Platform, Alert } from "react-native";

type NotificationData = {
  id: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  timestamp: number;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const [NotificationProvider, useNotifications] = createContextHook(() => {
  const [expoPushToken, setExpoPushToken] = useState<string>("");
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [lastNotification, setLastNotification] = useState<NotificationData | null>(null);
  const notificationListener = useRef<Notifications.EventSubscription | undefined>(undefined);
  const responseListener = useRef<Notifications.EventSubscription | undefined>(undefined);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        setExpoPushToken(token);
        console.log("Push token:", token);
      }
    });

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      const notificationData: NotificationData = {
        id: notification.request.identifier,
        title: notification.request.content.title || "",
        body: notification.request.content.body || "",
        data: notification.request.content.data,
        timestamp: Date.now(),
      };
      
      setLastNotification(notificationData);
      setNotifications((prev) => [notificationData, ...prev]);
      console.log("Notification received:", notificationData);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Notification response:", response);
      const data = response.notification.request.content.data;
      if (data) {
        console.log("Notification data:", data);
      }
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  const schedulePushNotification = async (
    title: string,
    body: string,
    data?: Record<string, any>,
    seconds: number = 0
  ) => {
    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: seconds > 0 ? { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds, repeats: false } : null,
      });
      console.log("Notification scheduled:", id);
      return id;
    } catch (error) {
      console.error("Error scheduling notification:", error);
      throw error;
    }
  };

  const sendImmediateNotification = async (
    title: string,
    body: string,
    data?: Record<string, any>
  ) => {
    return schedulePushNotification(title, body, data, 0);
  };

  const cancelNotification = async (notificationId: string) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log("Notification cancelled:", notificationId);
    } catch (error) {
      console.error("Error cancelling notification:", error);
    }
  };

  const cancelAllNotifications = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log("All notifications cancelled");
    } catch (error) {
      console.error("Error cancelling all notifications:", error);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
    setLastNotification(null);
  };

  const setBadgeCount = async (count: number) => {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error("Error setting badge count:", error);
    }
  };

  return {
    expoPushToken,
    notifications,
    lastNotification,
    schedulePushNotification,
    sendImmediateNotification,
    cancelNotification,
    cancelAllNotifications,
    clearNotifications,
    setBadgeCount,
  };
});

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "web") {
    console.log("Push notifications are not supported on web");
    return null;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please enable notifications in your device settings to receive updates."
      );
      return null;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
        sound: "default",
      });
    }

    const token = await Notifications.getExpoPushTokenAsync({
      projectId: "e1aed192-86b5-4ebb-994f-9cd97adeafa7",
    });

    return token.data;
  } catch (error) {
    console.error("Error registering for push notifications:", error);
    return null;
  }
}
