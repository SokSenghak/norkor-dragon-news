import React, { createContext, useContext, useEffect, useState } from 'react';
import { initPush, listenPush, subscribeAllDevice } from '@/services/pushNotification';

type NotificationContextType = {
  fcmToken: string | null;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    async function setupPush() {
      const token = await initPush();
      if (token) {
        setFcmToken(token);
      }
      await subscribeAllDevice();
    }

    setupPush();

    const unsubscribe = listenPush();
    return unsubscribe;
  }, []);

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
