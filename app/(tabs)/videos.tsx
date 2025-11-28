import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import YoutubePlayer from "react-native-youtube-iframe";
import GlobalService from "../services/global-service";
import NkdNewsService from "../services/nkd-news/nkd-news";

const { width } = Dimensions.get("window");

export default function VideosScreen() {
  const router = useRouter();
  const globalService = new GlobalService();
  const nkd = new NkdNewsService(globalService);

  const [allVideo, setAllVideo] = useState<any[]>([]);
  const [currentVideoId, setCurrentVideoId] = useState<string>("");
  const [playing, setPlaying] = useState(true);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const scrollViewRef = useRef<ScrollView>(null);
  const [adsImages, setAdsImages] = useState<string[]>([]);

  // Load ADS
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
    while ((match = regex.exec(html)) !== null) images.push(match[1]);
    return images;
  };

  useEffect(() => {
    loadAds();
  }, []);

  // Auto Scroll Ads
  useEffect(() => {
    if (adsImages.length === 0) return;

    let scrollX = 0;
    const autoScroll = setInterval(() => {
      scrollX += 1;
      scrollViewRef.current?.scrollTo({ x: scrollX, animated: false });

      if (scrollX > adsImages.length * 200) scrollX = 0;
    }, 20);

    return () => clearInterval(autoScroll);
  }, [adsImages]);

  // Fetch Videos
  const fetchVideos = async (pageNumber: number) => {
    if (loading || !hasMore) return;

    setLoading(true);
    const videoData = await globalService.listAllVideo(10, pageNumber);

    if (videoData?.datas?.length > 0) {
      setAllVideo((prev) => [...prev, ...videoData.datas]);

      if (pageNumber === 1) {
        setCurrentVideoId(videoData.datas[0].videoId);
      }
    } else {
      setHasMore(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchVideos(1);
  }, []);

  const handleVideoSelect = (videoId: string) => {
    setCurrentVideoId(videoId);
    setPlaying(true);
  };

  // Inject ads into list
  const renderVideoItem = ({ item, index }: any) => (
    <View>
      {/* Inject ads every 3 items */}
      {index % 3 === 2 && adsImages.length > 0 && (
        <TouchableOpacity
          onPress={() => router.push("/videos")}
          style={{ alignItems: "center" }}
        >
          <Image
            source={{ uri: adsImages[index % adsImages.length] }}
            style={styles.adBanner}
            contentFit="cover"
          />
        </TouchableOpacity>
      )}

      {/* Video Item */}
      <TouchableOpacity
        style={styles.videoItem}
        onPress={() => handleVideoSelect(item.videoId)}
      >
        <Image
          source={{ uri: item.thumbnails_high }}
          style={styles.thumbnail}
          contentFit="cover"
        />
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.videoStats}>
            {new Date(item.publishedAt).toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Main Video Player */}
      <YoutubePlayer
        height={220}
        width={width}
        play={playing}
        videoId={currentVideoId}
        onChangeState={(state) => {
          if (state === "ended") setPlaying(false);
        }}
      />

      {/* Auto Scroll Ads Row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        ref={scrollViewRef}
        scrollEnabled={false}
        style={styles.galleryScroll}
      >
        {adsImages.map((uri, i) => (
          <TouchableOpacity key={i} onPress={() => router.push("/videos")}>
            <Image source={{ uri }} style={styles.galleryImage} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Video List */}
      <FlatList
        data={allVideo}
        renderItem={renderVideoItem}
        keyExtractor={(item, index) => item._id + "-" + index}
        contentContainerStyle={{ paddingBottom: 40 }}
        onEndReached={() => {
          if (!loading && hasMore) {
            const next = page + 1;
            setPage(next);
            fetchVideos(next);
          }
        }}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2B4A7C" },

  // Ads Auto-scroll Row
  galleryScroll: { marginVertical: 4 },
  galleryImage: {
    width: 180,
    height: 120,
    marginRight: 5,
    borderRadius: 10,
  },

  // List Injected Ad
  adBanner: {
    width: width - 20,
    height: 70,
    borderRadius: 10,
  },

  // Video Item
  videoItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginVertical: 6,
    padding: 10,
    borderRadius: 8,
  },
  thumbnail: {
    width: 130,
    height: 90,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },
  videoInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  videoStats: {
    marginTop: 6,
    color: "#888",
    fontSize: 12,
  },
});
