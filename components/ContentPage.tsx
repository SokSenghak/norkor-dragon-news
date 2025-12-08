import { View, ScrollView, Text, Linking, useWindowDimensions } from "react-native";
import RenderHTML from "react-native-render-html";
import { useEffect, useState } from "react";
import NkdNewsService from "../services/nkd-news/nkd-news";
import GlobalService from "@/services/global-service";

export default function ContentPage({ pageId }: { pageId: string | number }) {
    
  const globalService = new GlobalService();
  const nkd = new NkdNewsService(globalService);
  const [contentPage, setContentPage] = useState("");
  const { width } = useWindowDimensions();

  const fetchPage = async () => {
    try {
      const res = await nkd.getPageByID({ page_id: pageId });
      setContentPage(res?.content?.rendered || "");
    } catch (e) {
      console.log("fetchPage error:", e);
    }
  };

  useEffect(() => {
    fetchPage();
  }, [pageId]);

  return (
    <View style={{ flex: 1, backgroundColor: "#2B4A7C" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      >
        {/* Content Card */}
        <View
          style={{
            backgroundColor: "#2B4A7C",
            padding: 20,
            borderRadius: 12,
            shadowColor: "#000",
            shadowOpacity: 0.3,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 5,
            elevation: 5,
          }}
        >
          <RenderHTML
            contentWidth={width}
            source={{ html: contentPage }}
            tagsStyles={{
              p: { color: "#ddd", lineHeight: 22, fontSize: 15 },
              a: { color: "#4da6ff" },
              img: { borderRadius: 10, marginVertical: 15 },
            }}
          />
        </View>

        {/* Social Icon Section */}
        <View
          style={{
            marginTop: 25,
            flexDirection: "row",
            justifyContent: "space-around",
            paddingHorizontal: 20,
          }}
        >
          <SocialIcon
            icon="📘"
            label="Facebook"
            onPress={() => Linking.openURL("https://www.facebook.com/nkdnews")}
          />

          <SocialIcon
            icon="📨"
            label="Telegram"
            onPress={() => Linking.openURL("https://t.me/NoKorDragonNews")}
          />

          <SocialIcon
            icon="▶️"
            label="YouTube"
            onPress={() => Linking.openURL("https://www.youtube.com/@Nkdnews")}
          />
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

type SocialIconProps = {
  icon: string;
  label: string;
  onPress?: (event?: any) => void | Promise<void>;
};

function SocialIcon({ icon, label, onPress }: SocialIconProps) {
  return (
    <View style={{ alignItems: "center" }}>
      <Text
        style={{
          fontSize: 38,
          marginBottom: 5,
        }}
        onPress={onPress}
      >
        {icon}
      </Text>
      <Text style={{ color: "#ccc", fontSize: 12 }}>{label}</Text>
    </View>
  );
}
