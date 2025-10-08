import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  // Prefer env variable but fallback to relative /api so cookies are same-origin when possible
  const API_BASE = import.meta?.env?.VITE_API_BASE || "/api";

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [csrfToken, setCsrfToken] = useState(null);

  // Axios instance configured to use axios XSRF features and credentials
  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: API_BASE,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    // Let axios automatically read cookie named XSRF-TOKEN and send X-XSRF-TOKEN header
    instance.defaults.xsrfCookieName = "XSRF-TOKEN";
    instance.defaults.xsrfHeaderName = "X-XSRF-TOKEN";

    // Also add interceptor to attach token if we have one (some backends expect X-CSRF-TOKEN)
    instance.interceptors.request.use((config) => {
      const method = config.method?.toLowerCase();
      if (method && ["post", "put", "patch", "delete"].includes(method)) {
        const token = csrfToken;
        if (token) {
          // send common header names so backend accepts whichever it expects
          config.headers["X-CSRF-TOKEN"] = token;
          config.headers["X-CSRFToken"] = token;
          config.headers["X-XSRF-TOKEN"] = token;
        }
      }
      return config;
    });

    return instance;
  }, [API_BASE, csrfToken]);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await api.get("/me");
      setUser(res.data.user || null);
    } catch (err) {
      if (err?.response?.status === 401) setUser(null);
      else console.error("fetchCurrentUser error:", err);
    } finally {
      setIsInitialized(true);
      setLoading(false);
    }
  }, [api]);

  const fetchCsrfToken = useCallback(async () => {
    try {
      // backend may return token in body and/or set cookie; read both
      const res = await api.get("/csrf-token");
      const token = res?.data?.csrfToken || null;
      if (token) setCsrfToken(token);
      // If cookie was set, axios will use it automatically thanks to xsrfCookieName/xsrfHeaderName
      return token;
    } catch (err) {
      console.warn("fetchCsrfToken failed:", err);
      return null;
    }
  }, [api]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchCsrfToken();
      await fetchCurrentUser();
    })();
  }, [fetchCsrfToken, fetchCurrentUser]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await api.post("/login", { email, password });
      if (res.data.user) {
        setUser(res.data.user);
        await fetchCsrfToken(); // fresh token after login
        return { success: true, user: res.data.user };
      }
      return { success: false, error: "Invalid response from server" };
    } catch (err) {
      let errorMessage = "Login failed. Please try again.";
      if (err.response) {
        const data = err.response.data;
        errorMessage =
          data?.error || data?.message || `Invalid credentials (${err.response.status})`;
      }
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const res = await api.post("/register", userData);
      if (res.data.user) {
        setUser(res.data.user);
        await fetchCsrfToken();
        return { success: true, user: res.data.user };
      }
      return { success: false, error: "Registration failed" };
    } catch (err) {
      const message = err?.response?.data?.error || "Registration failed";
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setCsrfToken(null);
      setIsInitialized(false);
    }
  }, [api]);

  const changePassword = async (current_password, new_password) => {
    try {
      const res = await api.post("/change-password", {
        current_password,
        new_password,
      });
      return { success: true, message: res.data?.message || "Password changed" };
    } catch (err) {
      const message = err?.response?.data?.error || "Password change failed";
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    loading,
    isInitialized,
    api,
    csrfToken,
    fetchCsrfToken,
    login,
    register,
    logout,
    fetchCurrentUser,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
