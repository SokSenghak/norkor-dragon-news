import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { Share2 } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { adBanners, breakingNews, galleryImages, newsArticles } from "@/mocks/news";

const { width } = Dimensions.get("window");

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [marqueeText, setMarqueeText] = useState("");
  const marqueeAnim = useRef(new Animated.Value(0)).current;

  const article = newsArticles.find((a) => a.id === id);

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

  const handleShare = async () => {
    try {
      if (Platform.OS === "web") {
        alert("Share functionality");
      } else {
        await Share.share({
          message: article?.title || "Share article",
          url: "https://nkdnews.com",
        });
      }
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  if (!article) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Article not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerButtons}>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Share2 size={20} color="#FFFFFF" />
          <Text style={styles.shareButtonText}>ចែករំលែក</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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

        <Image
          source={{ uri: adBanners[0].image }}
          style={styles.adBanner}
          contentFit="cover"
        />

        <View style={styles.articleContainer}>
          <Image
            source={{ uri: article.image }}
            style={styles.articleImage}
            contentFit="cover"
          />

          <View style={styles.articleContent}>
            <Text style={styles.articleCategory}>{article.category}</Text>
            <Text style={styles.articleTitle}>{article.title}</Text>
            <Text style={styles.articleDate}>{article.date}</Text>
            
            <Text style={styles.articleBody}>{article.description}</Text>
            <Text style={styles.articleBody}>
              សាម៉ាត្រី AFP ថាម្បូរទិ ទីប៊ី ដឹងថ្មី ថ្លៃបទីធុ ចាន់ស្រ្គស្គ ក្រកម្មល្គុកមុរតើកញសារទេជាអ្ងកល្គកត្គោមខាអ្ន គ្គឃ្នស្រមុសអាលឹកដុធ្វើទេអាលកើតត្វាយចោសញុ៉កមុសទា។
            </Text>
            <Text style={styles.articleBody}>
              ក្រឃោដក្រូល្គភម មានក់ នីងថ្ងគស្រូន្កូករលនវខាម មានក័ គុម ថ្លៃបទីធុ ចាន់ស្រ្គស្គ ក្រកម្មល្គុកមុរតើកញសារទេជាអ្ងកល្គកត្គោមខាអ្ន។
            </Text>
          </View>
        </View>

        <Image
          source={{ uri: adBanners[1].image }}
          style={styles.adBanner}
          contentFit="cover"
        />

        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  headerButtons: {
    backgroundColor: "#2B4A7C",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  scrollView: {
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
  adBanner: {
    width: width - 16,
    height: 80,
    marginHorizontal: 8,
    marginVertical: 8,
    borderRadius: 8,
  },
  articleContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 8,
    marginVertical: 8,
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  articleImage: {
    width: "100%",
    height: 250,
  },
  articleContent: {
    padding: 16,
  },
  articleCategory: {
    fontSize: 12,
    color: "#2B4A7C",
    fontWeight: "600",
    marginBottom: 8,
  },
  articleTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
    lineHeight: 28,
  },
  articleDate: {
    fontSize: 12,
    color: "#999999",
    marginBottom: 16,
  },
  articleBody: {
    fontSize: 15,
    color: "#333333",
    lineHeight: 24,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#999999",
    textAlign: "center",
    marginTop: 40,
  },
  footer: {
    height: 20,
  },
});
