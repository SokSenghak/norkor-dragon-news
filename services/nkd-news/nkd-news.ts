import axios from "axios";
import GlobalService from "../global-service";

export default class NkdNewsService {
  globalService: GlobalService;

  constructor(globalService: GlobalService) {
    this.globalService = globalService;
  }

  /* ---------------------- GET ALL ---------------------- */
  async getAll(options: any = {}) {
    const per_page = options.per_page || 10;
    const page = options.page || 1;

    const url =
      `${this.globalService.api.url}${this.globalService.api.path}` +
      `?consumer_key=${this.globalService.api.consumerKey}` +
      `&consumer_password=${this.globalService.api.consumerPassword}` +
      `&per_page=${per_page}&page=${page}`;

    const res = await axios.get(url);
    return res.data;
  }

  /* ---------------------- GET ALL (AXIOS VERSION) ---------------------- */
  async getAllNew(options: any = {}) {
    const per_page = options.per_page || 20;
    const page = options.page || 1;

    const url =
      `${this.globalService.api.url}${this.globalService.api.path}` +
      `?consumer_key=${this.globalService.api.consumerKey}` +
      `&consumer_password=${this.globalService.api.consumerPassword}` +
      `&per_page=${per_page}&page=${page}`;

    try {
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      console.log("getAllNew Error:", err);
      return null;
    }
  }

  /* ---------------------- GET ADS BY ID ---------------------- */
  async getAdsByID(options: any) {
    const page_id = options.page_id;

    const url =
      `${this.globalService.fast_api.url}${this.globalService.fast_api.path}` +
      `page?id=${page_id}`;

    try {
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      console.log("getAdsByID Error:", err);
      return null;
    }
  }

  /* ---------------------- GET BY CATEGORY ---------------------- */
  async getAllByCategoryId(options: any = {}) {
    const category_id = options.category_id;
    const per_page = options.per_page || 10;
    const page = options.page || 1;

    const url =
      `${this.globalService.api.url}${this.globalService.api.path}category` +
      `?consumer_key=${this.globalService.api.consumerKey}` +
      `&consumer_password=${this.globalService.api.consumerPassword}` +
      `&per_page=${per_page}&page=${page}&id=${category_id}`;

    const res = await axios.get(url);
    return res.data;
  }

  /* ---------------------- GET BY CATEGORY (AXIOS VERSION) ---------------------- */
  async getAllByCategoryIdNew(options: any = {}) {
    const category_id = options.category_id;
    const per_page = options.per_page || 20;
    const page = options.page || 1;
    const url =
      `${this.globalService.api.url}${this.globalService.api.path}category` +
      `?consumer_key=${this.globalService.api.consumerKey}` +
      `&consumer_password=${this.globalService.api.consumerPassword}` +
      `&per_page=${per_page}&page=${page}&id=${category_id}`;
    
    try {
      const res = await axios.get(url);
      
      return res.data;
    } catch (err) {
      console.log("getAllByCategoryIdNew nkdNews Error:", err);
      return null;
    }
  }

  /* ---------------------- GET PAGE BY ID ---------------------- */
  async getPageByID(options: any) {
    const page_id = options.page_id;

    const url =
      `${this.globalService.fast_api.url}${this.globalService.fast_api.path}` +
      `page?id=${page_id}`;

    const res = await axios.get(url);
    return res.data;
  }

  /* ---------------------- GET WP POST BY ID ---------------------- */
  async getPostByID(options: any) {
    const page_id = options.page_id;

    const url = `${this.globalService.api_v2.url}/wp-json/wp/v2/posts/${page_id}`;

    const res = await axios.get(url);
    return res.data;
  }
}
