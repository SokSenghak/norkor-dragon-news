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

import GlobalService from "../../services/global-service";
import NkdNewsService from "../../services/nkdNewsService";
import AutoMarqueeRepeat from "@/components/AutoMarqueeRepeat";

const { width } = Dimensions.get("window");

interface Post {
  guid: any;
  id: number;
  categoryTitles: string[]; // new field for category titles
  categoryObjects: any[]; // new field for full category objects
  categories: number[]; // original category IDs
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
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const nkd = new NkdNewsService(globalService);
  const [adsImages, setAdsImages] = useState<string[]>([]);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [fullList, setFullList] = useState([]);
  const postid = id;
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
    async function fetchPost() {
      setLoading(true);
      const data = await globalService.APIGetPostByID(Number(id));
      if (data) {
        // STEP 1: Map category IDs to category objects
        const mappedCategories = mapPostCategories(data.categories);
        // STEP 2: Enrich post object
        const enrichedPost = {
          ...data,
          categoryObjects: mappedCategories, // 👈 new field
          categoryTitles: mappedCategories.map(c => c.title), // 👈 optional shortcut
        };
        
        setPost(enrichedPost);
      }
      setLoading(false);
    }
    fetchPost();
  }, [id]);

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
  let htmlImageIndex = 0;

  const renderers = {
    img: ({ tnode }: any) => {
      const uri = tnode.attributes.src;
      const isFirstImage = htmlImageIndex === 0;

      htmlImageIndex++;

      return (
        <Image
          source={{ uri }}
          contentFit={isFirstImage ? "contain" : "cover"}
          style={[
            styles.htmlImage,
            isFirstImage && styles.firstHtmlImage,
          ]}
        />
      );
    },
  };

  useEffect(() => {
    setFullList([...adsImages, ...adsImages]);
  }, [adsImages]);

  useEffect(() => {
    let position = 0;
    const interval = setInterval(() => {
      position += 1;
      scrollViewRef.current?.scrollTo({
        x: position,
        animated: false,
      });
      if (position > adsImages.length * 150) {
        position = 0;
      }
    }, 10);
    return () => clearInterval(interval);
  }, [adsImages]);

  useEffect(() => {
    if (!postid) return;
    getPostImage(postid);
  }, [postid]);

  const getPostImage = async (postid: string | string[]) => {
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
          <Text style={styles.backButtonText}>ត្រលប់</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Share2 size={20} color="#FFFFFF" />
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
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.articleContainer}>
          {featuredImage && (
            <Image source={{ uri: featuredImage }} style={styles.articleImage} contentFit="cover" />
          )}
          <Text style={styles.category}>
            {post?.categoryTitles?.length
              ? post.categoryTitles.join(" • ")
              : "ព័ត៌មាន"}
          </Text>
          <Text style={styles.articleTitle}>
            {post.title.rendered.replace(/&#8211;/g, "–").replace(/&#8216;/g, "‘").replace(/&#8217;/g, "’").replace(/&amp;/g, "&")}
          </Text>
          <View style={styles.articleContent}>
            <RenderHtml
              contentWidth={width - 32}
              source={{ html: post.content.rendered }}
              renderers={renderers}
              tagsStyles={{
                p: { fontSize: 16, lineHeight: 24, marginBottom: 12, color: "#333" },
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
    backgroundColor: "#2B4A7C" 
  },
  htmlImage: {
    marginVertical: 8,
    borderRadius: 8,
    width: "100%",
    height: 150,
  },
  firstHtmlImage: {
    marginVertical: 16,
    borderRadius: 12,
    height: 100,
  },
  galleryContentads: { 
    paddingHorizontal: 2, 
    paddingVertical: 4,  
  },
  marqueeContainerAds: { 
    backgroundColor: "#2B4A7C",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
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
    paddingTop: Platform.OS === "ios" ? 60 : 30,
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
    borderWidth: 1,
    borderColor: "#FFFFFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 6,
    borderRadius: 8
  },
  shareButtonText: { fontSize: 14, fontWeight: "600", color: "#FFFFFF" },
  scrollView: { flex: 1 },
  marqueeContainer: { backgroundColor: "#2B4A7C", paddingVertical: 10, overflow: "hidden" },
  marqueeText: { fontSize: 14, color: "#FFFFFF", fontWeight: "500" ,fontFamily: "KhmerOS"},
  galleryContent: { paddingHorizontal: 8, paddingVertical: 12, gap: 8 },
  galleryItem: { marginRight: 8 },
  galleryImage: { width: 180, height: 80, borderRadius: 8 },
  adBanner: { width: Dimensions.get("window").width - 16, height: 80, marginHorizontal: 8, marginVertical: 8, borderRadius: 8 },
  articleContainer: { 
    backgroundColor: "#FFFFFF", 
    marginHorizontal: 8, 
    marginVertical: 8, 
    borderRadius: 8, 
    overflow: "hidden", 
    shadowColor: "#000", 
    shadowOffset: { 
      width: 0, 
      height: 2 
    }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 3 
  },
  articleImage: { width: "100%", height: 250 },
  articleContent: { padding: 16 },
  articleTitle: { fontSize: 20, fontWeight: "500", color: "red", marginBottom: 8, lineHeight: 28 , paddingHorizontal: 16, paddingTop: 16},
  category: { fontSize: 14, fontWeight: "300", color: "red", paddingHorizontal: 16, paddingTop: 16},
  articleDate: { fontSize: 12, color: "#999999", marginBottom: 16 },
  articleBody: { fontSize: 15, color: "#333333", lineHeight: 24, marginBottom: 16 },
  errorText: { fontSize: 16, color: "#999999", textAlign: "center", marginTop: 40 },
  footer: { height: 20 },
});
