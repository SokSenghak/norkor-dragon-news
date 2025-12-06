import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Font from "expo-font";

import logo from "../../assets/images/icon.png";
import homeImg from "../../assets/images/home.png";
import about from "../../assets/images/about.png";
import domestic from "../../assets/images/domestic.png";
import international from "../../assets/images/international.png";
import real_estate from "../../assets/images/real-estate.png";
import sport from "../../assets/images/sport.png";
import book_story from "../../assets/images/book-story.png";
import social_network from "../../assets/images/social-network.png";
import emergency_number from "../../assets/images/emergency-number.png";
import ads from "../../assets/images/ads.png";

interface MenuItem {
  id: number | string | null;
  url: string;
  title: string;
  icons: any; // can be ReactNode or require(image)
  action: () => void;
  isPage: boolean
}

export default function MenuScreen() {
  const router = useRouter();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const handleShare = () => {
    Alert.alert("ចែករំលែក", "មុខងារចែករំលែកនឹងត្រូវបានបង្កើតឡើង");
  };

  const handleContact = () => {
    Alert.alert("ទំនាក់ទំនង", "ទូរស័ព្ទ: 012 46 56 92\nអ៊ីមែល: contact@nkdnews.com");
  };

  const menuItems: MenuItem[] = [
    { title: 'ទំព័រដើម', url: '/', id: "home", icons: homeImg, action: () => router.push('/'), isPage: false },
    { title: 'ព័ត៌មានជាតិ', url: '/list/66', id: "66", icons: domestic, action: () => router.push('/list/66'), isPage: false },
    { title: 'ព័ត៌មានអន្តរជាតិ', url: '/list/8', id: "8", icons: international, action: () => router.push('/list/8'), isPage: false },
    { title: 'អចលនទ្រព', url: '/list/19', id: "19", icons: real_estate, action: () => router.push('/list/19'), isPage: false },
    { title: 'សិល្បៈ កីឡា ការងារ', url: '/list/67,15', id: "67,15", icons: sport, action: () => router.push('/list/67,15'), isPage: false },
    { title: 'រឿងព្រេងនិទាន & ប្រវត្ដិសាស្រ្ដខ្មែរ', url: '/list/71', id: "71", icons: book_story, action: () => router.push('/list/71'), isPage: false },
    { title: 'បណ្តាញសង្គម', url: '/page/5724', id: "5724", icons: social_network, action: () => router.push('/list/5724'), isPage: true},
    { title: 'លេខសង្រ្គោះបន្ទាន់', url: '/page/38051', id: "38051", icons: emergency_number, action: () => router.push('/list/38051'), isPage: true },
    { title: 'ទំនាក់ទំនងផ្សាយពាណិជ្ជកម្ម', url: '/page/7427', id: "7427", icons: ads, action: () => router.push('/list/7427'), isPage: true },
    { title: 'អំពី យើង (នគរ ដ្រេហ្គន)', url: '/page/412314', id: "412314", icons: about, action: () => router.push('/list/412314'), isPage: true },
  ];
  
  useEffect(() => {
    async function init() {
      await Font.loadAsync({
        KhmerOS: require("../../assets/fonts/KhmerOS_muollight.ttf"),
      });
      setFontsLoaded(true);
    }
    init();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Image source={logo} style={styles.logo} contentFit="contain" />
        {fontsLoaded ? (
          <Text style={[styles.headerTitle, { fontFamily: "KhmerOS" }]}>
            ព័ត៌មាន នគរដ្រេហ្គន​
          </Text>
        ) : null}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id?.toString()}
            style={styles.menuItem}
            onPress={item.action}
          >
            <View style={styles.iconContainer}>
              {typeof item.icons === "number" ? (
                <Image source={item.icons} style={{ width: 24, height: 24 }} />
              ) : (
                item.icons
              )}
            </View>
            {fontsLoaded ? (
              <Text style={[styles.menuText, { fontFamily: "KhmerOS" }]}>{item.title}</Text>
            ): null}
          </TouchableOpacity>
        ))}
        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2B4A7C" },
  header: { backgroundColor: "#2B4A7C", flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  logo: { width: 40, height: 40, borderRadius: 8 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#FFFFFF" },
  scrollView: { flex: 1 },
  menuItem: { 
    backgroundColor: "#2B4A7C", 
    flexDirection: "row", 
    alignItems: "center", 
    paddingHorizontal: 6, 
    paddingVertical: 6, 
    marginHorizontal: 8, 
    marginVertical: 4, 
    borderRadius: 12, 
    shadowColor: "#000", 
    shadowOffset: { 
      width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1, gap: 16 },
  iconContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#F0F4F8", justifyContent: "center", alignItems: "center" },
  menuText: { fontSize: 15, fontWeight: "600", color: "#FFFFFF", flex: 1 },
  footer: { height: 20 },
});
