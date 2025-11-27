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
const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const [marqueeText, setMarqueeText] = useState("");
  const marqueeAnim = useRef(new Animated.Value(0)).current;
  const [playing, setPlaying] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const globalService = new GlobalService();
  const nkd = new NkdNewsService(globalService);
  const [lastVideo, setLastVideo] = useState<any>(null);
  
  useEffect(() => {
    async function fetchLastVideo() {
      const video = await globalService.getLastVideo();
      if (video) {
        setLastVideo(video);
      }
    }

    fetchLastVideo();
  }, []);

  useEffect(() => {
    async function init() {
      await Font.loadAsync({
        KhmerOS: require("../../assets/fonts/KhmerOS_muollight.ttf"),
      });
      setFontsLoaded(true);
      const res = await nkd.getAll({ per_page: 10, page: 1 });
      setNewsArticles(res.data.data);
    }
    init();
  }, []);

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
  }, [marqueeAnim, fontsLoaded]);

  const translateX = marqueeAnim.interpolate({
    inputRange: [-1, 0],
    outputRange: [-width * 2, 0],
  });

  useEffect(() => {
    let scrollValue = 0;
    let scroller: ReturnType<typeof setInterval>;
    const totalWidth = galleryImages.length * 182; // image width + margin/padding approx
    const scroll = () => {
      scrollValue += 1; // adjust speed
      if (scrollValue > totalWidth) {
        scrollValue = 0; // reset to start
      }
      scrollViewRef.current?.scrollTo({ x: scrollValue, animated: false });
    };
    scroller = setInterval(scroll, 20); // adjust interval for speed
    return () => clearInterval(scroller);
  }, []);

  // Show loading until fonts are ready
  if (!fontsLoaded) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Image
          source={ logo }
          style={styles.logo}
          contentFit="contain"
        />
        <Text style={styles.headerTitle}>ព័ត៌មាន នាគ ព្រះខ័ន</Text>
      </View>
      {lastVideo?.datas && (
        <View style={{ width, height: 220 }}>
          <YoutubePlayer
            height={220}
            width={width}
            play={playing}
            videoId={lastVideo.datas.videoId} // use dynamic videoId
            onChangeState={(state: string) => {
              if (state === "ended") {
                setPlaying(false);
                setTimeout(() => setPlaying(true), 500); // auto restart
              }
            }}
          />
          <Text
            style={{
              color: "#fff",
              fontSize: 14,
              fontFamily: "KhmerOS-Muol",
              marginTop: 4,
              width: width - 16,
            }}
            numberOfLines={2}
          >
            {lastVideo.datas.title}
          </Text>
        </View>
      )}
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

        {/* Gallery */}
       <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.galleryScroll}
          contentContainerStyle={styles.galleryContent}
          ref={scrollViewRef}
          scrollEnabled={false} // disable manual scrolling
        >
          {galleryImages.map((img) => (
            <TouchableOpacity key={img.id} style={styles.galleryItem}>
              <Image source={{ uri: img.uri }} style={styles.galleryImage} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* News Articles */}
        {newsArticles.map((article, index) => (
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
                  <Text style={styles.newsDescription} >
                    {article.title.rendered}
                  </Text>
                  <Image
                    source={{ uri: article.extra.featured_image }}
                    style={styles.newsImage}
                    contentFit="cover"
                  />
                </View>
              </View>
            </TouchableOpacity>
            {index === 2 && adBanners[1] && (
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
    marginVertical: 8 
  },
  galleryContent: { 
    paddingHorizontal: 8, 
    paddingVertical: 12, 
    gap: 8 
  },
  galleryItem: { marginRight: 2 },
  galleryImage: { 
    width: 180, 
    height: 80, 
    borderRadius: 8 
  },
  newsCard: { 
    backgroundColor: "#fff", marginHorizontal: 8, marginVertical: 6, borderRadius: 8, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  newsImage: { width: "40%", borderRadius: 8, height: 100 },
  newsContent: { padding: 12 },
  newsCategory: { fontSize: 12, color: "#2B4A7C", fontWeight: "600", marginBottom: 4 },
  newsTitle: { fontSize: 14, fontWeight: "700", color: "#999999", marginBottom: 6, lineHeight: 22, fontFamily: "KhmerOS" },
  newsDescription: { fontSize: 14, color: "#78787eff", marginBottom: 8, width: "60%",},
  newsDate: { fontSize: 12, color: "#999999" },
  adBanner: { width: width - 16, height: 80, marginHorizontal: 8, marginVertical: 8, borderRadius: 8 },
  footer: { height: 20 },
});
