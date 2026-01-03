import axios from "axios";

/**
 * Axios instance
 */
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // change later
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
