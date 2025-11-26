import { Image } from "expo-image";
import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import YoutubePlayer from "react-native-youtube-iframe";
import { MoreVertical } from "lucide-react-native";

import { videos } from "@/mocks/news";

const { width } = Dimensions.get("window");



export default function VideosScreen() {
  const [currentVideoId, setCurrentVideoId] = useState(videos[0]?.youtubeId || "");
  const [playing, setPlaying] = useState(true);

  const handleVideoSelect = (youtubeId: string) => {
    console.log("Selected video ID:", youtubeId);
    setCurrentVideoId(youtubeId);
    setPlaying(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.playerContainer}>
          <YoutubePlayer
            height={220}
            width={width}
            play={playing}
            videoId={currentVideoId}
            onChangeState={(state: string) => {
              console.log("Player state:", state);
              if (state === "ended") {
                setPlaying(false);
              }
            }}
          />
        </View>

        <View style={styles.playlistHeader}>
          <View style={styles.playlistIcon}>
            <Text style={styles.playlistIconText}>🎵</Text>
          </View>
          <View style={styles.playlistInfo}>
            <Text style={styles.playlistTitle}>Mix - និស្សនេហៈសុំឱ្យឈ្មោះក្នុងកម្មវិធី នីក ...</Text>
            <Text style={styles.playlistSubtitle}>Mixes are playlists YouTube makes for you</Text>
          </View>
          <TouchableOpacity style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {videos.map((video) => (
          <TouchableOpacity
            key={video.id}
            style={styles.videoItem}
            onPress={() => handleVideoSelect(video.youtubeId)}
          >
            <View style={styles.dragHandle}>
              <View style={styles.dragLine} />
              <View style={styles.dragLine} />
              <View style={styles.dragLine} />
            </View>
            <View style={styles.thumbnailContainer}>
              <Image
                source={{ uri: video.thumbnail }}
                style={styles.thumbnail}
                contentFit="cover"
              />
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>5:02</Text>
              </View>
            </View>
            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle} numberOfLines={2}>
                {video.title}
              </Text>
              <Text style={styles.channelName}>Watching Hub</Text>
              <Text style={styles.videoStats}>2.6M views • 7 years ago</Text>
            </View>
            <TouchableOpacity style={styles.menuButton}>
              <MoreVertical size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollView: {
    flex: 1,
  },
  playerContainer: {
    width: width,
    height: 220,
    backgroundColor: "#1A1A1A",
  },
  playlistHeader: {
    backgroundColor: "#0F0F0F",
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  playlistIcon: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  playlistIconText: {
    fontSize: 16,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#FFFFFF",
    marginBottom: 2,
  },
  playlistSubtitle: {
    fontSize: 12,
    color: "#AAAAAA",
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: "#FFFFFF",
  },
  videoItem: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "flex-start",
    backgroundColor: "#000000",
  },
  dragHandle: {
    justifyContent: "center",
    paddingRight: 12,
    paddingTop: 35,
  },
  dragLine: {
    width: 12,
    height: 2,
    backgroundColor: "#666666",
    marginVertical: 1,
  },
  thumbnailContainer: {
    position: "relative",
    width: 168,
    height: 94,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#1A1A1A",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  durationBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 2,
  },
  durationText: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
  videoInfo: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 8,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: "#FFFFFF",
    lineHeight: 20,
    marginBottom: 4,
  },
  channelName: {
    fontSize: 12,
    color: "#AAAAAA",
    marginBottom: 2,
  },
  videoStats: {
    fontSize: 12,
    color: "#AAAAAA",
  },
  menuButton: {
    padding: 8,
    justifyContent: "center",
  },
  footer: {
    height: 40,
  },
});
