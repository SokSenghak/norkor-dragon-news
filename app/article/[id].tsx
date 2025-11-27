import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft, Share2 } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import RenderHtml from "react-native-render-html";
import {
  ActivityIndicator,
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

import GlobalService from "../services/global-service";

const { width } = Dimensions.get("window");

interface Post {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  date: string;
  extra?: { featured_image?: string };
  gallery?: string[]; // optional array of image URLs
  ads?: string[]; // optional array of ad URLs
  breaking?: string[]; // optional breaking news items
}

export default function PostDetailScreen() {
  const globalService = new GlobalService();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [marqueeText, setMarqueeText] = useState("");
  const marqueeAnim = useRef(new Animated.Value(0)).current;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      const data = await globalService.APIGetPostByID(Number(id));
      if (data) setPost(data);
      setLoading(false);
    }
    fetchPost();
  }, [id]);

  // use post.breaking for marquee if available
  useEffect(() => {
    if (!post) return;
    const breakingText = post.breaking?.join("   •   ") || "";
    setMarqueeText(breakingText + "   •   " + breakingText);

    Animated.loop(
      Animated.timing(marqueeAnim, {
        toValue: -1,
        duration: 30000,
        useNativeDriver: true,
      })
    ).start();
  }, [marqueeAnim, post]);

  const translateX = marqueeAnim.interpolate({
    inputRange: [-1, 0],
    outputRange: [-width * 2, 0],
  });

  const handleShare = async () => {
  try {
    if (!post) return;

    const title = post?.title?.rendered;
    const link = post?.guid?.rendered ;
    const image = post.extra?.featured_image;
    // Social preview will be generated from LINK metadata
    const message = `${title}\n\nអានបន្ត៖\n${link}`;

    if (Platform.OS === "web") {
      alert("Sharing only works on mobile.");
      return;
    }

    await Share.share({
      title,
      message,
      url: link,
    });

  } catch (err) {
    console.error("Share error:", err);
  }
};



  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2B4A7C" />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Post not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerButtons}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={22} color="#FFFFFF" />
          <Text style={styles.backButtonText}>ត្រឡប់ក្រោយ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Share2 size={20} color="#FFFFFF" />
          <Text style={styles.shareButtonText}>ចែករំលែក</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Marquee */}
        {post.breaking && post.breaking.length > 0 && (
          <View style={styles.marqueeContainer}>
            <Animated.Text style={[styles.marqueeText, { transform: [{ translateX }] }]} numberOfLines={1}>
              {marqueeText}
            </Animated.Text>
          </View>
        )}

        {/* Gallery */}
        {post.gallery && post.gallery.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.galleryScroll} contentContainerStyle={styles.galleryContent}>
            {post.gallery.map((imgUri, index) => (
              <TouchableOpacity key={index} style={styles.galleryItem}>
                <Image source={{ uri: imgUri }} style={styles.galleryImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Ads */}
        {post.ads && post.ads.length > 0 && post.ads.map((adUri, index) => (
          <Image key={index} source={{ uri: adUri }} style={styles.adBanner} contentFit="cover" />
        ))}

        {/* Article Content */}
        <View style={styles.articleContainer}>
          {post.extra?.featured_image && (
            <Image source={{ uri: post.extra?.featured_image }} style={styles.articleImage} contentFit="cover" />
          )}
          <View style={styles.articleContent}>
           <RenderHtml
              contentWidth={width - 32}
              source={{ html: post.content.rendered }}
              tagsStyles={{
                p: { fontSize: 16, lineHeight: 24, marginBottom: 12, color: "#333" },
                img: { marginVertical: 8, borderRadius: 8 },
                a: { color: "#2B4A7C" },
              }}
            />
          </View>
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F5F5F5" 
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  centered: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  headerButtons: {
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#2B4A7C",
    alignItems: "center",
  },
  shareButton: {
    flexDirection: "row", 
    alignItems: "center", 
    gap: 6, 
    backgroundColor: "rgba(255,255,255,0.2)", 
    paddingVertical: 8, 
    paddingHorizontal: 16, 
    borderRadius: 20 
  },
  shareButtonText: { fontSize: 14, fontWeight: "600", color: "#FFFFFF" },
  scrollView: { flex: 1 },
  marqueeContainer: { backgroundColor: "#2B4A7C", paddingVertical: 10, overflow: "hidden" },
  marqueeText: { fontSize: 14, color: "#FFFFFF", fontWeight: "500" },
  galleryScroll: { backgroundColor: "#FFFFFF", marginVertical: 8 },
  galleryContent: { paddingHorizontal: 8, paddingVertical: 12, gap: 8 },
  galleryItem: { marginRight: 8 },
  galleryImage: { width: 180, height: 120, borderRadius: 8 },
  adBanner: { width: Dimensions.get("window").width - 16, height: 80, marginHorizontal: 8, marginVertical: 8, borderRadius: 8 },
  articleContainer: { backgroundColor: "#FFFFFF", marginHorizontal: 8, marginVertical: 8, borderRadius: 8, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  articleImage: { width: "100%", height: 250 },
  articleContent: { padding: 16 },
  articleTitle: { fontSize: 20, fontWeight: "700", color: "#1A1A1A", marginBottom: 8, lineHeight: 28 },
  articleDate: { fontSize: 12, color: "#999999", marginBottom: 16 },
  articleBody: { fontSize: 15, color: "#333333", lineHeight: 24, marginBottom: 16 },
  errorText: { fontSize: 16, color: "#999999", textAlign: "center", marginTop: 40 },
  footer: { height: 20 },
});
