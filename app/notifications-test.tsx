import NotificationDemo from "@/components/NotificationDemo";
import { Stack } from "expo-router";

export default function NotificationsTestPage() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Notifications Test",
          headerStyle: { backgroundColor: "#2B4A7C" },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { fontWeight: "700" },
        }}
      />
      <NotificationDemo />
    </>
  );
}
