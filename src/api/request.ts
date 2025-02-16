import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { ElMessage } from "element-plus";
import router from "@/router";

const request = axios.create({
  baseURL: "/api",
  timeout: 5000,
  withCredentials: true,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 如果请求头中已经设置了 Authorization，就不再设置
    if (config.headers.Authorization === undefined) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
request.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // 如果不是注销请求导致的错误，才处理
      if (!error.config.url?.includes("/auth/logout")) {
        const authStore = useAuthStore();
        authStore.logout();
        router.push("/login");
        ElMessage.error("登录已过期，请重新登录");
      }
    } else {
      ElMessage.error(error.response?.data?.message || "请求失败");
    }
    return Promise.reject(error);
  }
);

export default request;
