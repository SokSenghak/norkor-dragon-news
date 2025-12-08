import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Font from "expo-font";
import GlobalService from "../../services/global-service";
import NkdNewsService from "../../services/nkd-news/nkd-news";
import { ChevronLeft } from "lucide-react-native";
import ContentPage from "../../components/ContentPage";

export default function ListByCategoryScreen() {
  const router = useRouter();
  const { id, title, isPage } = useLocalSearchParams();
  const globalService = new GlobalService();
  const nkd = new NkdNewsService(globalService);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [news, setNews] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
	const [lastPost, setLastPost] = useState<any>(null);
  
  // Load font
  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        KhmerOS: require("../../assets/fonts/KhmerOS_muollight.ttf"),
      });
      setFontsLoaded(true);
    }
    loadFont();
  }, []);

  // Fetch posts
  const fetchPosts = async (nextPage = 1) => {
    if (loading || !hasMore) return;
    setLoading(true);

    const res = await nkd.getAllByCategoryIdNew({
      category_id: id,
      per_page: 10,
      page: nextPage,
    });
    
    if (res?.data?.data.length > 0) {
      setNews((prev) => [...prev, ...res?.data?.data]);
    } else {
      setHasMore(false);
    }

    setLoading(false);
  };

	useEffect(() => {
		async function loadLastPost() {
			const res = await nkd.getAllByCategoryIdNew({
				category_id: id,
				per_page: 10,
			});
			if (res?.data?.data) {
				setLastPost(res?.data?.data[0]);
			}
		}
		loadLastPost();
	}, []);


  useEffect(() => {
    setNews([]);
    fetchPosts(1);
  }, [id]);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage);
    }
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/article/${item.id}`)}
    >
      <Image
        source={{ uri: item.extra.featured_image }}
        style={styles.cardImg}
        contentFit="cover"
      />

      <View style={styles.cardBody}>
        {fontsLoaded && (
					<View>
						<Text style={[styles.cardTitle, { fontFamily: "KhmerOS" }]}>
							{item.title.rendered}
						</Text>
						<Text style={styles.cardTitletext}>
							{item.title.rendered}
						</Text>
					</View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={22} color="#FFFFFF" />
          <Text style={styles.backButtonText}>ត្រលប់</Text>
        </TouchableOpacity>

        {fontsLoaded ? (
          <Text style={[styles.headerTitle, { fontFamily: "KhmerOS" }]}>
            {title || "ព័ត៌មាន នគរដ្រេហ្គន​"}
          </Text>
        ) : null}
      </View>
     	{lastPost ? (
				<TouchableOpacity
					style={styles.cardFirstPost}
					onPress={() => router.push(`/article/${lastPost.id}`)}
				>
					<Image
						source={{ uri: lastPost.extra.featured_image }}
						style={styles.cardImgFirstPost}
						contentFit="cover"
					/>

					{fontsLoaded && (
						<View style={styles.cardBodyOverlay}>
							<Text style={[styles.cardTitleFirstPost, { fontFamily: "KhmerOS" }]}>
								{lastPost.title.rendered}
							</Text>
						</View>
					)}
				</TouchableOpacity>
			) : null}

      {news.length > 0 ? (
        <FlatList
          data={news}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 30 }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading ? <ActivityIndicator size="large" color="#fff" /> : null
          }
        />
      ) : (
        <ContentPage pageId={Array.isArray(id) ? id[0] : id} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
		flex: 1, 
		backgroundColor: "#2B4A7C" 
	},
	backContainer: {
		padding: 5,
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
  header: {
    backgroundColor: "#2B4A7C",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#2B4A7C",
    flexDirection: "row",
    marginHorizontal: 5,
    marginVertical: 2,
    borderRadius: 10,
    overflow: "hidden",
    padding: 2,
  },
  cardImg: {
    width: 150,
    height: 90,
    borderRadius: 10,
  },
	cardFirstPost: {
		width: "100%",
		marginHorizontal: 5,
		marginVertical: 2,
		borderRadius: 10,
		overflow: "hidden",
	},

	cardImgFirstPost: {
		width: "100%",
		height: 180,
	},

	cardBodyOverlay: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		padding: 8,
	},

	cardTitleFirstPost: {
		fontSize: 11,
		color: "#fff",
		fontWeight: "600",
		textShadowColor: "rgba(0, 0, 0, 0.75)",
		textShadowOffset: { width: -1, height: 1 },
		textShadowRadius: 10,
	},

  cardBody: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 4,
  },
	cardTitletext:{
		fontSize: 12,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 4,
	},
  cardDesc: {
    fontSize: 13,
    color: "#e0e0e0",
  },
});
