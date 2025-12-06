import 'react-native-reanimated';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import SplashScreenComponent from "@/components/SplashScreen";

// ⚠️ FIX APPLIED: Changed to a NAMED import { ... }
import { NotificationProvider } from "@/contexts/NotificationContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

// ----------------------------------------------------
// Hook to handle deep linking when a notification is tapped
// ----------------------------------------------------
function useNotificationObserver() {
  useEffect(() => {
    function redirect(notification: Notifications.Notification) {
      // Look for a 'url' key in the notification data payload
      const url = notification.request.content.data?.url;
      if (typeof url === 'string') {
        // Use router.push to navigate to the screen specified in the push payload
        router.push(url as any);
      }
    }

    // 1. Check if the app was launched by tapping a notification (Initial Launch)
    const response = Notifications.getLastNotificationResponse();
    if (response?.notification) {
      redirect(response.notification);
    }
    
    // 2. Listen for notifications tapped while the app is already running (Foreground/Background)
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      if (response?.notification) {
        redirect(response.notification);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);
}

// ----------------------------------------------------
// Navigation Stack Configuration
// ----------------------------------------------------
function RootLayoutNav() {
  // Use the useNotificationObserver hook here
  useNotificationObserver(); 

  return (
    <Stack screenOptions={{ headerBackTitle: "មុន" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="article/[id]" 
        options={{ 
          headerShown: false,
          title: "ព័ត៌មានលម្អិត",
          headerStyle: { backgroundColor: "#2B4A7C" },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { fontWeight: "700" },
        }} 
      />
    </Stack>
  );
}

// ----------------------------------------------------
// Main Root Layout
// ----------------------------------------------------
export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      SplashScreen.hideAsync();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreenComponent />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <RootLayoutNav />
        </GestureHandlerRootView>
      </NotificationProvider>
    </QueryClientProvider>
  );
}