import 'react-native-reanimated';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import SplashScreenComponent from '@/components/SplashScreen';
import { NotificationProvider } from '@/providers/NotificationProvider';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

// ----------------------------------------------------
function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: 'មុន' }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="article/[id]"
        options={{
          headerShown: false,
          title: 'ព័ត៌មានលម្អិត',
          headerStyle: { backgroundColor: '#2B4A7C' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
    </Stack>
  );
}

// ----------------------------------------------------
export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  useEffect(() => {
    const prepare = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2500));
      } finally {
        setAppReady(true);
        await SplashScreen.hideAsync();
      }
    };

    prepare();
  }, []);

  
if (showSplash || !appReady) {
  return (
    <SplashScreenComponent
      duration={25000} // ⏱ adjust here
      onFinish={() => setShowSplash(false)}
    />
  );
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
