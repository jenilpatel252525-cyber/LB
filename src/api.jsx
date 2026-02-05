// src/api.js
import axios from "axios";
// import { useAuth } from "./AuthContext";
import { setAuthReadyExternal } from "./AuthEvents";

/**
 * Configure this via env:
 * VITE_API_URL=https://<your-backend-ngrok>
 *
 * Fallback to the current ngrok URL you were using.
 */
const BACKEND = import.meta.env.VITE_API_URL || "https://my-backend-iua7.onrender.com";

const API = axios.create({
  baseURL: `${BACKEND.replace(/\/$/, "")}/api`, // ensure no trailing slash duplication
});

/**
 * Request interceptor: attach access token if present
 */
API.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("access");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor: attempt refresh on 401
 * - Guards originalRequest existence
 * - Uses axios.post(fullUrl) (not API.post) to avoid recursive interception
 * - Properly sets API.defaults.headers.common Authorization
 */
API.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    const originalRequest = error?.config;

    // If no config, can't retry
    if (!originalRequest) return Promise.reject(error);

    // Only handle 401 once per request
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // const {setAuthReady} = useAuth()
      // setAuthReady(false)
      setAuthReadyExternal(false);
      originalRequest._retry = true;
      const refreshToken = sessionStorage.getItem("refresh");

      if (!refreshToken) {
        // No refresh token, force logout
        sessionStorage.removeItem("access");
        window.location.href = "/";
        return Promise.reject(error);
      }

      try {
        const refreshUrl = `${BACKEND.replace(/\/$/, "")}/api/token/refresh/`;
        // Use plain axios to avoid this interceptor
        const res = await axios.post(refreshUrl, { refresh: refreshToken });

        const newAccess = res.data.access;
        if (!newAccess) {
          throw new Error("No access token in refresh response");
        }

        // Store new access token
        sessionStorage.setItem("access", newAccess);
        // setAuthReady(true)
        setAuthReadyExternal(true);

        // Properly set axios defaults so subsequent requests include Authorization
        API.defaults.headers = API.defaults.headers || {};
        API.defaults.headers.common = API.defaults.headers.common || {};
        API.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`;

        // Update original request headers and retry
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;

        return API(originalRequest);
      } catch (refreshError) {
        // Refresh failed — clear storage and redirect to login
        console.error("Refresh token expired or invalid - logging out", refreshError);
        sessionStorage.removeItem("access");
        sessionStorage.removeItem("refresh");
        // setAuthReady(false);
        setAuthReadyExternal(false);
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;