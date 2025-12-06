import axios from "axios";

const http = axios.create({
  timeout: 15000,
  // Allow HTTP on Android
  transitional: {
    clarifyTimeoutError: true,
  }
});

// Optional: log errors
http.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log("HTTP Error:", err?.message);
    return Promise.reject(err);
  }
);

export default http;
