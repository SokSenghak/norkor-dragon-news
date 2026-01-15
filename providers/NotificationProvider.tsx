import React, { createContext, useContext, useEffect, useState } from 'react';
import { checkInitialNotification, initPush, listenPush, subscribeAllDevice } from '@/services/pushNotification';

type NotificationContextType = {
	fcmToken: string | null;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
	const [fcmToken, setFcmToken] = useState<string | null>(null);

	useEffect(() => {
		async function setupPush() {
			// 1. Setup Channel & Permissions
			const token = await initPush();
			if (token) {
				setFcmToken(token);
			}

			// 2. Subscribe to Topics
			await subscribeAllDevice();

			// 3. Handle Quit State (If app was closed and opened by notification)
      		await checkInitialNotification();
		}

		setupPush();

		// 4. Handle Foreground & Background listeners
		const unsubscribe = listenPush();
		return () => {
			if (typeof unsubscribe === 'function') {
				unsubscribe();
			}
			};
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
