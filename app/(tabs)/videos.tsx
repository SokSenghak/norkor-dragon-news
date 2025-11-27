import { Image } from "expo-image";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import YoutubePlayer from "react-native-youtube-iframe";
import GlobalService from "../services/global-service";

const { width } = Dimensions.get("window");

export default function VideosScreen() {
  const globalService = new GlobalService();

  const [allVideo, setAllVideo] = useState<any[]>([]);
  const [currentVideoId, setCurrentVideoId] = useState<string>("");
  const [playing, setPlaying] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Fetch videos function
  const fetchVideos = async (pageNumber: number) => {
    if (loading || !hasMore) return;
    setLoading(true);

    const videoData = await globalService.listAllVideo(10, pageNumber);
    if (videoData?.datas?.length > 0) {
      setAllVideo((prev) => [...prev, ...videoData.datas]);
      // If first page, set first video
      if (pageNumber === 1) {
        setCurrentVideoId(videoData.datas[0].videoId);
      }
    } else {
      setHasMore(false); // No more data
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

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />

      <YoutubePlayer
        height={220}
        width={width}
        play={playing}
        videoId={currentVideoId}
        onChangeState={(state: string) => {
          if (state === "ended") setPlaying(false);
        }}
      />
      <FlatList
        data={allVideo}
        keyExtractor={(item, index) => `${item._id}-${index}`} // unique key
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.videoItem}
            onPress={() => handleVideoSelect(item.videoId)}
          >
            <View style={styles.dragHandle}></View>
            <View style={styles.thumbnailContainer}>
              <Image
                source={{ uri: item.thumbnails_high }}
                style={styles.thumbnail}
                contentFit="cover"
              />
            </View>
            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.videoStats}>
                {new Date(item.publishedAt).toLocaleDateString()}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        onEndReached={() => {
          if (!loading && hasMore) {
            setPage((prev) => {
              const nextPage = prev + 1;
              fetchVideos(nextPage);
              return nextPage;
            });
          }
        }}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2B4A7C" },
  videoItem: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "flex-start",
    backgroundColor: "#2B4A7C",
  },
  dragHandle: { justifyContent: "center", paddingTop: 35 },
  thumbnailContainer: {
    position: "relative",
    width: 148,
    height: 74,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#1A1A1A",
  },
  thumbnail: { width: "100%", height: "100%" },
  durationBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 2,
  },
  durationText: { fontSize: 11, fontWeight: "600", color: "#FFFFFF" },
  videoInfo: { flex: 1, paddingLeft: 12, paddingRight: 8 },
  videoTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
    lineHeight: 20,
    marginBottom: 4,
  },
  channelName: { fontSize: 12, color: "#AAAAAA", marginBottom: 2 },
  videoStats: { fontSize: 12, color: "#AAAAAA" },
  menuButton: { padding: 8, justifyContent: "center" },
});
