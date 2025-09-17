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

// Helper function to decode JWT and check expiration
const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;

    // Check if token expires within next 5 minutes (300 seconds buffer)
    return payload.exp < (currentTime + 300);
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

// Helper function to check if refresh token is expired
const isRefreshTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;

    // No buffer for refresh token - check exact expiration
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error decoding refresh token:', error);
    return true;
  }
};

export const AuthProvider = ({ children }) => {
  const API_BASE = "https://api.dratifshahzad.com/api";

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);


  useEffect(() => {
    console.log('🔄 AuthContext State:', {
      user: user ? { id: user.id, name: user.name, email: user.email } : null,
      loading,
      isInitialized,
      hasAccessToken: !!localStorage.getItem("access_token"),
      hasRefreshToken: !!localStorage.getItem("refresh_token")
    });
  }, [user, loading, isInitialized]);


  const api = useMemo(() => {
    return axios.create({
      baseURL: API_BASE,
      headers: { "Content-Type": "application/json" },
    });
  }, [API_BASE]);

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
    setIsInitialized(true);
  }, []);

  const refreshAccessToken = useCallback(async () => {
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken || isRefreshTokenExpired(refreshToken)) {
      logout();
      throw new Error("No valid refresh token");
    }

    if (isRefreshing.current) {
      // Return a promise that resolves when refresh completes
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((newToken) => {
          if (newToken) resolve(newToken);
          else reject(new Error("Token refresh failed"));
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
      onRefreshed(newAccessToken);

      return newAccessToken;
    } catch (err) {
      console.error("Token refresh failed:", err);
      onRefreshed(null);
      logout();
      throw err;
    } finally {
      isRefreshing.current = false;
    }
  }, [API_BASE, logout]);

  // Attach interceptors once
  useEffect(() => {
    // Add Authorization header
    const reqId = api.interceptors.request.use(
      async (config) => {
        let token = localStorage.getItem("access_token");

        // Check if token is expired and refresh if needed
        if (token && isTokenExpired(token)) {
          try {
            token = await refreshAccessToken();
          } catch (error) {
            // If refresh fails, let the request proceed without token
            // The response interceptor will handle the 401
            console.error("Failed to refresh token in request interceptor:", error);
          }
        }

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

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

          try {
            const newToken = await refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            console.error("Failed to refresh token in response interceptor:", refreshError);
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(reqId);
      api.interceptors.response.eject(resId);
    };
  }, [api, refreshAccessToken]);



  const fetchCurrentUser = useCallback(async () => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    console.log('🔍 fetchCurrentUser called:', {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      accessTokenExpired: accessToken ? isTokenExpired(accessToken) : 'no token',
      refreshTokenExpired: refreshToken ? isRefreshTokenExpired(refreshToken) : 'no token'
    });

    // If no tokens exist, user is not logged in
    if (!accessToken && !refreshToken) {
      console.log('❌ No tokens found - user not logged in');
      setLoading(false);
      setIsInitialized(true);
      return;
    }

    // If refresh token is expired, logout immediately
    if (refreshToken && isRefreshTokenExpired(refreshToken)) {
      console.log('❌ Refresh token expired - logging out');
      logout();
      setLoading(false);
      return;
    }

    try {
      console.log('🚀 Making /me request...');
      const res = await api.get("/me");
      console.log('✅ /me request successful:', res.data.user);
      setUser(res.data.user || null);
    } catch (err) {
      console.error("❌ fetchCurrentUser error:", err?.response?.data || err);

      // Only logout if it's not a network error
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        console.log('🚪 Logging out due to auth error');
        logout();
      } else {
        // For network errors, keep user logged in but show they're offline
        console.warn("🌐 Network error while fetching user, keeping logged in");
      }
    } finally {
      console.log('🏁 fetchCurrentUser finished');
      setLoading(false);
      setIsInitialized(true);
    }
  }, [api, logout]);

  // Initialize auth state
  useEffect(() => {
    if (!isInitialized) {
      fetchCurrentUser();
    }
  }, [fetchCurrentUser, isInitialized]);

  useEffect(() => {
    const interval = setInterval(() => {
      const accessToken = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");

      if (accessToken && refreshToken && !isRefreshTokenExpired(refreshToken)) {
        // If access token will expire in next 5 minutes, refresh it
        if (isTokenExpired(accessToken)) {
          refreshAccessToken().catch(() => {
            // Silently fail - the next API call will handle the refresh
          });
        }
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [refreshAccessToken]);

  // Auth actions with better error handling
  const login = async (email, password) => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
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
    isInitialized,
    api,
    login,
    register,
    logout,
    fetchCurrentUser,
    changePassword,
    refreshAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};