import { Tabs } from "expo-router";
import { Home, Video, Menu } from "lucide-react-native";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#8BA3C7",
        tabBarStyle: {
          backgroundColor: "#2B4A7C",
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
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
