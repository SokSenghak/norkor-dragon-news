import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#E8E5DD", "#F5F2EA", "#FFFFFF"]}
        style={styles.gradient}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <LinearGradient
              colors={["#87CEEB", "#FF69B4", "#FFB6C1"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoBg}
            >
              <Text style={styles.logoText}>🐉</Text>
            </LinearGradient>
          </View>
          
          <Text style={styles.appTitle}>នគរព្រះខ័ន ព័ត៌មាន</Text>
          <Text style={styles.appSubtitle}>ព័ត៌មានជាតិ-អន្តរជាតិ-ពាណិជ្ជកម្ម</Text>
          <Text style={styles.appSubtitle}>អន្តរជាតិជាតិភាគតាម សម្រាប់ប្រជាពលរដ្ឋ</Text>
          <Text style={styles.appSubtitle}>ពិតដៃសូម្បីកូនស្លោចប់</Text>
          <Text style={styles.appSubtitle}>ជំវិយ្យគាណិតាយោជាល់</Text>
          <Text style={styles.appDescription}>
            Nokor Dragon Breaking National News
          </Text>
          <Text style={styles.appDescription}>
            & International News
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <View style={styles.enterButton}>
            <Text style={styles.enterText}>ចូលអាន</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
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
  logoText: {
    fontSize: 100,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2B4A7C",
    textAlign: "center",
    marginTop: 8,
  },
  appSubtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#4A5568",
    textAlign: "center",
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  enterText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
