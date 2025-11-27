import axios from "axios";
import _ from "lodash";
import InAppBrowser from "react-native-inappbrowser-reborn";
import { Linking } from "react-native";

export default class GlobalService {
  constructor() {
    console.log("GlobalService Loaded");
  }

  /* ---------------------- API CONFIGS ---------------------- */

  api = {
    url: "http://nkdnews.com:8080",
    path: "/api/",
    consumerKey: "3b8YMa7LtJVSSbqAn5Mp9X",
    consumerPassword: "GtMwjsnd8eePDyMTNZ4AZcZPThYNv6cdBsVSVfEfG",
  };

  fast_api = {
    url: "http://128.199.154.112:9090",
    path: "/api/",
    consumerKey: "3b8YMa7LtJVSSbqAn5Mp9X",
    consumerPassword: "GtMwjsnd8eePDyMTNZ4AZcZPThYNv6cdBsVSVfEfG",
  };

  api_v2 = {
    url: "http://nkdnews.com",
    path: "/wp-json/wp/v2",
  };

  api_v3 = {
    url: "http://128.199.154.112",
    path: "/wp-json/wp/v2",
  };

  api_node = {
    url: "http://159.223.75.243",
  };

  /* ---------------------- HELPERS ---------------------- */

  mergeArray(arrA: any[], arrB: any[]) {
    return _.orderBy(_.uniqBy([...arrA, ...arrB], "id"), ["id"], ["desc"]);
  }

  async playSound(id: string) {
    console.log("playSound called:", id);
  }

  /* ---------------------- OPEN IN APP BROWSER ---------------------- */

  async openBrowser(item: any) {
    const url = `${this.api_v2.url}/archives/${item.id}`;
    await this.openURL(url);
  }

  async openBrowserFbPage(url: string) {
    await this.openURL(url);
  }

  private async openURL(url: string) {
    try {
      if (await InAppBrowser.isAvailable()) {
        await InAppBrowser.open(url, {
          showTitle: true,
          toolbarColor: "#000",
        });
      } else {
        Linking.openURL(url);
      }
    } catch (err) {
      console.log("Browser error:", err);
    }
  }

  /* ---------------------- API REQUESTS ---------------------- */

  async APIGetPostByID(id: number) {
    const url = `${this.api_v2.url}${this.api_v2.path}/posts/${id}`;
    try {
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      console.log("APIGetPostByID Error:", err);
      return null;
    }
  }

  async APIGetAllPost(page: number) {
    const url = `${this.api_v2.url}${this.api_v2.path}/posts?page=${page}`;    
    try {
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      console.log("APIGetAllPost Error:", err);
      return null;
    }
  }

  async getAllPostFromNKDNews(page: number) {
    // Correct URL example: /archives/category/latest/page/3
    const url = `${this.api_v2.url}/archives/category/latest/page/${page}`;

    try {
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      console.log("getAllPostFromNKDNews Error:", err);
      return null;
    }
  }

  async listAllVideo(slimit: number, setskip: number) {
    try {
      const res = await axios.post(`${this.api_node.url}/api/youtube/list`, {
        slimit,
        setskip,
      });
      return res.data;
    } catch (err) {
      console.log("listAllVideo Error:", err);
      return null;
    }
  }

  async getLastVideo() {
    try {
      const res = await axios.post(
        `${this.api_node.url}/api/youtube/lastvideo`,
        {}
      );
      return res.data;
    } catch (err) {
      console.log("getLastVideo Error:", err);
      return null;
    }
  }
}
