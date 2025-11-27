import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";

import {
  Book,
  DollarSign,
  Facebook,
  FileText,
  Globe,
  Home,
  Newspaper,
  Phone,
  Radio,
} from "lucide-react-native";
import React from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  action: () => void;
}

export default function MenuScreen() {
  const router = useRouter();

  const handleShare = () => {
    Alert.alert("ចែករំលែក", "មុខងារចែករំលែកនឹងត្រូវបានបង្កើតឡើង");
  };

  const handleContact = () => {
    Alert.alert("ទំនាក់ទំនង", "ទូរស័ព្ទ: 012 46 56 92\nអ៊ីមែល: contact@nkdnews.com");
  };

  const menuItems: MenuItem[] = [
    {
      id: "home",
      title: "ដើមដោយ",
      icon: <Home size={24} color="#2B4A7C" />,
      action: () => router.push("/(tabs)")
    },
    {
      id: "national",
      title: "ព័ត៌មានជាតិ",
      icon: <Newspaper size={24} color="#2B4A7C" />,
      action: () => Alert.alert("ព័ត៌មានជាតិ", "មុខងារនេះនឹងត្រូវបានបង្កើតឡើង")
    },
    {
      id: "international",
      title: "ព័ត៌មានអន្តរជាតិ",
      icon: <Globe size={24} color="#2B4A7C" />,
      action: () => Alert.alert("ព័ត៌មានអន្តរជាតិ", "មុខងារនេះនឹងត្រូវបានបង្កើតឡើង")
    },
    {
      id: "economy",
      title: "អចលនទ្រព្យ",
      icon: <DollarSign size={24} color="#2B4A7C" />,
      action: () => Alert.alert("អចលនទ្រព្យ", "មុខងារនេះនឹងត្រូវបានបង្កើតឡើង")
    },
    {
      id: "world",
      title: "សំឡេង: ពិភព កម្ពុជា",
      icon: <Radio size={24} color="#2B4A7C" />,
      action: () => Alert.alert("សំឡេង", "មុខងារនេះនឹងត្រូវបានបង្កើតឡើង")
    },
    {
      id: "terms",
      title: "ទំនួលខុសត្រូវ & ប្រមូលផ្តុំស្រេចនុត",
      icon: <FileText size={24} color="#2B4A7C" />,
      action: () => Alert.alert("លក្ខខណ្ឌ", "មុខងារនេះនឹងត្រូវបានបង្កើតឡើង")
    },
    {
      id: "facebook",
      title: "ចូលរួមលើហ្វេសប៊ុក",
      icon: <Facebook size={24} color="#2B4A7C" />,
      action: handleShare
    },
    {
      id: "contact",
      title: "ចេញនូវគ្នានឹងអនុញ្ញាត",
      icon: <Phone size={24} color="#2B4A7C" />,
      action: handleContact
    },
    {
      id: "ads",
      title: "ឌិគាំទិនចេញកុយកាសាយ៍ពន្ធ",
      icon: <Book size={24} color="#2B4A7C" />,
      action: () => Alert.alert("ការផ្សាយពាណិជ្ជកម្ម", "សម្រាប់ការផ្សាយពាណិជ្ជកម្ម សូមទំនាក់ទំនង: 012 46 56 92")
    },
    {
      id: "about",
      title: "អំពី (សើក នារ ព្រះខ័ន)",
      icon: <Newspaper size={24} color="#2B4A7C" />,
      action: () => Alert.alert("អំពី", "Nokor Dragon Breaking National News & International News")
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1679678691006-0ad24fecb769?w=100" }}
          style={styles.logo}
          contentFit="contain"
        />
        <Text style={styles.headerTitle}>ព័ត៌មាន នាគ ព្រះខ័ន</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={item.action}
          >
            <View style={styles.iconContainer}>
              {item.icon}
            </View>
            <Text style={styles.menuText}>{item.title}</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2B4A7C",
  },
  header: {
    backgroundColor: "#2B4A7C",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  menuItem: {
    backgroundColor: "#2B4A7C",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F0F4F8",
    justifyContent: "center",
    alignItems: "center",
  },
  menuText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
    flex: 1,
  },
  footer: {
    height: 20,
  },
});
