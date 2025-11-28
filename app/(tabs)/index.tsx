import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import YoutubePlayer from "react-native-youtube-iframe";
import * as Font from "expo-font";
import logo from "../../assets/images/icon.png";
import GlobalService from "../services/global-service";
import NkdNewsService from "../services/nkd-news/nkd-news";
import {
  adBanners,
  breakingNews,
  galleryImages,
} from "@/mocks/news";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();

  const [marqueeText, setMarqueeText] = useState("");
  const marqueeAnim = useRef(new Animated.Value(0)).current;

  const [playing, setPlaying] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // NEWS + PAGINATION
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  const globalService = new GlobalService();
  const nkd = new NkdNewsService(globalService);

  const [lastVideo, setLastVideo] = useState<any>(null);

  // ADS GALLERY
  const [adsImages, setAdsImages] = useState<string[]>([]);

  // LOAD ADS
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

  // GALLERY AUTO SCROLL
  useEffect(() => {
    loadAds();
  }, []);

  useEffect(() => {
    let scrollValue = 0;
    let scroller: any;

    const scroll = () => {
      scrollValue += 1;
      scrollViewRef.current?.scrollTo({ x: scrollValue, animated: false });
    };

    scroller = setInterval(scroll, 20);
    return () => clearInterval(scroller);
  }, []);

  // LOAD VIDEO
  useEffect(() => {
    async function fetchLastVideo() {
      const video = await globalService.getLastVideo();
      if (video) setLastVideo(video);
    }
    fetchLastVideo();
  }, []);

  // LOAD FONTS + FIRST PAGE NEWS
  useEffect(() => {
    async function init() {
      await Font.loadAsync({
        KhmerOS: require("../../assets/fonts/KhmerOS_muollight.ttf"),
      });
      setFontsLoaded(true);

      loadPosts(1);
    }
    init();
  }, []);

  // MARQUEE
  useEffect(() => {
    if (!fontsLoaded) return;

    const fullText = breakingNews.join("   •   ");
    setMarqueeText(fullText + "   •   " + fullText);

    Animated.loop(
      Animated.timing(marqueeAnim, {
        toValue: -1,
        duration: 30000,
        useNativeDriver: true,
      })
    ).start();
  }, [fontsLoaded]);

  const translateX = marqueeAnim.interpolate({
    inputRange: [-1, 0],
    outputRange: [-width * 2, 0],
  });

  // 🔥 REUSABLE LOAD FUNCTION
  const loadPosts = async (pageNumber: number) => {
    try {
      const res = await nkd.getAll({ per_page: 10, page: pageNumber });

      if (pageNumber === 1) {
        setNewsArticles(res.data.data);
      } else {
        setNewsArticles((prev) => [...prev, ...res.data.data]);
      }

      setPage(pageNumber);
    } catch (err) {
      console.log("Load error:", err);
    }
  };

  // 🔥 PULL TO REFRESH
  const onRefresh = async () => {
    setRefreshing(true);
    await loadPosts(1);
    setRefreshing(false);
  };

  // 🔥 LOAD MORE (INFINITE SCROLL)
  const loadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    await loadPosts(page + 1);
    setLoadingMore(false);
  };

  // Loading until fonts ready
  if (!fontsLoaded) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  // 🔥 RENDER EACH ARTICLE
  const renderArticle = ({ item: article, index }: any) => (
    <View key={article.id}>
      {index === 1 && adBanners[0] && (
        <Image
          source={{ uri: adBanners[0].image }}
          style={styles.adBanner}
          contentFit="cover"
        />
      )}

      <TouchableOpacity
        style={styles.newsCard}
        onPress={() =>
          router.push({
            pathname: "/article/[id]" as any,
            params: { id: article.id },
          })
        }
      >
        <View style={styles.newsContent}>
          <Text style={styles.newsTitle} numberOfLines={2}>
            {article.title.rendered}
          </Text>

          <View style={{ flexDirection: "row", gap: 2, alignItems: "center" }}>
            <Text style={styles.newsDescription}>{article.title.rendered}</Text>

            <Image
              source={{ uri: article.extra.featured_image }}
              style={styles.newsImage}
              contentFit="cover"
            />
          </View>
        </View>
      </TouchableOpacity>

      {/* Inject ads every 3 posts */}
      {index % 3 === 2 && adsImages[index % adsImages.length] && (
        <Image
          source={{ uri: adsImages[index % adsImages.length] }}
          style={styles.adBanner}
          contentFit="cover"
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} contentFit="contain" />
        <Text style={styles.headerTitle}>ព័ត៌មាន នគរដ្រេហ្គន​</Text>
      </View>

      {/* Video */}
      {lastVideo?.datas && (
        <View style={{ width, height: 220 }}>
          <YoutubePlayer
            height={220}
            width={width}
            play={playing}
            videoId={lastVideo.datas.videoId}
            onChangeState={(state) => {
              if (state === "ended") {
                setPlaying(false);
                setTimeout(() => setPlaying(true), 500);
              }
            }}
          />
        </View>
      )}

      {/* Main list */}
      <FlatList
        ListHeaderComponent={
          <>
            {/* Marquee */}
            <View style={styles.marqueeContainer}>
              <Animated.Text
                style={[styles.marqueeText, { transform: [{ translateX }] }]}
                numberOfLines={1}
              >
                {marqueeText}
              </Animated.Text>
            </View>

            {/* Ads Gallery */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.galleryScroll}
              contentContainerStyle={styles.galleryContent}
              ref={scrollViewRef}
              scrollEnabled={false}
            >
              {adsImages.map((uri, index) => (
                <TouchableOpacity key={index} style={styles.galleryItem}>
                  <Image source={{ uri }} style={styles.galleryImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        }
        data={newsArticles}
        renderItem={renderArticle}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator size="small" style={{ marginVertical: 10 }} />
          ) : (
            <View style={{ height: 10 }} />
          )
        }
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2B4A7C" },
  header: {
    backgroundColor: "#2B4A7C",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  logo: { width: 40, height: 40, borderRadius: 8 },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: "700", 
    color: "#e0dcdcff", 
    fontFamily: "KhmerOS" },
  scrollView: { flex: 1 },
  youtubeContainer: { 
    width: width, 
    height: 220, 
    backgroundColor: "#000000" 
  },
  marqueeContainer: { 
    backgroundColor: "#2B4A7C", 
    paddingVertical: 10, 
    overflow: "hidden" 
  },
  marqueeText: { 
    fontSize: 14, 
    color: "#e0dcdcff", 
    fontFamily: "KhmerOS", 
    fontWeight: "500" 
  },
  galleryScroll: { 
    backgroundColor: "#2B4A7C", 
    marginVertical: 2
  },
  galleryContent: { 
    paddingHorizontal: 2, 
    paddingVertical: 4, 
    gap: 8 
  },
  galleryItem: { marginRight: 2 },
  galleryImage: { 
    width: 180, 
    height: 80, 
    borderRadius: 8 
  },
  newsCard: { 
    backgroundColor: "#fff", 
    marginHorizontal: 8, 
    marginVertical: 6, 
    borderRadius: 8, 
    overflow: "hidden", 
    shadowColor: "#000", 
    shadowOffset: { 
      width: 0, 
      height: 1 
    }, 
    shadowOpacity: 0.1, 
    shadowRadius: 2, 
    elevation: 2 
  },
  newsImage: { width: "40%", borderRadius: 8, height: 100 },
  newsContent: { padding: 12 },
  newsCategory: { fontSize: 12, color: "#2B4A7C", fontWeight: "600", marginBottom: 4 },
  newsTitle: { fontSize: 14, fontWeight: "700", color: "#999999", marginBottom: 6, lineHeight: 22, fontFamily: "KhmerOS" },
  newsDescription: { fontSize: 14, color: "#78787eff", marginBottom: 8, width: "60%",},
  newsDate: { fontSize: 12, color: "#999999" },
  adBanner: { width: width - 16, height: 80, marginHorizontal: 8, marginVertical: 8, borderRadius: 8 },
  footer: { height: 20 },
});
