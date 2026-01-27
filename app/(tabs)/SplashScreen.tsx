import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState, useCallback } from "react";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import logoImage from "../../assets/images/newspaper2.png";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface SplashScreenProps {
  duration?: number; // optional auto-hide
  onFinish?: () => void; // callback to notify RootLayout
}

export default function SplashScreen({ duration = 5000, onFinish }: SplashScreenProps) {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Moulpali: require("../../assets/fonts/Moulpali-Regular.ttf"),
  });

  const [touchEnabled, setTouchEnabled] = useState(true);

  // ✅ Auto hide after duration
  useEffect(() => {
    if (!fontsLoaded) return;

    const timer = setTimeout(() => {
      handlePress();
    }, duration);

    return () => clearTimeout(timer);
  }, [fontsLoaded, duration]);

  const handlePress = () => {
    if (!touchEnabled) return;
    setTouchEnabled(false);
    onFinish?.(); // RootLayout will handle navigation
  };

  if (!fontsLoaded) return null;

  return (
    <LinearGradient
      colors={["#E8E5DD", "#F5F2EA", "#FFFFFF"]}
      style={styles.container}
    >
      {/* LOGO */}
      <View style={styles.logoContainer}>
        <Image source={logoImage} style={styles.logo} resizeMode="contain" />

        {/* KHMER TEXT */}
        <Text style={styles.khmerText}>នគរដ្រេហ្គន​ ព័ត៌មានជាតិ-</Text>
        <Text style={styles.khmerText}>អន្តរជាតិទាន់ហេតុការណ៍</Text>
        <Text style={styles.khmerText}>សម្បូរបែប</Text>
        <Text style={styles.khmerText}>ប្រកបដោយក្រមសីលធម៍</Text>
        <Text style={styles.khmerText}>និងវិជ្ជាជិវៈដោយផ្ទាល់</Text>

        {/* ENGLISH TEXT */}
        <Text style={styles.enText}>Nokor Dragon Breaking National News</Text>
        <Text style={styles.enText}>& International News</Text>
      </View>

      {/* BUTTON */}
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.85}
        onPress={handlePress}
      >
        <Text style={styles.buttonText}>ចូលអាន</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: height * 0.15,
    paddingBottom: 60,
  },
  logoContainer: {
    alignItems: "center",
    gap: 14,
  },
  logo: {
    width: 180,
    height: 180,
    borderRadius: 40,
    marginBottom: 20,
  },
  khmerText: {
    fontFamily: "Moulpali",
    fontSize: 15,
    lineHeight: 26,
    textAlign: "center",
    color: "#4A5568",
  },
  enText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    color: "#718096",
  },
  button: {
    backgroundColor: "#2B4A7C",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 25,
    elevation: 6,
  },
  buttonText: {
    fontFamily: "Moulpali",
    fontSize: 18,
    color: "#FFF",
  },
});
