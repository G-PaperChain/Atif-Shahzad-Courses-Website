// src/contexts/AuthProvider.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

/**
 * AuthProvider (Production Ready)
 * - Base URL: https://dratifshahzad.com/api
 * - Stores tokens in localStorage (simple; for true production use, consider HttpOnly cookies).
 * - Handles 401 refresh flow with queuing.
 */
export const AuthProvider = ({ children }) => {
  const API_BASE =
    import.meta.env.VITE_API_BASE || "https://dratifshahzad.com/api";

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Axios instance
  const api = useMemo(() => {
    return axios.create({
      baseURL: API_BASE,
      headers: { "Content-Type": "application/json" },
    });
  }, [API_BASE]);

  // Token refresh control
  const isRefreshing = useRef(false);
  const refreshSubscribers = useRef([]);

  const subscribeTokenRefresh = (cb) => {
    refreshSubscribers.current.push(cb);
  };

  const onRefreshed = (token) => {
    refreshSubscribers.current.forEach((cb) => cb(token));
    refreshSubscribers.current = [];
  };

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  }, []);

  // Attach interceptors once
  useEffect(() => {
    // Add Authorization header
    const reqId = api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("access_token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Refresh token on 401
    const resId = api.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error?.config;
        const status = error?.response?.status;

        if (status === 401 && originalRequest && !originalRequest._retry) {
          originalRequest._retry = true;
          const refreshToken = localStorage.getItem("refresh_token");

          if (!refreshToken) {
            logout();
            return Promise.reject(error);
          }

          if (isRefreshing.current) {
            // queue requests until refresh finishes
            return new Promise((resolve) => {
              subscribeTokenRefresh((newToken) => {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                resolve(api(originalRequest));
              });
            });
          }

          isRefreshing.current = true;
          try {
            const refreshRes = await axios.post(
              `${API_BASE}/refresh`,
              null,
              {
                headers: {
                  Authorization: `Bearer ${refreshToken}`,
                  "Content-Type": "application/json",
                },
              }
            );

            const newAccessToken = refreshRes?.data?.access_token;
            if (!newAccessToken) throw new Error("No access token returned");

            localStorage.setItem("access_token", newAccessToken);
            api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

            onRefreshed(newAccessToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          } catch (err) {
            logout();
            return Promise.reject(err);
          } finally {
            isRefreshing.current = false;
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(reqId);
      api.interceptors.response.eject(resId);
    };
  }, [api, API_BASE, logout]);

  // Load current user
  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await api.get("/me");
      setUser(res.data.user || null);
    } catch (err) {
      console.error("fetchCurrentUser error:", err?.response?.data || err);
      logout();
    } finally {
      setLoading(false);
    }
  }, [api, logout]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [fetchCurrentUser]);

  // Auth actions
  const login = async (email, password) => {
    try {
      const res = await api.post("/login", { email, password });
      const { access_token, refresh_token, user } = res.data;

      if (access_token) localStorage.setItem("access_token", access_token);
      if (refresh_token) localStorage.setItem("refresh_token", refresh_token);

      setUser(user || null);
      return { success: true, user: user || null };
    } catch (err) {
      const message =
        err?.response?.data?.error || err.message || "Login failed";
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post("/register", userData);
      const { access_token, refresh_token, user } = res.data;

      if (access_token) localStorage.setItem("access_token", access_token);
      if (refresh_token) localStorage.setItem("refresh_token", refresh_token);

      setUser(user || null);
      return { success: true, user: user || null };
    } catch (err) {
      const message =
        err?.response?.data?.error || err.message || "Registration failed";
      return { success: false, error: message };
    }
  };

  const changePassword = async (current_password, new_password) => {
    try {
      const res = await api.post("/change-password", {
        current_password,
        new_password,
      });
      return { success: true, message: res.data?.message || "Password changed" };
    } catch (err) {
      const message =
        err?.response?.data?.error || err.message || "Password change failed";
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    loading,
    api, // axios instance for custom API calls
    login,
    register,
    logout,
    fetchCurrentUser,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
