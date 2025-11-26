import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";

import {
  adBanners,
  breakingNews,
  galleryImages,
  newsArticles,
} from "@/mocks/news";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();

  const [marqueeText, setMarqueeText] = useState("");
  const marqueeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fullText = breakingNews.join("   •   ");
    setMarqueeText(fullText + "   •   " + fullText);

    Animated.loop(
      Animated.timing(marqueeAnim, {
        toValue: -1,
        duration: 30000,
        useNativeDriver: true,
      })
    ).start();
  }, [marqueeAnim]);

  const translateX = marqueeAnim.interpolate({
    inputRange: [-1, 0],
    outputRange: [-width * 2, 0],
  });

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
        <View style={styles.youtubeContainer}>
          <WebView
            source={{ uri: "https://www.youtube.com/embed/dQw4w9WgXcQ" }}
            style={styles.youtubePlayer}
            allowsFullscreenVideo
          />
        </View>

        <View style={styles.marqueeContainer}>
          <Animated.Text
            style={[
              styles.marqueeText,
              { transform: [{ translateX }] },
            ]}
            numberOfLines={1}
          >
            {marqueeText}
          </Animated.Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.galleryScroll}
          contentContainerStyle={styles.galleryContent}
        >
          {galleryImages.map((img) => (
            <TouchableOpacity key={img.id} style={styles.galleryItem}>
              <Image source={{ uri: img.uri }} style={styles.galleryImage} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>ព័ត៌មានថ្មី-អន្តរជាតិ-ពាណិជ្ជកម្ម សម្រាប់ប្រជាពលរដ្ឋ</Text>
        </View>

        {newsArticles.map((article, index) => (
          <View key={article.id}>
            {index === 1 && (
              <Image
                source={{ uri: adBanners[0].image }}
                style={styles.adBanner}
                contentFit="cover"
              />
            )}
            
            <TouchableOpacity
              style={styles.newsCard}
              onPress={() => router.push({
                pathname: "/article/[id]" as any,
                params: { id: article.id }
              })}
            >
              <Image
                source={{ uri: article.image }}
                style={styles.newsImage}
                contentFit="cover"
              />
              <View style={styles.newsContent}>
                <Text style={styles.newsCategory}>{article.category}</Text>
                <Text style={styles.newsTitle} numberOfLines={2}>
                  {article.title}
                </Text>
                <Text style={styles.newsDescription} numberOfLines={3}>
                  {article.description}
                </Text>
                <Text style={styles.newsDate}>{article.date}</Text>
              </View>
            </TouchableOpacity>

            {index === 2 && (
              <Image
                source={{ uri: adBanners[1].image }}
                style={styles.adBanner}
                contentFit="cover"
              />
            )}
          </View>
        ))}

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
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
  youtubeContainer: {
    width: width,
    height: 220,
    backgroundColor: "#000000",
  },
  youtubePlayer: {
    flex: 1,
  },
  marqueeContainer: {
    backgroundColor: "#2B4A7C",
    paddingVertical: 10,
    overflow: "hidden",
  },
  marqueeText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  galleryScroll: {
    backgroundColor: "#FFFFFF",
    marginVertical: 8,
  },
  galleryContent: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    gap: 8,
  },
  galleryItem: {
    marginRight: 8,
  },
  galleryImage: {
    width: 180,
    height: 120,
    borderRadius: 8,
  },
  sectionHeader: {
    backgroundColor: "#2B4A7C",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
  newsCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 8,
    marginVertical: 6,
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  newsImage: {
    width: "100%",
    height: 200,
  },
  newsContent: {
    padding: 12,
  },
  newsCategory: {
    fontSize: 12,
    color: "#2B4A7C",
    fontWeight: "600",
    marginBottom: 4,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 6,
    lineHeight: 22,
  },
  newsDescription: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
    marginBottom: 8,
  },
  newsDate: {
    fontSize: 12,
    color: "#999999",
  },
  adBanner: {
    width: width - 16,
    height: 80,
    marginHorizontal: 8,
    marginVertical: 8,
    borderRadius: 8,
  },
  footer: {
    height: 20,
  },
});
