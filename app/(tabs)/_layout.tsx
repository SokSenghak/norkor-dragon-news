import { Tabs } from "expo-router";
import { Home, Video, Menu } from "lucide-react-native";
import { Platform } from "react-native";
import React from "react";

export default function TabLayout() {
  const isIOS = Platform.OS === "ios";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#8BA3C7",
        tabBarStyle: {
          backgroundColor: "#2B4A7C",
          borderTopWidth: 0,
          height: isIOS ? 70 : 90, // iOS taller
          paddingBottom: 5,        // only bottom padding
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "ទំព័រដើម",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="videos"
        options={{
          title: "វីដេអូ",
          tabBarIcon: ({ color, size }) => <Video color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="menu"
        options={{
          title: "ម៉ឺនុយ",
          tabBarIcon: ({ color, size }) => <Menu color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
