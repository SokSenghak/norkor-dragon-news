import { useNotifications } from "@/contexts/NotificationContext";
import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { Bell, Send, Trash2, Clock } from "lucide-react-native";

export default function NotificationDemo() {
  const {
    expoPushToken,
    notifications,
    lastNotification,
    sendImmediateNotification,
    schedulePushNotification,
    clearNotifications,
    cancelAllNotifications,
    setBadgeCount,
  } = useNotifications();

  const [title, setTitle] = useState("New Message");
  const [body, setBody] = useState("You have a new notification!");
  const [seconds, setSeconds] = useState("5");

  const handleSendImmediate = async () => {
    try {
      await sendImmediateNotification(title, body, { custom: "data" });
      console.log("Immediate notification sent");
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  };

  const handleSchedule = async () => {
    try {
      const delay = parseInt(seconds, 10);
      await schedulePushNotification(title, body, { custom: "data" }, delay);
      console.log(`Notification scheduled for ${delay} seconds`);
    } catch (error) {
      console.error("Failed to schedule notification:", error);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Bell size={32} color="#2B4A7C" />
        <Text style={styles.headerText}>Notifications Demo</Text>
      </View>

      {expoPushToken ? (
        <View style={styles.tokenContainer}>
          <Text style={styles.tokenLabel}>Push Token:</Text>
          <Text style={styles.tokenText} numberOfLines={2}>
            {expoPushToken}
          </Text>
        </View>
      ) : null}

      <View style={styles.inputSection}>
        <Text style={styles.sectionTitle}>Create Notification</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Notification title"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Body</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={body}
            onChangeText={setBody}
            placeholder="Notification body"
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleSendImmediate}
            activeOpacity={0.7}
          >
            <Send size={18} color="#FFF" />
            <Text style={styles.buttonText}>Send Now</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.scheduleSection}>
          <Text style={styles.label}>Schedule (seconds)</Text>
          <View style={styles.scheduleRow}>
            <TextInput
              style={[styles.input, styles.scheduleInput]}
              value={seconds}
              onChangeText={setSeconds}
              placeholder="5"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleSchedule}
              activeOpacity={0.7}
            >
              <Clock size={18} color="#2B4A7C" />
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                Schedule
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {lastNotification && (
        <View style={styles.lastNotificationSection}>
          <Text style={styles.sectionTitle}>Last Notification</Text>
          <View style={styles.notificationCard}>
            <Text style={styles.notificationTitle}>{lastNotification.title}</Text>
            <Text style={styles.notificationBody}>{lastNotification.body}</Text>
            <Text style={styles.notificationTime}>
              {new Date(lastNotification.timestamp).toLocaleTimeString()}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.historySection}>
        <View style={styles.historyHeader}>
          <Text style={styles.sectionTitle}>
            History ({notifications.length})
          </Text>
          <TouchableOpacity
            onPress={clearNotifications}
            style={styles.clearButton}
            activeOpacity={0.7}
          >
            <Trash2 size={18} color="#E53935" />
          </TouchableOpacity>
        </View>

        {notifications.length === 0 ? (
          <Text style={styles.emptyText}>No notifications yet</Text>
        ) : (
          notifications.map((notification) => (
            <View key={notification.id} style={styles.historyCard}>
              <Text style={styles.historyTitle}>{notification.title}</Text>
              <Text style={styles.historyBody}>{notification.body}</Text>
              <Text style={styles.historyTime}>
                {new Date(notification.timestamp).toLocaleString()}
              </Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.actionSection}>
        <TouchableOpacity
          style={[styles.button, styles.dangerButton]}
          onPress={cancelAllNotifications}
          activeOpacity={0.7}
        >
          <Trash2 size={18} color="#FFF" />
          <Text style={styles.buttonText}>Cancel All Scheduled</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => setBadgeCount(5)}
          activeOpacity={0.7}
        >
          <Bell size={18} color="#2B4A7C" />
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Set Badge to 5
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => setBadgeCount(0)}
          activeOpacity={0.7}
        >
          <Bell size={18} color="#2B4A7C" />
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Clear Badge
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 32,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    gap: 12,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#2B4A7C",
  },
  tokenContainer: {
    backgroundColor: "#FFF",
    padding: 16,
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  tokenLabel: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#666",
    marginBottom: 4,
  },
  tokenText: {
    fontSize: 11,
    color: "#333",
    fontFamily: "monospace",
  },
  inputSection: {
    backgroundColor: "#FFF",
    padding: 20,
    marginTop: 16,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#333",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#555",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F5F7FA",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#333",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 8,
    gap: 8,
    flex: 1,
  },
  primaryButton: {
    backgroundColor: "#2B4A7C",
  },
  secondaryButton: {
    backgroundColor: "#E8EEF5",
    borderWidth: 1,
    borderColor: "#2B4A7C",
  },
  dangerButton: {
    backgroundColor: "#E53935",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#FFF",
  },
  secondaryButtonText: {
    color: "#2B4A7C",
  },
  scheduleSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  scheduleRow: {
    flexDirection: "row",
    gap: 12,
  },
  scheduleInput: {
    flex: 1,
  },
  lastNotificationSection: {
    backgroundColor: "#FFF",
    padding: 20,
    marginTop: 16,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  notificationCard: {
    backgroundColor: "#E8F5E9",
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#333",
    marginBottom: 4,
  },
  notificationBody: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: "#666",
  },
  historySection: {
    backgroundColor: "#FFF",
    padding: 20,
    marginTop: 16,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  clearButton: {
    padding: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    paddingVertical: 20,
  },
  historyCard: {
    backgroundColor: "#F5F7FA",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#2B4A7C",
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#333",
    marginBottom: 2,
  },
  historyBody: {
    fontSize: 13,
    color: "#555",
    marginBottom: 4,
  },
  historyTime: {
    fontSize: 11,
    color: "#999",
  },
  actionSection: {
    padding: 20,
    gap: 12,
    marginBottom: 40,
  },
});
