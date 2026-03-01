import axios from "axios";
import { API_BASE_URL } from "api/config";

/**
 * Axios instance
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

/**
 * REQUEST INTERCEPTOR
 * - attach token
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }

    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * RESPONSE INTERCEPTOR
 * - handle global auth errors
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  },
);

export default api;
