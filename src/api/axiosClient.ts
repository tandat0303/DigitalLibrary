import axios from "axios";
import { apiConfig } from "./apiConfig";
import storage from "../lib/storage";
import { store } from "../app/store";
import { logout } from "../features/authSlice";

const axiosConfig = axios.create({
  baseURL: apiConfig.baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 1800000,
});

axiosConfig.interceptors.request.use((config) => {
  const state = store.getState();

  const token = state.auth.accessToken || storage.get("auth")?.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosConfig.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error?.response?.status;

    if (status === 401 && !error.config.url.includes("/auth/login")) {
      storage.remove("auth");
      store.dispatch(logout());
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

// axiosConfig.interceptors.request.use(
//   function (config) {
//     const accessToken: { accessToken: string } = {
//       accessToken: storage.get("accessToken"),
//     };

//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken.accessToken}`;
//     }
//     return config;
//   },
//   function (error) {
//     return Promise.reject(error);
//   },
// );

// axiosConfig.interceptors.response.use(
//   function (response) {
//     return response;
//   },
//   function (error) {
//     return Promise.reject(error);
//   },
// );

export default axiosConfig;
