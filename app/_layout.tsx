import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import SplashScreenComponent from "@/components/SplashScreen";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "មុន" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="article/[id]" 
        options={{ 
          headerShown: true,
          title: "ព័ត៌មានលម្អិត",
          headerStyle: { backgroundColor: "#2B4A7C" },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { fontWeight: "700" },
        }} 
      />
      <Stack.Screen 
        name="video/[id]" 
        options={{ 
          headerShown: true,
          title: "វីដេអូ",
          headerStyle: { backgroundColor: "#2B4A7C" },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { fontWeight: "700" },
        }} 
      />
    </Stack>
  );
}

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
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RootLayoutNav />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
