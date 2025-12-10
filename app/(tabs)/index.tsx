import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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
import GlobalService from "../../services/global-service";
import NkdNewsService from "../../services/nkd-news/nkd-news";
import { FlatList, GestureHandlerRootView, RefreshControl } from "react-native-gesture-handler";
import AutoMarqueeRepeat from "../../components/AutoMarqueeRepeat";
import { Audio } from "expo-av";
import { useNotifications } from "@/contexts/NotificationContext";
import * as Clipboard from "expo-clipboard";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastVideo, setLastVideo] = useState<any>(null);
  const [adsImages, setAdsImages] = useState<string[]>([]);
  const [fullList, setFullList] = useState<string[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const globalService = new GlobalService();
  const nkd = new NkdNewsService(globalService);
  const { fcmToken, expoPushToken } = useNotifications();
  // Sound refs
  const refreshSound = useRef<Audio.Sound | null>(null);
  const [soundLoaded, setSoundLoaded] = useState(false);

  const copyToken = async () => {
    if (!fcmToken) return;
    await Clipboard.setStringAsync(fcmToken);
    alert("Copied to clipboard!");
  };

  // Load sound once on mount
  useEffect(() => {
    const loadSound = async () => {
      try {
        refreshSound.current = new Audio.Sound();
        await refreshSound.current.loadAsync(require("../../assets/audio/loading.mp3"));
        setSoundLoaded(true);
      } catch (err) {
        console.log("Sound preload error:", err);
      }
    };

    loadSound();

    return () => {
      refreshSound.current?.unloadAsync();
    };
  }, []);

  const playSound = async () => {
    try {
      if (refreshSound.current && soundLoaded) {
        await refreshSound.current.replayAsync();
      }
    } catch (err) {
      console.log("Play sound error:", err);
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

  const loadAds = async () => {
    try {
      const res = await nkd.getAdsByID({ page_id: 885629 });
      if (res?.content?.rendered) {
        const imgs = extractAdImages(res.content.rendered);
        setAdsImages(imgs);
      }
    } catch (err) {
      console.log("Ads load error:", err);
    }
  };

  useEffect(() => {
    loadAds();
  }, []);

  useEffect(() => {
    setFullList([...adsImages, ...adsImages]);
  }, [adsImages]);

  const fetchLastVideo = async () => {
    try {
      const video = await globalService.getLastVideo();
      if (video) setLastVideo(video);
    } catch (err) {
      console.log("Fetch last video error:", err);
    }
  };

  useEffect(() => {
    fetchLastVideo();
  }, []);

  useEffect(() => {
    const init = async () => {
      await Font.loadAsync({
        KhmerOS: require("../../assets/fonts/KhmerOS_muollight.ttf"),
      });
      setFontsLoaded(true);
      loadPosts(1);
    };
    init();
  }, []);

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

  const onRefresh = async () => {
    await playSound(); // play preloaded sound
    setRefreshing(true);
    await loadPosts(1);
    setRefreshing(false);
  };

  const loadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);

    await loadPosts(page + 1);
    await playSound(); // play preloaded sound
    setLoadingMore(false);
  };

  // Auto scroll ads horizontally
  useEffect(() => {
    let position = 0;
    const interval = setInterval(() => {
      position += 1;
      scrollViewRef.current?.scrollTo({ x: position, animated: false });
      if (position > adsImages.length * 150) position = 0;
    }, 16);
    return () => clearInterval(interval);
  }, [adsImages]);

  if (!fontsLoaded) {
    return (
      <SafeAreaView >
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  const renderArticle = ({ item, index }: any) => (
    <View key={item.id} style={styles.newsCard}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => router.push({ pathname: "/article/[id]", params: { id: item.id } })}
      >
        <View style={styles.newsContent}>
          <Text style={styles.newsTitle} numberOfLines={2}>
            {item.title.rendered}
          </Text>
          <View style={{ flexDirection: "row", gap: 2, alignItems: "center" }}>
            <Text style={styles.newsDescription} numberOfLines={3}>
              {item.title.rendered}
            </Text>
            <Image
              source={{ uri: item.extra?.featured_image }}
              style={styles.newsImage}
              contentFit="cover"
            />
          </View>
        </View>
      </TouchableOpacity>

      {index % 3 === 2 && adsImages[index % adsImages.length] && (
        <Image
          source={{ uri: adsImages[index % adsImages.length] }}
          style={styles.adBanner}
          contentFit="cover"
        />
      )}
    </View>
  );

  function setPlaying(arg0: boolean): void {
    throw new Error("Function not implemented.");
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} contentFit="contain" />
        <Text style={styles.headerTitle}>ព័ត៌មាន នគរដ្រេហ្គន​</Text>
      </View>

      {/* Last Video */}
      {lastVideo?.datas && (
        <View style={{ width, height: 220 }}>
          <YoutubePlayer
            height={220}
            width={width}
            play={true}
            videoId={lastVideo.datas.videoId}
            onChangeState={(state: string) => {
              if (state === "ended") {
                setTimeout(() => setPlaying(true), 500);
              }
            }}
          />
        </View>
      )}

      {/* Marquee + Gallery */}
      <View style={styles.marqueeContainer}>
        <AutoMarqueeRepeat
          text="នគរដ្រេហ្គន​ ព័ត៌មានជាតិ-អន្តរជាតិទាន់ហេតុការណ៍ សម្បូរបែប ប្រកបដោយក្រមសីលធម៍ និងវិជ្ជាជីវៈដោយផ្ទាល់"
          speed={40}
          textStyle={{ fontFamily: "KhmerOS", fontSize: 16, color: "#e0dcdcff" }}
          containerStyle={{ backgroundColor: "#2B4A7C", paddingVertical: 6 }}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.galleryScroll}
          contentContainerStyle={styles.galleryContent}
          ref={scrollViewRef}
          scrollEnabled={false}
        >
          {fullList.map((uri, index) => (
            <TouchableOpacity key={index} style={styles.galleryItem}>
              <Image source={{ uri }} style={styles.galleryImage} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
       <View style={styles.tokenBox}>
            <Text selectable style={styles.token}>
              {fcmToken || "No FCM Token yet"}
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.copyBtn} 
            onPress={copyToken}
            disabled={!fcmToken}
          >
            <Text style={styles.copyText}>Copy FCM Token</Text>
          </TouchableOpacity>

      {/* News List */}
     <GestureHandlerRootView style={{ flex: 1 }}>
      <FlatList
        data={newsArticles}
        renderItem={renderArticle}
        keyExtractor={(item, index) => `${item.id}-${index}`} 
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator size="small" style={{ marginVertical: 10 }} />
          ) : (
            <View style={{ height: 10 }} />
          )
        }
      />
    </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2B4A7C" },
  header: {
    paddingTop: 16,
    marginTop: 30,
    backgroundColor: "#2B4A7C",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  logo: { width: 40, height: 40, borderRadius: 8 },
  headerTitle: { 
    textAlign: "center",
    fontSize: 18, 
    fontWeight: "700", 
    color: "#e0dcdcff", 
    fontFamily: "KhmerOS" 
  },
  scrollView: { flex: 1 },
  youtubeContainer: { 
    width: width, 
    height: 220, 
    backgroundColor: "#000000" 
  },
  marqueeContainer: {
    width: width,          // 👈 VERY IMPORTANT
    overflow: "hidden",
    backgroundColor: "#2B4A7C",
    paddingVertical: 6,
  },

  marqueeText: {
    fontSize: 16,
    color: "#e0dcdcff",
    fontFamily: "KhmerOS",
    fontWeight: "500",
    paddingHorizontal: 10, // helps readability
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
    marginHorizontal: 5, 
    marginVertical: 2, 
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
  tokenBox: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DDD",
    marginBottom: 15,
  },
  token: {
    fontSize: 14,
    color: "#333",
  },
  copyBtn: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 25,
  },
  copyText: {
    color: "white",
    fontWeight: "600",
  },
  label: {
    fontWeight: "700",
    marginBottom: 5,
  },
  tokenSmall: {
    fontSize: 12,
    color: "#333",
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