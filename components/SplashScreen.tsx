import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Animated,
  Image,
} from "react-native";
import * as Font from "expo-font";
const { width, height } = Dimensions.get("window");

interface SplashScreenProps {
  duration?: number;
  onFinish?: () => void;
}

// Import your local image
import logoImage from "../assets/images/newspaper2.png";

export default function SplashScreen({
  
  duration = 3500, // ⏱ wait time (ms)
  onFinish,
}: SplashScreenProps) {
  const opacity = useRef(new Animated.Value(1)).current;
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      // fade out
      Animated.timing(opacity, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        onFinish?.();
      });
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const init = async () => {
      await Font.loadAsync({
        Moulpali: require("../assets/fonts/Moulpali-Regular.ttf"),
      });
      setFontsLoaded(true);
    };
    init();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <LinearGradient
        colors={["#E8E5DD", "#F5F2EA", "#FFFFFF"]}
        style={styles.gradient}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            {/* Replace emoji with your actual logo */}
            <Image
              source={logoImage}
              style={styles.logoBg} // use same size & borderRadius as before
              resizeMode="contain"
            />
          </View>

          <Text style={styles.appSubtitle}>នគរដ្រេហ្គន​ ព័ត៌មានជាតិ-​</Text>
          <Text style={styles.appSubtitle}>អន្តរជាតិទាន់ហេតុការណ៍</Text>
          <Text style={styles.appSubtitle}>សម្បូរបែប</Text>
          <Text style={styles.appSubtitle}>ប្រកបដោយក្រមសីលធម៍</Text>
          <Text style={styles.appSubtitle}>និងវិជ្ជាជិវៈដោយផ្ទាល់</Text>
          <Text style={styles.appSubtitle}>
            Nokor Dragon Breaking National News
          </Text>
          <Text style={styles.appSubtitle}>
            & International News
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <View style={styles.enterButton}>
            <Text style={styles.enterText}>ចូលអាន</Text>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: height * 0.15,
    paddingBottom: 60,
  },
  logoContainer: {
    alignItems: "center",
    gap: 16,
  },
  logoBox: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  logoBg: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2B4A7C",
    textAlign: "center",
    fontFamily: "Moulpali",
    marginTop: 8,
  },
  appSubtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#4A5568",
    textAlign: "center",
    fontFamily: "Moulpali",
    lineHeight: 22,
  },
  appDescription: {
    fontSize: 14,
    fontWeight: "400",
    color: "#718096",
    textAlign: "center",
    lineHeight: 20,
  },
  buttonContainer: {
    width: width * 0.6,
    alignItems: "center",
  },
  enterButton: {
    backgroundColor: "#2B4A7C",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 25,
    shadowColor: "#2B4A7C",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  enterText: {
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "Moulpali",
    color: "#FFFFFF",
  },
});
