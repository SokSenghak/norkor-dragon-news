import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft, Share2 } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { WebView } from "react-native-webview";

import {
  ActivityIndicator,
  Dimensions,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import GlobalService from "../../services/global-service";
import NkdNewsService from "../../services/nkdNewsService";
import AutoMarqueeRepeat from "@/components/AutoMarqueeRepeat";

interface Post {
  guid: any;
  id: number;
  categoryTitles: string[];
  categoryObjects: any[];
  categories: number[];
  title: { rendered: string };
  content: { rendered: string };
  date: string;
  extra?: { featured_image?: string };
}

export default function PostDetailScreen() {
  const globalService = new GlobalService();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const nkd = new NkdNewsService(globalService);
  const [adsImages, setAdsImages] = useState<string[]>([]);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [fullList, setFullList] = useState<string[]>([]);
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);

  const categories = [
    { title: 'ព័ត៌មានជាតិ', url: '/list/66', id: "66" },
    { title: 'ព័ត៌មានថ្មី', url: '/list/1', id: "1" },
    { title: 'ព័ត៌មានអន្តរជាតិ', url: '/list/8', id: "8" },
    { title: 'អចលនទ្រព', url: '/list/19', id: "19" },
    { title: 'សិល្បៈ កីឡា ការងារ', url: '/list/67,15', id: "67,15" },
    { title: 'រឿងព្រេងនិទាន & ប្រវត្ដិសាស្រ្ដខ្មែរ', url: '/list/71', id: "71" },
    { title: 'បណ្តាញសង្គម', url: '/page/5724', id: "5724" },
    { title: 'លេខសង្រ្គោះបន្ទាន់', url: '/page/38051', id: "38051" },
    { title: 'ទំនាក់ទំនងផ្សាយពាណិជ្ជកម្ម', url: '/page/7427', id: "7427" },
    { title: 'អំពី យើង (នគរ ដ្រេហ្គន)', url: '/page/412314', id: "412314" }
  ];

  const [safeUrl, setSafeUrl] = useState("");

  const screenHeight = Dimensions.get("window").height;

  
  const getDataDetail = async (id: string) => {
    try {
      if (!id) return;

      const safe = `http://nkdnews.com/archives/${id}?viewapp=1`;

      setSafeUrl(safe);

      const res = await fetch(
        `http://nkdnews.com/wp-json/wp/v2/posts/${id}`
      );

    } catch (error) {
      console.log("Detail fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getDataDetail(id);
    }
  }, [id]);

  const normalizedCategories = categories.map(cat => ({
    ...cat,
    ids: cat.id.split(',').map(Number),
  }));

  const mapPostCategories = (postCategoryIds = []) => {
    return normalizedCategories.filter(cat =>
      cat.ids.some(id => postCategoryIds.includes(id))
    );
  };

  const loadAds = async () => {
    const res = await nkd.getAdsByID({ page_id: 885629 });
    if (res?.content?.rendered) {
      const imgs = extractAdImages(res.content.rendered);
      setAdsImages(imgs);
    }
  };

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      const data = await globalService.APIGetPostByID(Number(id));
      if (data) {
        const mappedCategories = mapPostCategories(data.categories);
        const enrichedPost = {
          ...data,
          categoryObjects: mappedCategories,
          categoryTitles: mappedCategories.map(c => c.title),
        };
        setPost(enrichedPost);
      }
      setLoading(false);
    }
    fetchPost();
  }, [id]);

  const extractAdImages = (html: string) => {
    const regex = /<img[^>]+src="([^">]+)"/g;
    const images: string[] = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
      images.push(match[1]);
    }
    return images;
  };

  useEffect(() => {
    loadAds();
  }, []);

  useEffect(() => {
    setFullList([...adsImages, ...adsImages]);
  }, [adsImages]);

  useEffect(() => {
    let position = 0;
    const interval = setInterval(() => {
      position += 1;
      scrollViewRef.current?.scrollTo({ x: position, animated: false });
      if (position > adsImages.length * 150) position = 0;
    }, 10);
    return () => clearInterval(interval);
  }, [adsImages]);

  useEffect(() => {
    if (!id) return;
    getPostImage(id);
  }, [id]);

  const getPostImage = async (postid: string) => {
    try {
      const res = await fetch(
        `http://nkdnews.com/wp-json/wp/v2/posts/${postid}?_embed`
      );
      const data = await res.json();
      const image =
        data?._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;
      setFeaturedImage(image);
    } catch (error) {
      console.error("Fetch image error:", error);
    }
  };

  const handleShare = async () => {
    try {
      if (!post) return;

      const title = post?.title?.rendered;
      const link = post?.guid?.rendered;

      await Share.share({
        title,
        message: `${title}\n\n${link}`,
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
        <Text>Post not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerButtons}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={22} color="#FFF" />
          <Text style={styles.backButtonText}>ត្រលប់</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Share2 size={20} color="#FFF" />
          <Text style={styles.shareButtonText}>ចែករំលែក</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.marqueeContainerAds}>
         <AutoMarqueeRepeat
          text="នគរដ្រេហ្គន​ ព័ត៌មានជាតិ-អន្តរជាតិទាន់ហេតុការណ៍ សម្បូរបែប ប្រកបដោយក្រមសីលធម៌ និងវិជ្ជាជីវៈដោយផ្ទាល់"
          speed={40}
          textStyle={{ fontFamily: "KhmerOS", fontSize: 14, color: "#e0dcdcff" }}
          containerStyle={{ backgroundColor: "#2B4A7C", paddingVertical: 6 }}
        />

        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          contentContainerStyle={{ alignItems: "center" }}
        >
          {fullList.map((uri, index) => (
            <TouchableOpacity key={index} style={{ marginRight: 10 }}>
              <Image
                source={{ uri }}
                style={{ width: 190, height: 80, borderRadius: 10 }}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

        {/* {featuredImage && (
          <Image
            source={{ uri: featuredImage }}
            style={{ width: "100%", height: 250 }}
            contentFit="cover"
          />
        )}
        <Text style={styles.category}>
          {post?.categoryTitles?.length
            ? post.categoryTitles.join(" • ")
            : "ព័ត៌មាន"}
        </Text>
        <Text style={styles.articleTitle}>
          {post.title.rendered
            .replace(/&#8211;/g, "–")
            .replace(/&#8216;/g, "‘")
            .replace(/&#8217;/g, "’")
            .replace(/&amp;/g, "&")}
        </Text> */}

        <View style={{ flex: 1 }}>
          <WebView
            source={{ uri: safeUrl }}
            style={{ height: screenHeight }}
            injectedJavaScript={`
              setTimeout(function() {
                const height = document.body.scrollHeight;
                window.ReactNativeWebView.postMessage(height);
              }, 500);
              true;
            `}
            
          />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerButtons: {
    paddingTop: Platform.OS === "ios" ? 60 : 30,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#2B4A7C",
  },
  category: { fontSize: 14, fontWeight: "300", color: "red", paddingHorizontal: 16, paddingTop: 16 },
  articleTitle: { fontSize: 18, fontWeight: "bold", color: "red", paddingHorizontal: 16, paddingBottom: 16 },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFF",
    padding: 6,
    borderRadius: 8,
    gap: 6,
  },
  backButtonText: { color: "#FFF" },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFF",
    padding: 6,
    borderRadius: 8,
    gap: 6,
  },
  shareButtonText: { color: "#FFF" },
  marqueeContainerAds: { backgroundColor: "#2B4A7C" },
});
