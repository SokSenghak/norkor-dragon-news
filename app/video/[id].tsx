import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

import { videos } from "@/mocks/news";

const { width } = Dimensions.get("window");

export default function VideoPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [playing, setPlaying] = useState(false);

  const video = videos.find((v) => v.id === id);

  if (!video) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Video not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        <YoutubePlayer
          height={250}
          play={playing}
          videoId={video.youtubeId}
          onChangeState={(state: string) => {
            if (state === "ended") {
              setPlaying(false);
            }
          }}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.videoTitle}>{video.title}</Text>
        <Text style={styles.videoDate}>{video.date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  videoContainer: {
    width: width,
    height: 250,
    backgroundColor: "#000000",
  },

  infoContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
    lineHeight: 26,
  },
  videoDate: {
    fontSize: 14,
    color: "#999999",
  },
  errorText: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 40,
  },
});
