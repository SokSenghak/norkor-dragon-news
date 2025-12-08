import { View, ScrollView, Text, Linking, useWindowDimensions, TouchableOpacity } from "react-native";
import RenderHTML from "react-native-render-html";
import { useEffect, useState } from "react";
import NkdNewsService from "../services/nkd-news/nkd-news";
import GlobalService from "@/services/global-service";
import { Facebook, Send, Youtube } from "lucide-react-native";

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
        <View style={{ padding: 15 }}>
          <RenderHTML
            contentWidth={width}
            source={{ html: contentPage }}
            tagsStyles={{
              p: { color: "#ddd", lineHeight: 30, fontSize: 20 },
              a: { color: "#4da6ff" },
              img: { borderRadius: 10, marginVertical: 15 },
            }}
          />
        </View>

        <View
          style={{
            marginTop: 25,
            flexDirection: "row",
            justifyContent: "space-around",
            paddingHorizontal: 20,
          }}
        >
          <SocialIcon
            IconComponent={Facebook}
            label="Facebook"
            onPress={() => Linking.openURL("https://www.facebook.com/nkdnews")}
          />

          <SocialIcon
            IconComponent={Send}
            label="Telegram"
            onPress={() => Linking.openURL("https://t.me/NoKorDragonNews")}
          />

          <SocialIcon
            IconComponent={Youtube}
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
  IconComponent: any;
  label: string;
  onPress?: () => void;
};

function SocialIcon({ IconComponent, label, onPress }: SocialIconProps) {
  return (
    <TouchableOpacity style={{ alignItems: "center" }} onPress={onPress}>
      <IconComponent size={38} color="#fff" />
      <Text style={{ color: "#ccc", fontSize: 12 }}>{label}</Text>
    </TouchableOpacity>
  );
}
