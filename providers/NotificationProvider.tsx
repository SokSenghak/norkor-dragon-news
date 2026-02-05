import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  checkInitialNotification,
  initPush,
  listenPush,
  subscribeAllDevice,
} from '@/services/pushNotification';

type NotificationContextType = {
  fcmToken: string | null;
};

const NotificationContext =
  createContext<NotificationContextType | undefined>(undefined);

const NOTIFICATION_ASKED_KEY = 'notification_permission_asked';

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: any;

    const bootstrap = async () => {
      // ✅ Safe listeners (NO permission request)
      unsubscribe = listenPush();

      // ✅ Handle app opened from killed state
      await checkInitialNotification();

      // ✅ Ask permission only once
      const asked = await AsyncStorage.getItem(NOTIFICATION_ASKED_KEY);
      if (!asked) {
        showPermissionAlert();
      }
    };

    bootstrap();

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const showPermissionAlert = () => {
    Alert.alert(
      'Enable Notifications 🔔',
      'We send breaking news and important updates.',
      [
        {
          text: 'Not Now',
          style: 'cancel',
          onPress: () => {
            AsyncStorage.setItem(NOTIFICATION_ASKED_KEY, 'true');
          },
        },
        {
          text: 'Allow',
          onPress: async () => {
            await AsyncStorage.setItem(NOTIFICATION_ASKED_KEY, 'true');

            // ✅ This is the ONLY place permission is requested
            const token = await initPush();

            if (token) {
              setFcmToken(token);
              await subscribeAllDevice();
            }
          },
        },
      ]
    );
  };

  return (
    <NotificationContext.Provider value={{ fcmToken }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotifications must be used inside NotificationProvider');
  }
  return ctx;
}

